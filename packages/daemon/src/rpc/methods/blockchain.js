// @flow

import type {
  BlockchainWeb3SendParams,
  BlockchainWeb3SendResult,
} from '@mainframe/client'

import type ClientContext from '../../context/ClientContext'

export const web3Send = async (
  ctx: ClientContext,
  params: BlockchainWeb3SendParams,
): Promise<BlockchainWeb3SendResult> => {
  return ctx.io.eth.send(params)
}
