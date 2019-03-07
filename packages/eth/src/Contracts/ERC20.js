// @flow
import { fromWei, toWei, hexToString } from 'web3-utils'

import { unitMap } from '../utils'
import type { SendParams } from '../types'
import type EthClient from '../Client'
import ABI from '../abi'
import BaseContract from './BaseContract'

export default class ERC20Contract extends BaseContract {
  constructor(ethClient: EthClient, address: string) {
    super(ethClient, ABI.ERC20, address)
  }

  async getTokenDecimals(): Promise<number> {
    const data = this.encodeCall('decimals')
    const request = this.ethClient.createRequest('eth_call', [
      { data, to: this.address },
      'latest',
    ])
    return this.ethClient.sendRequest(request)
  }

  async getTokenDecimalsUnit(): Promise<string> {
    const decimals = await this.getTokenDecimals()
    const decimalsString = Math.pow(10, decimals).toString()
    const unit = Object.keys(unitMap).find(unitName => {
      const unit = unitMap[unitName]
      return decimalsString === unit
    })
    if (!unit) {
      throw new Error('Error getting token decimal unit')
    }
    return unit
  }

  async getTicker(): Promise<string> {
    const data = this.encodeCall('symbol')
    const request = this.ethClient.createRequest('eth_call', [
      { data, to: this.address },
      'latest',
    ])
    const res = await this.ethClient.sendRequest(request)
    return hexToString(res)
  }

  async getBalance(accountAddress: string): Promise<Object> {
    const decimalsUnit = await this.getTokenDecimalsUnit()
    const data = this.encodeCall('balanceOf', [accountAddress])
    const mftBalanceReq = this.ethClient.createRequest('eth_call', [
      { data, to: this.address },
      'latest',
    ])
    const res = await this.ethClient.sendRequest(mftBalanceReq)
    return fromWei(res, decimalsUnit)
  }

  async transfer(params: SendParams) {
    const decimalsUnit = await this.getTokenDecimalsUnit()
    const valueWei = toWei(String(params.value), decimalsUnit)
    const data = this.encodeCall('transfer', [params.to, valueWei])
    const txParams = { from: params.from, to: this.address, data }
    return this.ethClient.sendAndListen(txParams, params.confirmations)
  }
}
