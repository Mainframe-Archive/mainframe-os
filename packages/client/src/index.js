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
    return this._rpc.request('mf_apiVersion')
  }

  newVault(path: string, key: string): Promise<void> {
    return this._rpc.request('mf_newVault', [path, encodeVaultKey(key)])
  }

  openVault(path: string, key: string): Promise<void> {
    return this._rpc.request('mf_openVault', [path, encodeVaultKey(key)])
  }

  newUserIdentity(): Promise<string> {
    return this._rpc.request('mf_newUserIdentity')
  }

  callWeb3(
    appID: string,
    identityID: string,
    method: string,
    params?: any,
  ): Promise<any> {
    return this._rpc.request('mf_callWeb3', [appID, identityID, method, params])
  }
}
