// @flow

/* eslint-env browser */

import type StreamRPC from '@mainframe/rpc-stream'

import BlockchainAPIs from './apis/Blockchain'
import PssAPIs from './apis/Pss'

export default class MainframeSDK {
  _rpc: StreamRPC
  blockchain: BlockchainAPIs
  pss: PssAPIs

  constructor() {
    if (window.mainframe) {
      this._rpc = window.mainframe.rpc
    } else {
      throw new Error('Cannot find expected mainframe client instance')
    }

    this.blockchain = new BlockchainAPIs(this._rpc)
    this.pss = new PssAPIs(this._rpc)
  }

  apiVersion = () => {
    return this._rpc.request('api_version')
  }
}
