// @flow

import type {
  PermissionGrant,
  PermissionKey,
  PermissionsDetails,
  PermissionsGrants,
} from '@mainframe/app-permissions'
// eslint-disable-next-line import/named
import { idType, type ID } from '@mainframe/utils-id'

import type Session from './Session'

const DEFAULT_SETTINGS = {
  permissions: {
    WEB_REQUEST: [],
  },
  permissionsChecked: false,
}

export type SessionData = {
  sessID: ID,
  session: Session,
  permissions: PermissionsDetails,
}

export type AppUserSettings = {
  permissions: PermissionsGrants,
  permissionsChecked: boolean,
}

export type AbstractAppParams = {
  appID: ID,
  settings?: { [ID]: AppUserSettings },
}

export type AbstractAppSerialized = AbstractAppParams

export default class AbstractApp {
  static toJSON = (app: AbstractApp): AbstractAppSerialized => ({
    appID: app._appID,
    settings: app._settings,
  })

  _appID: ID
  _settings: { [ID]: AppUserSettings }

  constructor(params: AbstractAppParams) {
    this._appID = params.appID
    this._settings = params.settings == null ? {} : params.settings
  }

  // Accessors

  get id(): ID {
    return this._appID
  }

  get settings(): { [ID]: AppUserSettings } {
    return this._settings
  }

  get userIDs(): Array<ID> {
    return Object.keys(this._settings).map(idType)
  }

  // Settings

  getSettings(userID: ID): AppUserSettings {
    return this._settings[userID] || { ...DEFAULT_SETTINGS }
  }

  setSettings(userID: ID, settings: AppUserSettings): void {
    this._settings[userID] = settings
  }

  getPermissions(userID: ID): ?PermissionsGrants {
    const settings = this._settings[userID]
    if (settings != null && settings.permissions != null) {
      return settings.permissions
    }
  }

  setPermissions(userID: ID, permissions: PermissionsGrants): void {
    const settings = this.getSettings(userID)
    settings.permissions = permissions
    this._settings[userID] = settings
  }

  getPermission(userID: ID, key: PermissionKey): ?PermissionGrant {
    const permissions = this.getPermissions(userID)
    if (permissions != null) {
      return permissions[key]
    }
  }

  setPermission(userID: ID, key: PermissionKey, value: PermissionGrant): void {
    const { permissions } = this.getSettings(userID)
    if (
      (key === 'WEB_REQUEST' && typeof value === 'object') ||
      (key !== 'WEB_REQUEST' && typeof value === 'boolean')
    ) {
      // $FlowFixMe: value polymorphism
      permissions[key] = value
      this.setPermissions(userID, permissions)
    }
  }

  getPermissionsChecked(userID: ID): boolean {
    return this.getSettings(userID).permissionsChecked
  }

  setPermissionsChecked(userID: ID, checked: boolean) {
    const settings = this.getSettings(userID)
    settings.permissionsChecked = checked
    this._settings[userID] = settings
  }

  removeUser(userID: ID) {
    delete this._settings[userID]
  }

  // Session

  createSession(_userID: ID): SessionData {
    throw new Error('Must be implemented')
  }
}
