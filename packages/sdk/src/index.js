// @flow

/* eslint-env browser */

import type StreamRPC from '@mainframe/rpc-stream'

import EthAPIs from './apis/Eth'
import CommsAPIs from './apis/Comms'
import ContactsAPIs from './apis/Contacts'
import PaymentAPIs from './apis/Payments'
import PssAPIs from './apis/Pss'

export * from './types'

export default class MainframeSDK {
  _rpc: StreamRPC
  _ethereum: EthAPIs
  comms: CommsAPIs
  contacts: ContactsAPIs
  payments: PaymentAPIs
  pss: PssAPIs

  constructor() {
    if (window.mainframe) {
      this._rpc = window.mainframe.rpc
    } else {
      throw new Error('Cannot find expected mainframe client instance')
    }

    this.comms = new CommsAPIs(this._rpc)
    this.contacts = new ContactsAPIs(this._rpc)
    this.payments = new PaymentAPIs(this)
    this.pss = new PssAPIs(this._rpc)
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
