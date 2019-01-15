// @flow
import Web3HTTPProvider from 'web3-providers-http'
import web3Utils from 'web3-utils'

import Web3Contract from 'web3-eth-contract'
import { ABI } from '@mainframe/contract-utils'

export const TOKEN_ADDRESS = {
  ropsten: '0xa46f1563984209fe47f8236f8b01a03f03f957e4',
  mainnet: '0xdf2c7238198ad8b389666574f2d8bc411a4b7428',
}

export const NETWORKS = {
  '1': 'mainnet',
  '2': 'morden',
  '3': 'ropsten',
  '4': 'rinkeby',
  '42': 'kovan',
}

export default class EthHandler {
  _web3HttpProvider: ?Web3HTTPProvider
  _network: ?string
  _ethURL: string
  _requestCount: number = 0

  constructor(ethURL: string) {
    this._ethURL = ethURL
  }

  async setup() {
    if (!this._network) {
      this._network = await this.getNetworkID()
    }
  }

  get network(): string {
    return this._network || 'mainnet'
  }

  get ethURL(): string {
    return this._ethURL
  }

  get web3Provider(): Web3HTTPProvider {
    if (this._web3HttpProvider == null) {
      this._web3HttpProvider = new Web3HTTPProvider(this.ethURL)
    }
    return this._web3HttpProvider
  }

  // Requests

  createRequest(method: string, params: Array<any>) {
    this._requestCount += 1
    return {
      id: this._requestCount,
      jsonrpc: '2.0',
      method: method,
      params: params,
    }
  }

  async send(params: Object): Promise<any> {
    return new Promise((resolve, reject) => {
      this.web3Provider.send(params, (err, res) => {
        if (err || res.error) {
          reject(err || res.error)
        } else {
          resolve(res.result)
        }
      })
    })
  }

  async getNetworkID() {
    const req = this.createRequest('net_version', [])
    const res = await this.send(req)
    return NETWORKS[res]
  }

  async getTokenBalance(
    tokenAddress: string,
    accountAddress: string,
  ): Promise<Object> {
    const contract = new Web3Contract(ABI.ERC20, tokenAddress)
    const data = contract.methods.balanceOf(accountAddress).encodeABI()
    const mftBalanceReq = this.createRequest('eth_call', [
      { data, to: tokenAddress },
      'latest',
    ])
    const res = await this.send(mftBalanceReq)
    return web3Utils.fromWei(res, 'ether')
  }

  async getMFTBalance(accountAddress: string): Promise<Object> {
    const tokenAddress = TOKEN_ADDRESS[this.network]
    if (!tokenAddress) {
      throw new Error(`Unsupported Ethereum network: ${this.network}`)
    }
    return this.getTokenBalance(tokenAddress, accountAddress)
  }

  async getETHBalance(address: string) {
    const ethBalanceReq = this.createRequest('eth_getBalance', [
      address,
      'latest',
    ])
    const res = await this.send(ethBalanceReq)
    return web3Utils.fromWei(res, 'ether')
  }
}
