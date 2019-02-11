// @flow

import { validateManifest, type ManifestData } from '@mainframe/app-manifest'
import {
  getRequirementsDifference,
  type PermissionKey,
  type PermissionGrant,
  type StrictPermissionsRequirements,
} from '@mainframe/app-permissions'
import type { AppUserPermissionsSettings } from '@mainframe/client'
import { getAppContentsPath, type Environment } from '@mainframe/config'
import { MFID } from '@mainframe/data-types'
import { uniqueID, idType, type ID } from '@mainframe/utils-id'

import { mapObject } from '../utils'

import type {
  ApprovedContact,
  ContactToApprove,
  SessionData,
} from './AbstractApp'
import App, { type AppSerialized } from './App'
import OwnApp, {
  type OwnAppCreationParams,
  type OwnAppSerialized,
} from './OwnApp'

export type AppUpdate = {
  app: App,
  hasRequiredPermissionsChanges: boolean,
}

export type AppUpdateSerialized = {
  app: AppSerialized,
  hasRequiredPermissionsChanges: boolean,
}

type Apps = { [id: string]: App }
type AppUpdates = { [id: string]: AppUpdate }
type OwnApps = { [id: string]: OwnApp }

const appsToJSON = mapObject(App.toJSON)
const appsFromJSON = mapObject(App.fromJSON)

const updatesToJSON = mapObject((update: AppUpdate) => ({
  app: App.toJSON(update.app),
  hasRequiredPermissionsChanges: update.hasRequiredPermissionsChanges,
}))
const updatesFromJSON = mapObject((serialized: AppUpdateSerialized) => ({
  app: App.fromJSON(serialized.app),
  hasRequiredPermissionsChanges: serialized.hasRequiredPermissionsChanges,
}))

const ownAppsToJSON = mapObject(OwnApp.toJSON)
const ownAppsFromJSON = mapObject(OwnApp.fromJSON)

export type AppsRepositoryParams = {
  apps?: Apps,
  updates?: AppUpdates,
  ownApps?: OwnApps,
}

export type AppsRepositorySerialized = {
  apps: { [string]: AppSerialized },
  updates: { [string]: AppUpdateSerialized },
  ownApps: { [string]: OwnAppSerialized },
}

export type UpdateAppDetailsParams = {
  appID: string,
  contentsPath: string,
  name: string,
  version: string,
}

export const getContentsPath = (
  env: Environment,
  manifest: ManifestData,
): string => {
  return getAppContentsPath(env, manifest.id, manifest.version)
}

export default class AppsRepository {
  static fromJSON = (serialized: AppsRepositorySerialized): AppsRepository => {
    return new AppsRepository({
      // $FlowFixMe: mapping type
      apps: appsFromJSON(serialized.apps),
      // $FlowFixMe: mapping type
      updates: updatesFromJSON(serialized.updates),
      // $FlowFixMe: mapping type
      ownApps: ownAppsFromJSON(serialized.ownApps),
    })
  }

  static toJSON = (registry: AppsRepository): AppsRepositorySerialized => ({
    // $FlowFixMe: mapping type
    apps: appsToJSON(registry.apps),
    // $FlowFixMe: mapping type
    updates: updatesToJSON(registry.updates),
    // $FlowFixMe: mapping type
    ownApps: ownAppsToJSON(registry.ownApps),
  })

  _apps: Apps
  _updates: AppUpdates
  _ownApps: OwnApps
  _byHash: { [hash: string]: ID } = {}
  _byMFID: { [mfid: string]: ID } = {}
  _appsByUser: { [uid: ID]: Array<ID> } = {}

  constructor(params: AppsRepositoryParams = {}) {
    this._apps = params.apps || {}
    this._updates = params.updates || {}
    this._ownApps = params.ownApps || {}

    // Fill references for apps

    Object.keys(this._ownApps).forEach(appID => {
      const id = idType(appID)
      const ownApp = this._ownApps[id]
      const mfid = MFID.canonical(ownApp.data.mfid)
      this._byMFID[mfid] = id

      if (ownApp.updateFeed.feedHash) {
        this._byHash[ownApp.updateFeed.feedHash] = id
      }

      Object.keys(ownApp.settings).forEach(uid => {
        const userID = idType(uid)
        if (this._appsByUser[userID]) {
          this._appsByUser[userID].push(id)
        } else {
          this._appsByUser[userID] = [id]
        }
      })
    })

    Object.keys(this._apps).forEach(appID => {
      const id = idType(appID)
      const app = this._apps[id]
      this._byHash[app.manifest.updateHash] = id
      const mfid = MFID.canonical(app.manifest.id)
      this._byMFID[mfid] = id

      Object.keys(app.settings).forEach(uid => {
        const userID = idType(uid)
        if (this._appsByUser[userID]) {
          this._appsByUser[userID].push(id)
        } else {
          this._appsByUser[userID] = [id]
        }
      })
    })
  }

  // Getters

  get apps(): Apps {
    return this._apps
  }

  get updates(): AppUpdates {
    return this._updates
  }

  get ownApps(): OwnApps {
    return this._ownApps
  }

  getByID(id: ID | string): ?App {
    return this._apps[id] || this._ownApps[id]
  }

  getByMFID(mfid: string | MFID): ?App {
    const id = this.getID(mfid)
    if (id != null) {
      return this._apps[id]
    }
  }

  getID(mfid: string | MFID): ?ID {
    return this._byMFID[MFID.canonical(mfid)]
  }

  getOwnByID(id: ID): ?OwnApp {
    return this._ownApps[id]
  }

  getOwnByMFID(mfid: string | MFID): ?OwnApp {
    const id = this.getID(mfid)
    if (id != null) {
      return this._ownApps[id]
    }
  }

  getAnyByID(id: ID | string): ?(App | OwnApp) {
    return this.getByID(idType(id)) || this.getOwnByID(idType(id))
  }

  getAppsForUser(id: ID): Array<App> {
    const apps = []
    if (this._appsByUser[id]) {
      this._appsByUser[id].forEach(id => {
        const app = this.getByID(id)
        if (app) {
          apps.push(app)
        }
      })
    }
    return apps
  }

  // App lifecycle

  add(
    manifest: ManifestData,
    userID: ID,
    permissionsSettings: AppUserPermissionsSettings,
  ): App {
    if (validateManifest(manifest) === 'valid') {
      throw new Error('Invalid manifest')
    }

    const appID = uniqueID()
    const app = new App({
      appID,
      manifest,
      installationState: 'pending',
    })
    app.setPermissionsSettings(userID, permissionsSettings)

    this._apps[appID] = app
    this._byHash[manifest.updateHash] = appID
    this._byMFID[MFID.canonical(manifest.id)] = appID

    return app
  }

  updateAppDetails(params: UpdateAppDetailsParams): void {
    const app = this.getOwnByID(idType(params.appID))
    if (app == null) {
      throw new Error('Invalid app')
    }
    app.name = params.name
    app.contentsPath = params.contentsPath
    app.editNextVersionNumber(params.version)
  }

  setUserPermissionsSettings(
    appID: ID,
    userID: ID,
    settings: AppUserPermissionsSettings,
  ): void {
    const app = this.getAnyByID(appID)
    if (app == null) {
      throw new Error('Invalid app')
    }
    app.setPermissionsSettings(userID, settings)
  }

  setUserPermission(
    appID: ID,
    userID: ID,
    key: PermissionKey,
    value: PermissionGrant,
  ): void {
    const app = this.getAnyByID(appID)
    if (app == null) {
      throw new Error('Invalid app')
    }
    app.setPermission(userID, key, value)
  }

  approveContacts(
    appID: ID | string,
    userID: ID | string,
    contactsToApprove: Array<ContactToApprove>,
  ): { [id: string]: ApprovedContact } {
    const app = this.getAnyByID(appID)
    if (app == null) {
      throw new Error('Invalid app')
    }
    return app.approveContacts(idType(userID), contactsToApprove)
  }

  removeUser(appID: ID, userID: ID): void {
    const app = this.getAnyByID(appID)
    if (app == null) {
      throw new Error('Invalid app')
    }
    app.removeUser(userID)
  }

  remove(id: ID): void {
    // TODO: support removing own apps - might be other method/flag to avoid accidents?
    const app = this.getByID(id)
    if (app != null) {
      if (app instanceof OwnApp) {
        delete this._byMFID[app.mfid]
        delete this._ownApps[id]
      } else {
        // TODO: handle "clean" option to remove the app contents
        delete this._byHash[app.manifest.updateHash]
        delete this._byMFID[app.manifest.id]
        delete this._apps[id]
      }
    }
  }

  createSession(appID: ID, userID: ID): SessionData {
    const app = this.getAnyByID(appID)
    if (app == null) {
      throw new Error('Invalid app')
    }
    return app.createSession(userID)
  }

  // Updates

  hasUpdate(id: ID): boolean {
    return this._updates[id] !== null
  }

  getUpdate(id: ID): ?AppUpdate {
    return this._updates[id]
  }

  createUpdate(appID: ID, manifest: ManifestData): AppUpdate {
    const app = this.getByID(appID)
    if (app == null) {
      throw new Error('Invalid app')
    }

    const permissionsDiff = getRequirementsDifference(
      app.manifest.permissions,
      manifest.permissions,
    )
    const hasRequiredPermissionsChanges =
      Object.keys(permissionsDiff.required.added).length > 0 ||
      Object.keys(permissionsDiff.required.changed).length > 0

    // When required permissions are added or changed,
    // reset `permissionsChecked` to false so it requires user action before any grant
    const settings = hasRequiredPermissionsChanges
      ? Object.keys(app.settings).reduce((acc, userID) => {
          acc[userID] = {
            ...app.settings[idType(userID)],
            permissionsChecked: false,
          }
          return acc
        }, {})
      : { ...app.settings }

    const update = {
      app: new App({
        appID,
        manifest,
        installationState: 'pending',
        settings,
      }),
      hasRequiredPermissionsChanges,
    }

    this._updates[appID] = update
    return update
  }

  // Own apps

  create(params: OwnAppCreationParams): OwnApp {
    const app = OwnApp.create(params)
    this._byMFID[MFID.canonical(app.mfid)] = app.id
    this._ownApps[app.id] = app
    return app
  }

  createNextVersion(
    id: ID,
    version: string,
    permissions?: StrictPermissionsRequirements,
  ): void {
    const app = this.getOwnByID(id)
    if (app == null) {
      throw new Error('App not found')
    }
    app.createNextVersion(version, permissions)
  }
}
