// @flow
import type StreamRPC from '@mainframe/rpc-stream'

export type ContractABI = Array<Object>

export default class BlockchainClient {
  _rpc: StreamRPC

  constructor(rpc: StreamRPC) {
    this._rpc = rpc
  }

  getLatestBlock(): Promise<number> {
    return this._rpc.request('blockchain_getLatestBlock')
  }

  readContract(
    contractAddress: string,
    abi: ContractABI,
    method: string,
    params: any,
  ): Promise<any> {
    return this._rpc.request('blockchain_readContract', {
      contractAddress,
      abi,
      method,
      params,
    })
  }

  getContractEvents(
    contractAddress: string,
    abi: ContractABI,
    eventName: string,
    options?: {
      filter: Object,
      fromBlock: number,
      toBlock: number,
    },
  ): Promise<Array<Object>> {
    return this._rpc.request('blockchain_getContractEvents', {
      contractAddress,
      abi,
      eventName,
      options,
    })
  }
}
