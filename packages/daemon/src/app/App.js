// @flow

import type { ManifestData } from '@mainframe/app-manifest'
import {
  createHTTPSRequestGrant,
  mergeGrantsToDetails,
  type PermissionGrant, // eslint-disable-line import/named
  type PermissionKey, // eslint-disable-line import/named
  type PermissionsDetails, // eslint-disable-line import/named
  type PermissionsGrants, // eslint-disable-line import/named
} from '@mainframe/app-permissions'
// eslint-disable-next-line import/named
import { idType, uniqueID, type ID } from '@mainframe/utils-id'

import Session from './Session'

const DEFAULT_SETTINGS = {
  permissions: {
    HTTPS_REQUEST: [],
  },
  permissionsChecked: false,
}

export type SessionData = {
  sessID: ID,
  session: Session,
  permissions: PermissionsDetails,
}

export type AppInstallationState =
  | 'pending'
  | 'hash_lookup'
  | 'hash_not_found'
  | 'downloading'
  | 'download_error'
  | 'ready'

export type AppUserSettings = {
  permissions: PermissionsGrants,
  permissionsChecked: boolean,
}

export type AppParams = {
  appID: ID,
  manifest: ManifestData,
  installationState: AppInstallationState,
  settings?: { [ID]: AppUserSettings },
}

export type AppSerialized = AppParams

export default class App {
  static fromJSON = (params: AppSerialized): App => new App(params)

  static toJSON = (app: App): AppSerialized => ({
    appID: app._appID,
    installationState: app._installationState,
    manifest: app._manifest,
    settings: app._settings,
  })

  _appID: ID
  _installationState: AppInstallationState
  _manifest: ManifestData
  _settings: { [ID]: AppUserSettings }

  constructor(params: AppParams) {
    this._appID = params.appID
    this._installationState = params.installationState
    this._manifest = params.manifest
    this._settings = params.settings == null ? {} : params.settings
  }

  // Accessors

  get id(): ID {
    return this._appID
  }

  get installationState(): AppInstallationState {
    return this._installationState
  }

  set installationState(value: AppInstallationState): void {
    this._installationState = value
  }

  get manifest(): ManifestData {
    return this._manifest
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
      (key === 'HTTPS_REQUEST' && typeof value === 'object') ||
      (key !== 'HTTPS_REQUEST' && typeof value === 'boolean')
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

  createSession(userID: ID): SessionData {
    if (!this.getPermissionsChecked(userID)) {
      throw new Error('Permissions need to be checked by user')
    }

    const requiredPermissions = this.manifest.permissions.required
    const appPermissions = {
      ...requiredPermissions,
      HTTPS_REQUEST: createHTTPSRequestGrant(requiredPermissions.HTTPS_REQUEST),
    }
    const userPermissions = this.getPermissions(userID) || {
      HTTPS_REQUEST: createHTTPSRequestGrant(),
    }
    const permissions = mergeGrantsToDetails(appPermissions, userPermissions)
    const session = new Session(this._appID, userID, permissions.session)
    return {
      permissions,
      sessID: uniqueID(),
      session,
    }
  }
}
