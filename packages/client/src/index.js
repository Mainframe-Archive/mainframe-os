// @flow

import ipcRPC from '@mainframe/rpc-ipc'
import type StreamRPC from '@mainframe/rpc-stream'

export default class MainframeClient {
  _rpc: StreamRPC

  constructor(socketPath: string) {
    this._rpc = ipcRPC(socketPath)
  }

  apiVersion(): Promise<number> {
    return this._rpc.request('mf_apiVersion')
  }

  newVault(path: string, key: string): Promise<void> {
    return this._rpc.request('mf_newVault', [
      path,
      Buffer.from(key).toString('base64'),
    ])
  }

  openVault(path: string, key: string): Promise<void> {
    return this._rpc.request('mf_openVault', [
      path,
      Buffer.from(key).toString('base64'),
    ])
  }

  newUserIdentity(): Promise<string> {
    return this._rpc.request('mf_newUserIdentity')
  }

  apps(): Promise<Array<Object>> {
    return this._rpc.request('mf_apps')
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
