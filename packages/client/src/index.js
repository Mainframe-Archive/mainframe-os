// @flow

import type { ManifestData } from '@mainframe/app-manifest'
import type {
  PermissionCheckResult,
  PermissionGrant,
  PermissionKey,
  PermissionsDetails,
} from '@mainframe/app-permissions'
import ipcRPC from '@mainframe/rpc-ipc'
import type StreamRPC from '@mainframe/rpc-stream'
import type { ID } from '@mainframe/utils-id'

// TODO: extract API types from daemon
type AppUserSettings = Object

export type User = {
  id: ID,
  data: Object,
}

export type OwnUser = {
  id: ID,
  data: Object,
}

export type App = {
  id: ID,
  manifest: ManifestData,
  contentsPath: string,
}

export type Session = {
  id: ID,
  permissions: PermissionsDetails,
}

export type ClientSession = {
  session: Session,
  user: User,
  app: App,
}

export type InstalledApp = {
  manifest: ManifestData,
  users: Array<ID>,
}

export default class MainframeClient {
  _rpc: StreamRPC

  constructor(socketPath: string) {
    this._rpc = ipcRPC(socketPath)
  }

  close() {
    this._rpc._transport.complete()
  }

  // API utils

  apiVersion(): Promise<number> {
    return this._rpc.request('api_version')
  }

  // Vault

  createVault(path: string, password: string): Promise<void> {
    return this._rpc.request('vault_create', { path, password })
  }

  openVault(path: string, password: string): Promise<void> {
    return this._rpc.request('vault_open', { path, password })
  }

  // Identities

  createUserIdentity(data?: Object = {}): Promise<{ id: ID }> {
    return this._rpc.request('identity_createUser', { data })
  }

  createDeveloperIdentity(data?: Object = {}): Promise<{ id: ID }> {
    return this._rpc.request('identity_createDeveloper', { data })
  }

  getOwnUserIdentities(): Promise<{ developers: Array<OwnUser> }> {
    return this._rpc.request('identity_getOwnUsers')
  }

  getOwnDeveloperIdentities(): Promise<{ users: Array<OwnUser> }> {
    return this._rpc.request('identity_getOwnDevelopers')
  }

  // App lifecycle

  getInstalledApps(): Promise<{ apps: Array<InstalledApp> }> {
    return this._rpc.request('app_getInstalled')
  }

  installApp(
    manifest: ManifestData,
    userID: ID,
    settings: AppUserSettings,
  ): Promise<ID> {
    return this._rpc.request('app_install', { manifest, userID, settings })
  }

  openApp(appID: ID, userID: ID): Promise<ClientSession> {
    return this._rpc.request('app_open', { appID, userID })
  }

  closeApp(sessID: string): Promise<void> {
    return this._rpc.request('app_close', { sessID })
  }

  removeApp(appID: ID): Promise<void> {
    return this._rpc.request('app_remove', { appID })
  }

  // App permissions

  checkAppPermission(
    sessID: ID,
    key: PermissionKey,
    input?: ?string,
  ): Promise<{ result: PermissionCheckResult }> {
    return this._rpc.request('app_checkPermission', { sessID, key, input })
  }

  setAppPermission(
    sessID: ID,
    key: PermissionKey,
    value: PermissionGrant,
  ): Promise<void> {
    return this._rpc.request('app_setPermission', { sessID, key, value })
  }

  // Own apps

  createApp(params: {
    contentsPath: string,
    developerID?: ?ID,
    name?: ?string,
    version?: ?string,
  }): Promise<{ id: ID }> {
    return this._rpc.request('app_create', params)
  }

  publishAppContents(params: {
    appID: ID,
    version?: ?string,
  }): Promise<{ contentsURI: string }> {
    return this._rpc.request('app_publishContents', params)
  }

  writeAppManifest(params: {
    appID: ID,
    path: string,
    version?: ?string,
  }): Promise<void> {
    return this._rpc.request('app_writeManifest', params)
  }

  // Infrastructure interactions

  requestWeb3(sessID: ID, method: string, params?: any): Promise<any> {
    return this._rpc.request('web3_request', { sessID, method, params })
  }
}
