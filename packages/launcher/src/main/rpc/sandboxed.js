// @flow

import type Client, {
  BlockchainGetContractEventsParams,
  BlockchainGetContractEventsResult,
} from '@mainframe/client'

export const SANBOXED_CHANNEL = 'rpc-sandboxed'

export type SandboxedContext = {
  client: Client,
}

export const sandboxedMethods = {
  api_version: (ctx: SandboxedContext) => ctx.client.apiVersion(),
  blockchain_getContractEvents: (
    ctx: SandboxedContext,
    params: BlockchainGetContractEventsParams,
  ): Promise<BlockchainGetContractEventsResult> => {
    return ctx.client.blockchain.getContractEvents(params)
  },
  blockchain_getLatestBlock: (ctx: SandboxedContext) => {
    return ctx.client.blockchain.getLatestBlock()
  },
}
