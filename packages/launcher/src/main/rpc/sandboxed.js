// @flow

import type Client, {
  BlockchainGetContractEventsParams,
  BlockchainGetContractEventsResult,
} from '@mainframe/client'
import { type WebContents } from 'electron'

import type { AppSession } from '../../types'
import { withPermission } from '../permissionsManager'

export const SANBOXED_CHANNEL = 'rpc-sandboxed'

export type SandboxedContext = {
  client: Client,
  sender: WebContents,
  appSession: AppSession,
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
    'WEB3_SEND',
    (ctx: SandboxedContext) => ctx.client.blockchain.getLatestBlock(),
  ),
}
