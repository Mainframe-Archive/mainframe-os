// @flow

import ClientAPIs from '../ClientAPIs'
import type {
  BlockchainGetContractEventsParams,
  BlockchainGetContractEventsResult,
  BlockchainGetLatestBlockResult,
  BlockchainReadContractParams,
  BlockchainReadContractResult,
} from '../types'

export default class BlockchainAPIs extends ClientAPIs {
  getContractEvents(
    params: BlockchainGetContractEventsParams,
  ): Promise<BlockchainGetContractEventsResult> {
    return this._rpc.request('blockchain_getContractEvents', params)
  }

  getLatestBlock(): Promise<BlockchainGetLatestBlockResult> {
    return this._rpc.request('blockchain_getLatestBlock')
  }

  readContract(
    params: BlockchainReadContractParams,
  ): Promise<BlockchainReadContractResult> {
    return this._rpc.request('blockchain_readContract', params)
  }
}
