// @flow

import Web3EthAbi from 'web3-eth-abi'

import type { DecodedTxResult, JsonRpcResponse } from './types'

export const unitMap = {
  noether: '0',
  wei: '1',
  kwei: '1000',
  Kwei: '1000',
  babbage: '1000',
  femtoether: '1000',
  mwei: '1000000',
  Mwei: '1000000',
  lovelace: '1000000',
  picoether: '1000000',
  gwei: '1000000000',
  Gwei: '1000000000',
  shannon: '1000000000',
  nanoether: '1000000000',
  nano: '1000000000',
  szabo: '1000000000000',
  microether: '1000000000000',
  micro: '1000000000000',
  finney: '1000000000000000',
  milliether: '1000000000000000',
  milli: '1000000000000000',
  ether: '1000000000000000000',
  kether: '1000000000000000000000',
  grand: '1000000000000000000000',
  mether: '1000000000000000000000000',
  gether: '1000000000000000000000000000',
  tether: '1000000000000000000000000000000',
}

const TRANSFER_SIG = 'a9059cbb'
const APPROVE_SIG = '095ea7b3'
const TRANSFER_FROM_SIG = '23b872dd'

const METHOD_LABELS = {
  [TRANSFER_SIG]: 'Transfer',
  [APPROVE_SIG]: 'Approve',
  [TRANSFER_FROM_SIG]: 'Transfer From',
}

const decodableContracts = {
  ERC20: {
    [TRANSFER_SIG]: [
      // Transfer
      { type: 'address', name: 'to' },
      { type: 'uint256', name: 'amount' },
    ],
    [APPROVE_SIG]: [
      // Approve
      { type: 'address', name: 'spender' },
      { type: 'uint256', name: 'amount' },
    ],
    [TRANSFER_FROM_SIG]: [
      // transferFrom
      { type: 'address', name: 'from' },
      { type: 'address', name: 'to' },
      { type: 'uint256', name: 'amount' },
    ],
  },
}

export const decodeTransactionData = async (
  txData: string,
): Promise<DecodedTxResult> => {
  const methodSig = txData.slice(2, 10)
  const decodableContract = Object.keys(decodableContracts).find(type => {
    return !!decodableContracts[type][methodSig]
  })
  if (!decodableContract) {
    throw new Error(`No decodable method found for ${methodSig}`)
  }
  const expectedParams = decodableContracts[decodableContract][methodSig]
  const paramsData = txData.slice(10, txData.length)
  const params = Web3EthAbi.decodeParameters(expectedParams, paramsData)
  const paramKeys = Object.keys(expectedParams).map(k => expectedParams[k].name)
  const cleanedParams = {}
  Object.keys(params).forEach(k => {
    if (paramKeys.includes(k)) {
      cleanedParams[k] = params[k]
    }
  })
  return {
    contractType: decodableContract,
    signatureHex: methodSig,
    signatureName: METHOD_LABELS[methodSig],
    params: cleanedParams,
  }
}

export const jsonRpcResponse = (result: any, id: number): JsonRpcResponse => {
  return {
    result,
    id,
    jsonrpc: '2.0',
    error: null,
  }
}

export const truncateAddress = (
  address: string,
  endChars: number = 8,
): string => {
  if (address.length < endChars * 2 + 3) {
    return address
  }
  const start = address.substring(0, endChars)
  const end = address.substring(address.length - endChars, address.length)
  return start + '...' + end
}
