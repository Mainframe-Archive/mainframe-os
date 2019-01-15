// @flow

import type {
  BlockchainWeb3SendParams,
  BlockchainWeb3SendResult,
} from '@mainframe/client'

import { type default as RequestContext } from '../RequestContext'

export const web3Send = async (
  ctx: RequestContext,
  params: BlockchainWeb3SendParams,
): Promise<BlockchainWeb3SendResult> => {
  return ctx.eth.send(params)
}
