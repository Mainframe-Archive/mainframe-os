// @flow

import {
  getRequirementsDifference,
  type PermissionKey, // eslint-disable-line import/named
  type PermissionGrant, // eslint-disable-line import/named
} from '@mainframe/app-permissions'
// eslint-disable-next-line import/named
import { type base64 } from '@mainframe/utils-base64'
// eslint-disable-next-line import/named
import { uniqueID, idType, type ID } from '@mainframe/utils-id'

import { mapObject } from '../utils'

import App, {
  type AppSerialized,
  type AppUserSettings,
  type SessionData,
} from './App'
import { validateManifest, type AppManifest } from './manifest'

export type AppUpdate = {
  app: App,
  hasRequiredPermissionsChanges: boolean,
}

export type AppUpdateSerialized = {
  app: AppSerialized,
  hasRequiredPermissionsChanges: boolean,
}

export type AppsRepositorySerialized = {
  apps: { [string]: AppSerialized },
  updates: { [string]: AppUpdateSerialized },
}

type Apps = { [ID]: App }
type AppUpdates = { [ID]: AppUpdate }

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

export default class AppsRepository {
  static fromJSON = (serialized: AppsRepositorySerialized): AppsRepository => {
    return new AppsRepository(
      // $FlowFixMe: mapping type
      appsFromJSON(serialized.apps),
      // $FlowFixMe: mapping type
      updatesFromJSON(serialized.updates),
    )
  }

  static toJSON = (registry: AppsRepository): AppsRepositorySerialized => ({
    // $FlowFixMe: mapping type
    apps: appsToJSON(registry.apps),
    // $FlowFixMe: mapping type
    updates: updatesToJSON(registry.updates),
  })

  _apps: Apps
  _byBase64: { [base64]: ID }
  _updates: AppUpdates

  constructor(apps: Apps = {}, updates?: AppUpdates = {}) {
    this._apps = apps
    this._byBase64 = Object.keys(apps).reduce((acc, appID) => {
      const id = idType(appID)
      // $FlowFixMe: manifest.id base64 type
      acc[apps[id].manifest.id] = id
      return acc
    }, {})
    this._updates = updates
  }

  get apps(): Apps {
    return this._apps
  }

  get updates(): AppUpdates {
    return this._updates
  }

  getByID(id: ID): ?App {
    return this._apps[id]
  }

  getByBase64(b64: base64): ?App {
    const id = this._byBase64[b64]
    if (id != null) {
      return this._apps[id]
    }
  }

  getID(b64: base64): ?ID {
    return this._byBase64[b64]
  }

  add(manifest: AppManifest, userID: ID, settings: AppUserSettings): ID {
    if (validateManifest(manifest) === 'valid') {
      throw new Error('Invalid manifest')
    }

    const appID = uniqueID()

    this._apps[appID] = new App({
      appID,
      manifest,
      installationState: 'ready', // TODO: actual lifecycle flow
      settings: {
        [(userID: string)]: {
          permissions: settings.permissions,
        },
      },
    })
    this._byBase64[manifest.id] = appID

    return appID
  }

  setUserSettings(appID: ID, userID: ID, settings: AppUserSettings): void {
    const app = this.getByID(appID)
    if (app == null) {
      throw new Error('Invalid app')
    }
    app.setSettings(userID, settings)
  }

  setUserPermission(
    appID: ID,
    userID: ID,
    key: PermissionKey,
    value: PermissionGrant,
  ): void {
    const app = this.getByID(appID)
    if (app == null) {
      throw new Error('Invalid app')
    }
    app.setPermission(userID, key, value)
  }

  removeUser(appID: ID, userID: ID): void {
    const app = this.getByID(appID)
    if (app == null) {
      throw new Error('Invalid app')
    }
    app.removeUser(userID)
  }

  remove(id: ID): void {
    const app = this.getByID(id)
    if (app != null) {
      // TODO: handle "clean" option to remove the app contents
      delete this._byBase64[app.manifest.id]
      delete this._apps[id]
    }
  }

  createSession(appID: ID, userID: ID): SessionData {
    const app = this.getByID(appID)
    if (app == null) {
      throw new Error('Invalid app')
    }
    return app.createSession(userID)
  }

  hasUpdate(id: ID): boolean {
    return this._updates[id] !== null
  }

  getUpdate(id: ID): ?AppUpdate {
    return this._updates[id]
  }

  createUpdate(appID: ID, manifest: AppManifest): AppUpdate {
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
        installationState: 'ready', // TODO: actual lifecycle flow
        settings,
      }),
      hasRequiredPermissionsChanges,
    }

    this._updates[appID] = update
    return update
  }
}
