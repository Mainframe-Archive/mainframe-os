// @flow

import type {
  PermissionCheckResult,
  PermissionGrant,
  PermissionKey,
  PermissionsDetails,
} from '@mainframe/app-permissions'
import ipcRPC from '@mainframe/rpc-ipc'
import type StreamRPC from '@mainframe/rpc-stream'
import type { ID } from '@mainframe/utils-id'

import { encodeVaultKey } from './utils'

// TODO: extract API types from daemon
type AppManifest = Object
type AppUserSettings = Object

type ClientSession = {
  id: ID,
  permissions: PermissionsDetails,
}

type InstalledApp = {
  manifest: AppManifest,
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

  createVault(path: string, key: string): Promise<void> {
    return this._rpc.request('vault_create', [path, encodeVaultKey(key)])
  }

  openVault(path: string, key: string): Promise<void> {
    return this._rpc.request('vault_open', [path, encodeVaultKey(key)])
  }

  // Identities

  createUserIdentity(data: Object): Promise<{ id: ID }> {
    return this._rpc.request('identity_createUser', [data])
  }

  getOwnUserIdentities(): Promise<{ ids: Array<ID> }> {
    return this._rpc.request('identity_getOwnUsers')
  }

  // App lifecycle

  getInstalledApps(): Promise<{ apps: Array<InstalledApp> }> {
    return this._rpc.request('app_getInstalled')
  }

  installApp(
    manifest: AppManifest,
    userID: ID,
    settings: AppUserSettings,
  ): Promise<ClientSession> {
    return this._rpc.request('app_install', [manifest, userID, settings])
  }

  openApp(appID: ID, userID: ID): Promise<ClientSession> {
    return this._rpc.request('app_open', [appID, userID])
  }

  closeApp(sessID: string): Promise<void> {
    return this._rpc.request('app_close', [sessID])
  }

  // App permissions

  checkAppPermission(
    sessID: ID,
    key: PermissionKey,
    input?: ?string,
  ): Promise<{ result: PermissionCheckResult }> {
    return this._rpc.request('app_checkPermission', [sessID, key, input])
  }

  setAppPermission(
    sessID: ID,
    key: PermissionKey,
    value: PermissionGrant,
  ): Promise<void> {
    return this._rpc.request('app_setPermission', [sessID, key, value])
  }

  // Infrastructure interactions

  requestWeb3(sessID: string, method: string, params?: any): Promise<any> {
    return this._rpc.request('web3_request', [sessID, method, params])
  }
}
