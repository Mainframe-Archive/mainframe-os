// @flow

import type RequestContext from '../RequestContext'

export const getLatestBlock = async ctx => {
  return ctx.web3.eth.getBlockNumber()
}

export const getContractEvents = async (
  ctx: RequestContext,
  [contractAddr, abi, eventName, options]: [
    string,
    Array<Object>,
    string,
    ?{
      filter: Object,
      fromBlock: number,
      toBlock: number,
    },
  ],
): Promise<Array<Object>> => {
  const contract = new ctx.web3.eth.Contract(abi, contractAddr)
  return contract.getPastEvents(eventName, options)
}

export const readContract = async (
  ctx: RequestContext,
  [contractAddr, abi, method, params]: [string, Array<Object>, string, any],
): Promise<any> => {
  const contract = new ctx.web3.eth.Contract(abi, contractAddr)
  return await contract.methods[method](...params).call()
}
