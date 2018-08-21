// @flow

import type {
  BlockchainGetContractEventsParams,
  BlockchainGetContractEventsResult,
  BlockchainGetLatestBlockResult,
  BlockchainReadContractParams,
  BlockchainReadContractResult,
} from '@mainframe/client'
import type RequestContext from '../RequestContext'

export const getContractEvents = async (
  ctx: RequestContext,
  params: BlockchainGetContractEventsParams,
): Promise<BlockchainGetContractEventsResult> => {
  const contract = new ctx.web3.eth.Contract(params.abi, params.contractAddress)
  return contract.getPastEvents(params.eventName, params.options)
}

export const getLatestBlock = async (
  ctx: RequestContext,
): Promise<BlockchainGetLatestBlockResult> => {
  return ctx.web3.eth.getBlockNumber()
}

export const readContract = async (
  ctx: RequestContext,
  params: BlockchainReadContractParams,
): Promise<BlockchainReadContractResult> => {
  const contract = new ctx.web3.eth.Contract(params.abi, params.contractAddress)
  if (!contract.methods[params.method]) {
    throw new Error('Contract method not found in provided ABI')
  }
  const args = params.args || []
  return await contract.methods[params.method](...args).call()
}
