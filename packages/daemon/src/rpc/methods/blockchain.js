// @flow

import type RequestContext from '../RequestContext'

export const getLatestBlock = async (ctx: RequestContext) => {
  return ctx.web3.eth.getBlockNumber()
}

export const getContractEvents = async (
  ctx: RequestContext,
  params: {
    contractAddress: string,
    abi: Array<Object>,
    eventName: string,
    options?: {
      filter: Object,
      fromBlock: number,
      toBlock: number,
    },
  },
): Promise<Array<Object>> => {
  const contract = new ctx.web3.eth.Contract(params.abi, params.contractAddress)
  return contract.getPastEvents(params.eventName, params.options)
}

export const readContract = async (
  ctx: RequestContext,
  params: {
    contractAddress: string,
    abi: Array<Object>,
    method: string,
    args: any,
  },
): Promise<any> => {
  const contract = new ctx.web3.eth.Contract(params.abi, params.contractAddress)
  return await contract.methods[params.method](...params.args).call()
}
