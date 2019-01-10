// @flow

import type {
  BlockchainWeb3SendParams,
  BlockchainWeb3SendResult,
} from '@mainframe/client'

import type ClientContext from '../ClientContext'

export const web3Send = async (
  ctx: ClientContext,
  params: BlockchainWeb3SendParams,
): Promise<BlockchainWeb3SendResult> => {
  return new Promise((resolve, reject) => {
    ctx.web3Provider.send(params, (err, res) => {
      if (err || res.error) {
        reject(err || res.error)
      } else {
        resolve(res.result)
      }
    })
  })
}
