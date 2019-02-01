// @flow

/* eslint-env browser */

import type StreamRPC from '@mainframe/rpc-stream'

import BlockchainAPIs from './apis/Blockchain'
import ContactsAPIs from './apis/Contacts'
import PaymentAPIs from './apis/Payments'
import PssAPIs from './apis/Pss'

export * from './types'

export default class MainframeSDK {
  _rpc: StreamRPC
  _blockchain: BlockchainAPIs
  pss: PssAPIs
  contacts: ContactsAPIs
  payments: PaymentAPIs

  constructor() {
    if (window.mainframe) {
      this._rpc = window.mainframe.rpc
    } else {
      throw new Error('Cannot find expected mainframe client instance')
    }

    this.pss = new PssAPIs(this._rpc)
    this.contacts = new ContactsAPIs(this._rpc)
    this.payments = new PaymentAPIs(this)
  }

  get blockchain() {
    // Lazy load blockchain API's as provider
    // engine will start fetching blocks
    if (!this._blockchain) {
      this._blockchain = new BlockchainAPIs(this)
    }
    return this._blockchain
  }

  apiVersion = () => {
    return this._rpc.request('api_version')
  }
}
