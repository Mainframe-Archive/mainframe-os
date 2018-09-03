// @flow

/* eslint-env browser */

import type StreamRPC from '@mainframe/rpc-stream'

class API {
  _rpc: StreamRPC

  constructor(rpc: StreamRPC) {
    this._rpc = rpc
  }
}

class BlockchainAPI extends API {
  readContract(
    contractAddress: string,
    abi: Array<any>,
    method: string,
    args?: ?Array<any>,
  ): Promise<Array<Object>> {
    return this._rpc.request('blockchain_readContract', {
      contractAddress,
      abi,
      method,
      args,
    })
  }

  getContractEvents(
    contractAddress: string,
    abi: Array<any>,
    eventName: string,
    options: Object,
  ): Promise<Array<Object>> {
    return this._rpc.request('blockchain_getContractEvents', {
      contractAddress,
      abi,
      eventName,
      options,
    })
  }

  getLatestBlock = (): Promise<number> => {
    return this._rpc.request('blockchain_getLatestBlock')
  }
}

export default class MainframeSDK {
  _rpc: StreamRPC
  blockchain: BlockchainAPI

  constructor() {
    if (window.mainframe) {
      this._rpc = window.mainframe.rpc
    } else {
      throw new Error('Cannot find expected mainframe client instance')
    }

    this.blockchain = new BlockchainAPI(this._rpc)
  }

  apiVersion = () => {
    return this._rpc.request('api_version')
  }
}
