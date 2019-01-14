// @flow

import BzzAPI from '@erebos/api-bzz-node'
import PssAPI from '@erebos/api-pss'
import type StreamRPC from '@mainframe/rpc-stream'
import createWebSocketRPC from '@mainframe/rpc-ws-node'
import Web3HTTPProvider from 'web3-providers-http'

import ClientContext from './ClientContext'

export default class ContextIO {
  _context: ClientContext
  _rpc: ?StreamRPC
  _bzz: ?BzzAPI
  _pss: ?PssAPI
  _web3HttpProvider: ?Web3HTTPProvider

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
      this._bzz = new BzzAPI({ url: this._context.openVault.settings.bzzURL })
    }
    return this._bzz
  }

  get pss(): PssAPI {
    if (this._pss == null) {
      this._pss = new PssAPI(this.rpc)
    }
    return this._pss
  }

  get web3Provider(): Web3HTTPProvider {
    if (this._web3HttpProvider == null) {
      this._web3HttpProvider = new Web3HTTPProvider(
        this._context.openVault.settings.ethURL,
      )
    }
    return this._web3HttpProvider
  }

  clear() {
    this._bzz = undefined
    this._pss = undefined
    this._web3HttpProvider = undefined
    if (this._rpc != null) {
      this._rpc.disconnect()
    }
  }
}
