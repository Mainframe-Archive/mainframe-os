// @flow

import ClientAPIs from '../ClientAPIs'

export default class BlockchainAPIs extends ClientAPIs {
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
