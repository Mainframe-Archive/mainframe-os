// @flow

/* eslint-env browser */

import type StreamRPC from '@mainframe/rpc-stream'

import EthAPIs from './apis/Eth'
import CommsAPIs from './apis/Comms'
import StorageAPIs from './apis/Storage'
import ContactsAPIs from './apis/Contacts'
import PaymentAPIs from './apis/Payments'

export * from './types'

export default class MainframeSDK {
  _rpc: StreamRPC
  _ethereum: EthAPIs
  comms: CommsAPIs
  storage: StorageAPIs
  contacts: ContactsAPIs
  payments: PaymentAPIs

  constructor() {
    if (window.mainframe) {
      this._rpc = window.mainframe.rpc
    } else {
      throw new Error('Cannot find expected mainframe client instance')
    }

    this.comms = new CommsAPIs(this._rpc)
    this.storage = new StorageAPIs(this._rpc)
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
