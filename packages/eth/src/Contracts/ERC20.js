// @flow

import { utils } from 'ethers'
import { hexToString } from 'web3-utils'

import ABI from '../abi'
import type EthClient from '../Client'
import type { SendParams } from '../types'
import { unitMap } from '../utils'

import BaseContract from './BaseContract'

export default class ERC20Contract extends BaseContract {
  constructor(ethClient: EthClient, address: string) {
    super(ethClient, ABI.ERC20, address)
  }

  async getTokenDecimals(): Promise<number> {
    const data = this.encodeCall('decimals')
    return this.ethClient.send('eth_call', [
      { data, to: this.address },
      'latest',
    ])
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
    const res = await this.ethClient.send('eth_call', [
      { data, to: this.address },
      'latest',
    ])
    return hexToString(res)
  }

  async getBalance(accountAddress: string): Promise<string> {
    const decimalsUnit = await this.getTokenDecimalsUnit()
    const data = this.encodeCall('balanceOf', [accountAddress])
    const res = await this.ethClient.send('eth_call', [
      { data, to: this.address },
      'latest',
    ])
    return utils.formatUnits(res, decimalsUnit)
  }

  async transfer(params: SendParams) {
    const decimalsUnit = await this.getTokenDecimalsUnit()
    const valueWei = utils.parseUnits(params.value, decimalsUnit)
    const data = this.encodeCall('transfer', [params.to, valueWei])
    const txParams = { from: params.from, to: this.address, data }
    return this.ethClient.sendAndListen(txParams, params.confirmations)
  }

  async approve(
    address: string,
    amount: string | number,
    options: { from: string },
  ) {
    const decimalsUnit = await this.getTokenDecimalsUnit()
    const valueWei = utils.parseUnits(String(amount), decimalsUnit)
    const data = this.encodeCall('approve', [address, valueWei])
    const txParams = { ...options, to: this.address, data }
    return this.ethClient.sendAndListen(txParams)
  }
}
