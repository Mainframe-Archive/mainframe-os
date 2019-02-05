// @flow
import web3Utils from 'web3-utils'
import Web3EthAbi from 'web3-eth-abi'
import type { ERC20DataResult, DecodedTxResult } from './types'

type Web3Contract = {
  methods: any,
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

export const getERC20Data = async (
  contract: Web3Contract,
  userAddr: string,
): Promise<ERC20DataResult> => {
  const [symbol, decimals, balanceWei] = await Promise.all([
    contract.methods.symbol().call(),
    contract.methods.decimals().call(),
    contract.methods.balanceOf(userAddr).call(),
  ])
  const decimalsString = Math.pow(10, decimals).toString()
  const unit = Object.keys(web3Utils.unitMap).find(unitName => {
    const unit = web3Utils.unitMap[unitName]
    return decimalsString === unit
  })
  const balance = web3Utils.fromWei(balanceWei, unit)
  return {
    decimals,
    balance,
    symbol,
  }
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
