// @flow

import ipcRPC from '@mainframe/rpc-ipc'
import type StreamRPC from '@mainframe/rpc-stream'

import AppAPIs from './apis/App'
import BlockchainAPIs from './apis/Blockchain'
import CommsAPIs from './apis/Comms'
import ContactAPIs from './apis/Contact'
import GraphQLAPIs from './apis/GraphQL'
import IdentityAPIs from './apis/Identity'
import VaultAPIs from './apis/Vault'
import WalletAPIs from './apis/Wallet'

export { idType } from '@mainframe/utils-id'
export * from './schema'
export * from './types'

export default class MainframeClient {
  _rpc: StreamRPC
  app: AppAPIs
  blockchain: BlockchainAPIs
  comms: CommsAPIs
  contacts: ContactAPIs
  graphql: GraphQLAPIs
  identity: IdentityAPIs
  vault: VaultAPIs
  wallet: WalletAPIs

  constructor(socketPath: string) {
    this._rpc = ipcRPC(socketPath)
    this.app = new AppAPIs(this._rpc)
    this.blockchain = new BlockchainAPIs(this._rpc)
    this.comms = new CommsAPIs(this._rpc)
    this.contacts = new ContactAPIs(this._rpc)
    this.graphql = new GraphQLAPIs(this._rpc)
    this.identity = new IdentityAPIs(this._rpc)
    this.vault = new VaultAPIs(this._rpc)
    this.wallet = new WalletAPIs(this._rpc)
  }

  close() {
    this._rpc._transport.complete()
  }

  // API utils

  apiVersion(): Promise<number> {
    return this._rpc.request('api_version')
  }
}
