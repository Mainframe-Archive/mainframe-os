// @flow

import ipcRPC from '@mainframe/rpc-ipc'
import type StreamRPC from '@mainframe/rpc-stream'

import { encodeVaultKey } from './utils'

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

  createUserIdentity(data: Object): Promise<{ id: string }> {
    return this._rpc.request('identity_createUser', [data])
  }

  getOwnUserIdentities(): Promise<{ ids: Array<string> }> {
    return this._rpc.request('identity_getOwnUsers')
  }

  // App lifecycle

  getInstalledApps(): Promise<{ apps: Array<Object> }> {
    // TODO: result type
    return this._rpc.request('app_getInstalled')
  }

  // TODO: input and result types
  installApp(
    manifest: Object,
    userID: string,
    settings: Object,
  ): Promise<Object> {
    return this._rpc.request('app_install', [manifest, userID, settings])
  }

  openApp(appID: string, userID: string): Promise<Object> {
    // TODO: result type
    return this._rpc.request('app_open', [appID, userID])
  }

  closeApp(sessID: string): Promise<void> {
    return this._rpc.request('app_close', [sessID])
  }

  // App permissions

  checkAppPermission(
    sessID: string,
    key: string,
    input?: ?string,
  ): Promise<{ result: string }> {
    // TODO: permission result type
    return this._rpc.request('app_checkPermission', [sessID, key, input])
  }

  setAppPermission(
    sessID: string,
    key: string,
    value: boolean | Object, // TODO: proper type
  ): Promise<void> {
    return this._rpc.request('app_setPermission', [sessID, key, value])
  }

  // Infrastructure interactions

  requestWeb3(sessID: string, method: string, params?: any): Promise<any> {
    return this._rpc.request('web3_request', [sessID, method, params])
  }
}
