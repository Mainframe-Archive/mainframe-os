// @flow

import ipcRPC from '@mainframe/rpc-ipc'
import type StreamRPC from '@mainframe/rpc-stream'

import AppAPIs from './apis/App'
import BlockchainAPIs from './apis/Blockchain'
import IdentityAPIs from './apis/Identity'
import VaultAPIs from './apis/Vault'

export { idType } from '@mainframe/utils-id'
export * from './schema'
export * from './types'

export default class MainframeClient {
  _rpc: StreamRPC
  app: AppAPIs
  blockchain: BlockchainAPIs
  identity: IdentityAPIs
  vault: VaultAPIs

  constructor(socketPath: string) {
    this._rpc = ipcRPC(socketPath)
    this.app = new AppAPIs(this._rpc)
    this.blockchain = new BlockchainAPIs(this._rpc)
    this.identity = new IdentityAPIs(this._rpc)
    this.vault = new VaultAPIs(this._rpc)
  }

  close() {
    this._rpc._transport.complete()
  }

  // API utils

  apiVersion(): Promise<number> {
    return this._rpc.request('api_version')
  }
}
