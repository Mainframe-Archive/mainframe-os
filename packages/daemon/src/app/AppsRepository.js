// @flow

// eslint-disable-next-line import/named
import { uniqueID, idType, type ID } from '@mainframe/utils-id'

import { mapObject, type MFID } from '../utils'

import App, {
  type AppManifest,
  type AppSerialized,
  type AppUserSettings,
  type PermissionKey,
  type PermissionGrant,
  type SessionData,
} from './App'

export type AppsRepositorySerialized = Array<AppSerialized>

type Apps = { [ID]: App }

const appsToJSON = mapObject(App.toJSON)
const appsFromJSON = mapObject(App.fromJSON)

export default class AppsRepository {
  static fromJSON = (serialized: AppsRepositorySerialized): AppsRepository => {
    // $FlowFixMe: mapping type
    return new AppsRepository(appsFromJSON(serialized))
  }

  static toJSON = (registry: AppsRepository): AppsRepositorySerialized => {
    // $FlowFixMe: mapping type
    return appsToJSON(manager.apps)
  }

  _apps: Apps
  _byMFID: { [MFID]: ID }

  constructor(apps: Apps = {}) {
    this._apps = apps
    this._byMFID = Object.keys(apps).reduce((acc, appID) => {
      const id = idType(appID)
      acc[apps[id].manifest.id] = id
      return acc
    }, {})
  }

  get apps(): Apps {
    return this._apps
  }

  getByID(id: ID): ?App {
    return this._apps[id]
  }

  getByMFID(mfid: MFID): ?App {
    const id = this._byMFID[mfid]
    if (id != null) {
      return this._apps[id]
    }
  }

  getID(mfid: MFID): ?ID {
    return this._byMFID[mfid]
  }

  add(manifest: AppManifest, userID: ID, settings: AppUserSettings): ID {
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
    this._byMFID[manifest.id] = appID

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
      delete this._byMFID[app.manifest.id]
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
}
