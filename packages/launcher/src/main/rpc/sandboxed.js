// @flow

import type {
  BlockchainGetContractEventsParams,
  BlockchainGetContractEventsResult,
  BlockchainReadContractParams,
  BlockchainReadContractResult,
} from '@mainframe/client'

import type AppContext from '../AppContext'

export default {
  api_version: (ctx: AppContext) => ctx.client.apiVersion(),
  blockchain_getContractEvents: (
    ctx: AppContext,
    params: BlockchainGetContractEventsParams,
  ): Promise<BlockchainGetContractEventsResult> => {
    return ctx.client.blockchain.getContractEvents(params)
  },
  blockchain_readContract: (
    ctx: AppContext,
    params: BlockchainReadContractParams,
  ): Promise<BlockchainReadContractResult> => {
    return ctx.client.blockchain.readContract(params)
  },
  blockchain_getLatestBlock: (ctx: AppContext) =>
    ctx.client.blockchain.getLatestBlock(),
}
