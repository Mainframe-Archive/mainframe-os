// @flow

import type Client, {
  BlockchainGetContractEventsParams,
  BlockchainGetContractEventsResult,
} from '@mainframe/client'
import { type WebContents } from 'electron'

import type { ActiveApp } from '../../types'
import { withPermission } from '../permissions'

export const SANBOXED_CHANNEL = 'rpc-sandboxed'

export type SandboxedContext = {
  client: Client,
  sender: WebContents,
  app: ActiveApp,
}

export const sandboxedMethods = {
  api_version: (ctx: SandboxedContext) => ctx.client.apiVersion(),
  blockchain_getContractEvents: (
    ctx: SandboxedContext,
    params: BlockchainGetContractEventsParams,
  ): Promise<BlockchainGetContractEventsResult> => {
    return ctx.client.blockchain.getContractEvents(params)
  },
  blockchain_getLatestBlock: withPermission(
    'BLOCKCHAIN_SEND',
    (ctx: SandboxedContext) => ctx.client.blockchain.getLatestBlock(),
  ),
}
