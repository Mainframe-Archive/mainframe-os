// @flow

/* eslint-env browser */

import type StreamRPC from '@mainframe/rpc-stream'

import EthAPIs from './apis/Eth'
import ContactsAPIs from './apis/Contacts'
import PaymentAPIs from './apis/Payments'

export * from './types'

export default class MainframeSDK {
  _rpc: StreamRPC
  _ethereum: EthAPIs
  contacts: ContactsAPIs
  payments: PaymentAPIs

  constructor() {
    if (window.mainframe) {
      this._rpc = window.mainframe.rpc
    } else {
      throw new Error('Cannot find expected mainframe client instance')
    }

    this.contacts = new ContactsAPIs(this._rpc)
    this.payments = new PaymentAPIs(this)
  }

  get ethereum() {
    // Lazy load Eth API's as provider
    // engine will start fetching blocks
    if (!this._ethereum) {
      this._ethereum = new EthAPIs(this)
    }
    return this._ethereum
  }

  apiVersion = () => {
    return this._rpc.request('api_version')
  }
}
