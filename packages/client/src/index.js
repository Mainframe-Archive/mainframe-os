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

  apiVersion(): Promise<number> {
    return this._rpc.request('api_version')
  }

  createVault(path: string, key: string): Promise<void> {
    return this._rpc.request('vault_create', [path, encodeVaultKey(key)])
  }

  openVault(path: string, key: string): Promise<void> {
    return this._rpc.request('vault_open', [path, encodeVaultKey(key)])
  }

  createUserIdentity(): Promise<string> {
    return this._rpc.request('identity_createUser')
  }

  callWeb3(
    appID: string,
    identityID: string,
    method: string,
    params?: any,
  ): Promise<any> {
    return this._rpc.request('web3_call', [appID, identityID, method, params])
  }
}
