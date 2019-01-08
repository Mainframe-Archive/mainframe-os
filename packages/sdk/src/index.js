// @flow

/* eslint-env browser */

import type StreamRPC from '@mainframe/rpc-stream'

import BlockchainAPIs from './apis/Blockchain'
import PssAPIs from './apis/Pss'
import ContactsAPIs from "./apis/Contacts";

export default class MainframeSDK {
  _rpc: StreamRPC
  blockchain: BlockchainAPIs
  pss: PssAPIs
  contacts: ContactsAPIs

  constructor() {
    if (window.mainframe) {
      this._rpc = window.mainframe.rpc
    } else {
      throw new Error('Cannot find expected mainframe client instance')
    }

    this.blockchain = new BlockchainAPIs(this._rpc)
    this.pss = new PssAPIs(this._rpc)
    this.contacts = new ContactsAPIs(this._rpc)
  }

  apiVersion = () => {
    return this._rpc.request('api_version')
  }
}
