// @flow

import BzzAPI from '@erebos/api-bzz-node'
import PssAPI from '@erebos/api-pss'
import { sign } from '@erebos/secp256k1'
import type StreamRPC from '@mainframe/rpc-stream'
import createWebSocketRPC from '@mainframe/rpc-ws-node'
import { EthClient } from '@mainframe/eth'

import type ClientContext from './ClientContext'

class WalletProvider {
  _context: ClientContext
  constructor(context: ClientContext) {
    this._context = context
  }
  getAccounts() {
    const id = Object.keys(this._context.openVault.identities.ownUsers)[0]
    return Promise.resolve(this._context.queries.getUserEthAccounts(id))
  }
  signTransaction(params) {
    return this._context.openVault.wallets.signEthTransaction(params)
  }
  sign(params) {
    return Promise.resolve(this._context.openVault.wallets.signEthData(params))
  }
}

export default class ContextIO {
  _context: ClientContext
  _rpc: ?StreamRPC
  _bzz: ?BzzAPI
  _pss: ?PssAPI
  _ethClient: ?EthClient

  constructor(context: ClientContext) {
    this._context = context
  }

  get rpc(): StreamRPC {
    if (this._rpc == null) {
      this._rpc = createWebSocketRPC(this._context.openVault.settings.pssURL)
    }
    return this._rpc
  }

  get bzz(): BzzAPI {
    if (this._bzz == null) {
      this._bzz = new BzzAPI({
        url: this._context.openVault.settings.bzzURL,
        signFeedDigest: async (digest: Array<number>, key: ?Object) => {
          if (key == null) {
            throw new Error('Missing signing key')
          }
          return sign(digest, key)
        },
      })
    }
    return this._bzz
  }

  get pss(): PssAPI {
    if (this._pss == null) {
      this._pss = new PssAPI(this.rpc)
    }
    return this._pss
  }

  get eth(): EthClient {
    if (this._ethClient == null) {
      const walletProvider = new WalletProvider(this._context)
      this._ethClient = new EthClient(
        this._context.openVault.settings.ethURL,
        walletProvider,
      )
    }
    return this._ethClient
  }

  checkEthConnection() {
    // Handle WS disconnects
    if (
      this.eth.web3Provider.connection &&
      this.eth.web3Provider.connection.readyState !== 1
    ) {
      const walletProvider = new WalletProvider(this._context)
      this._ethClient = new EthClient(
        this._context.openVault.settings.ethURL,
        walletProvider,
      )
    }
  }

  clear() {
    this._bzz = undefined
    this._pss = undefined
    this._ethClient = undefined
    if (this._rpc != null) {
      this._rpc.disconnect()
    }
  }
}
