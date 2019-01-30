// @flow

/* eslint-env browser */

import type StreamRPC from '@mainframe/rpc-stream'

import BlockchainAPIs from './apis/Blockchain'
import PssAPIs from './apis/Pss'
import ContactsAPIs from './apis/Contacts'

export default class MainframeSDK {
  _rpc: StreamRPC
  _blockchain: BlockchainAPIs
  pss: PssAPIs
  contacts: ContactsAPIs

  constructor() {
    if (window.mainframe) {
      this._rpc = window.mainframe.rpc
    } else {
      throw new Error('Cannot find expected mainframe client instance')
    }

    this.pss = new PssAPIs(this._rpc)
    this.contacts = new ContactsAPIs(this._rpc)
  }

  get blockchain() {
    if (this._blockchain) {
      return this._blockchain
    }
    return new BlockchainAPIs(this._rpc)
  }

  apiVersion = () => {
    return this._rpc.request('api_version')
  }
}
