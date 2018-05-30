// @flow

import type { ID } from '@mainframe/utils-id'

// TODO: better type or class to handle validation
export type AppManifest = Object

export type AppInstallationState =
  | 'manifest-pending'
  | 'manifest-downloading'
  | 'manifest-invalid-signature'
  | 'manifest-invalid-schema'
  | 'confirmation-pending'
  | 'package-lookup'
  | 'package-invalid-hash'
  | 'package-download-started'
  | 'package-download-failed'
  | 'package-download-done'
  | 'package-invalid-signature'
  | 'ready'

export type PermissionKey = 'CALL_WEB3'

export type PermissionGrant = 'allow' | 'ask' | 'deny'

export type PermissionConfig = {
  grant: PermissionGrant,
}

export type AppIdentitySettings = {
  permissions: { [PermissionKey]: PermissionConfig },
}

export type AppParams = {
  appID: ID,
  currentUserID: ID,
  manifest: AppManifest,
  installationState: AppInstallationState,
  settings?: { [ID]: AppIdentitySettings },
}

export type AppSerialized = AppParams

export default class App {
  static fromJSON = (params: AppSerialized): App => new App(params)

  static toJSON = (app: App): AppSerialized => ({
    appID: app._appID,
    currentUserID: app._currentUserID,
    manifest: app._manifest,
    installationState: app._installationState,
    settings: app._settings,
  })

  _appID: ID
  _currentUserID: ID
  _manifest: AppManifest
  _installationState: AppInstallationState
  _settings: { [ID]: AppIdentitySettings }

  constructor(params: AppParams) {
    this._appID = params.appID
    this._currentUserID = params.currentUserID
    this._manifest = params.manifest
    this._installationState = params.installationState
    this._settings = params.settings == null ? {} : params.settings
  }

  get id(): ID {
    return this._appID
  }

  getUserPermission(userID: ID, key: PermissionKey): ?PermissionConfig {
    const settings = this._settings[userID]
    if (settings != null && settings.permissions != null) {
      return settings.permissions[key]
    }
  }

  getPermission(key: PermissionKey): ?PermissionConfig {
    return this.getUserPermission(this._currentUserID, key)
  }

  setUserPermission(
    userID: ID,
    key: PermissionKey,
    value: PermissionConfig,
  ): void {
    const settings = this._settings[userID] || { permissions: {} }
    settings.permissions[key] = value
    this._settings[userID] = settings
  }

  setPermission(key: PermissionKey, value: PermissionConfig): void {
    this.setUserPermission(this._currentUserID, key, value)
  }

  grantUserPermission(
    userID: ID,
    key: PermissionKey,
    grant?: PermissionGrant = 'allow',
  ): void {
    const permission = this.getUserPermission(userID, key) || {}
    permission.grant = grant
    this.setUserPermission(userID, key, permission)
  }

  grantPermission(key: PermissionKey, grant?: PermissionGrant): void {
    this.grantUserPermission(this._currentUserID, key, grant)
  }
}
