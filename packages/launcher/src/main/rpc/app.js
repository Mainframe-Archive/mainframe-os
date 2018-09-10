// @flow

import {
  LOCAL_ID_SCHEMA,
  type BlockchainGetContractEventsParams,
  type BlockchainGetContractEventsResult,
  type BlockchainReadContractParams,
  type BlockchainReadContractResult,
} from '@mainframe/client'

import type { AppContext } from '../contexts'

export const sandboxed = {
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

export const trusted = {
  sub_createPermissionDenied: (ctx: AppContext): { id: string } => ({
    id: ctx.createPermissionDeniedSubscription(),
  }),
  sub_unsubscribe: {
    params: {
      id: LOCAL_ID_SCHEMA,
    },
    handler: (ctx: AppContext, params: { id: string }): void => {
      ctx.removeSubscription(params.id)
    },
  },
}
