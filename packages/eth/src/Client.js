// @flow
import EventEmitter from 'events'
import { fromWei, toWei, toHex, hexToNumber, hexToString } from 'web3-utils'
import Web3EthAbi from 'web3-eth-abi'
import type Web3HTTPProvider from 'web3-providers-http'

import { unitMap } from './contractHelpers'
import RequestManager from './RequestManager'
import ABI from './abi'
import type { SendParams, TXEventEmitter } from './types'

export const NETWORKS = {
  '1': 'mainnet',
  '2': 'morden',
  '3': 'ropsten',
  '4': 'rinkeby',
  '42': 'kovan',
}

const MFT_TOKEN_ADDRESSES = {
  ropsten: '0xa46f1563984209fe47f8236f8b01a03f03f957e4',
  mainnet: '0xdf2c7238198ad8b389666574f2d8bc411a4b7428',
}

export default class EthClient extends RequestManager {
  _polling = false
  _defaultAccount: ?string
  _networkName: ?string
  _networkID: ?string

  constructor(provider: Web3HTTPProvider | string, trackChanges?: boolean) {
    super(provider)

    this.setup()
    if (trackChanges) {
      this.beginTrackingChanges()
    }
  }

  get networkName(): string {
    return this._networkName || 'ropsten'
  }

  get networkID(): ?string {
    return this._networkID
  }

  get defaultAccount(): ?string {
    return this._defaultAccount
  }

  async setup() {
    this._networkID = await this.fetchNetwork()
    this._networkName = NETWORKS[this._networkID]
    this.emit('networkChanged', this._networkID)
  }

  async beginTrackingChanges() {
    if (!this._polling) {
      this._polling = setInterval(async () => {
        const network = await this.fetchNetwork()
        if (network !== this._networkID) {
          this._networkID = network
          this._networkName = NETWORKS[network]
          this.emit('networkChanged', network)
        }
        const accounts = await this.getAccounts()
        if (accounts[0] !== this._defaultAccount) {
          this._defaultAccount = accounts[0]
          this.emit('accountsChanged', accounts)
        }
      }, 1500)
    }
  }

  stopTrackChanges() {
    if (this._polling) {
      clearInterval(this._polling)
    }
  }

  async fetchNetwork(): Promise<string> {
    const req = this.createRequest('net_version', [])
    return this.sendRequest(req)
  }

  async getAccounts(): Promise<Array<string>> {
    const accountsReq = this.createRequest('eth_accounts', [])
    return this.sendRequest(accountsReq)
  }

  encodeERC20Call(name: string, params?: Array<any>) {
    const abi = ABI.ERC20.find(a => a.name === name)
    return Web3EthAbi.encodeFunctionCall(abi, params || [])
  }

  async getTokenDecimals(tokenAddress: string): Promise<number> {
    const data = this.encodeERC20Call('decimals')
    const request = this.createRequest('eth_call', [
      { data, to: tokenAddress },
      'latest',
    ])
    return this.sendRequest(request)
  }

  async getTokenDecimalsUnit(tokenAddress: string): Promise<string> {
    const decimals = await this.getTokenDecimals(tokenAddress)
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

  async getTokenTicker(tokenAddress: string): Promise<string> {
    const data = this.encodeERC20Call('symbol')
    const request = this.createRequest('eth_call', [
      { data, to: tokenAddress },
      'latest',
    ])
    const res = await this.sendRequest(request)
    return hexToString(res)
  }

  async getTokenBalance(
    tokenAddress: string,
    accountAddress: string,
  ): Promise<Object> {
    const decimalsUnit = await this.getTokenDecimalsUnit(tokenAddress)
    const data = this.encodeERC20Call('balanceOf', [accountAddress])
    const mftBalanceReq = this.createRequest('eth_call', [
      { data, to: tokenAddress },
      'latest',
    ])
    const res = await this.sendRequest(mftBalanceReq)
    return fromWei(res, decimalsUnit)
  }

  async getMFTBalance(accountAddress: string): Promise<Object> {
    if (!this._networkName || !MFT_TOKEN_ADDRESSES[this._networkName]) {
      throw new Error(
        `Unsupported Ethereum network: ${this._networkID || 'Undefined'}`,
      )
    }
    const tokenAddress = MFT_TOKEN_ADDRESSES[this._networkName]
    return this.getTokenBalance(tokenAddress, accountAddress)
  }

  async getETHBalance(address: string) {
    const ethBalanceReq = this.createRequest('eth_getBalance', [
      address,
      'latest',
    ])
    const res = await this.sendRequest(ethBalanceReq)
    return fromWei(res, 'ether')
  }

  // async getTokenDecimals(tokenAddr: string) {
  //   const abi = ABI.ERC20.find(a => a.name === 'decimals')
  //   const data = Web3EthAbi.encodeFunctionCall(abi)
  //   const req = this.createRequest('eth_call', [{ data, to: tokenAddr }])
  //   const res = await this.sendRequest(req)
  //   return web3Utils.hexToNumber(res)
  // }

  // Sending transactions

  sendETH(params: SendParams) {
    const valueWei = toWei(String(params.value))
    const valueHex = toHex(valueWei)
    const reqParams = {
      to: params.to,
      from: params.from,
      value: valueHex,
    }
    const request = {
      method: 'eth_sendTransaction',
      params: [reqParams],
    }
    return this.sendTX(request, params.confirmations)
  }

  sendMFT(params: SendParams) {
    const valueWei = toWei(String(params.value))
    const abi = ABI.ERC20.find(a => a.name === 'transfer')
    const data = Web3EthAbi.encodeFunctionCall(abi, [params.to, valueWei])
    if (!this._networkName || !MFT_TOKEN_ADDRESSES[this._networkName]) {
      throw new Error(
        `Unsupported Ethereum network: ${this._networkID || 'Undefined'}`,
      )
    }
    const to = MFT_TOKEN_ADDRESSES[this._networkName]
    const reqParams = { from: params.from, to, data }
    const request = {
      method: 'eth_sendTransaction',
      params: [reqParams],
    }
    return this.sendTX(request, params.confirmations)
  }

  async getConfirmations(txHash: string): Promise<?number> {
    const request = this.createRequest('eth_getTransactionReceipt', [txHash])
    const res = await this.sendRequest(request)
    if (!res) {
      return null
    }
    const blockRequest = this.createRequest('eth_blockNumber', [])
    const blockRes = await this.sendRequest(blockRequest)
    const txBlock = hexToNumber(res.blockNumber)
    const latestBlock = hexToNumber(blockRes)
    return latestBlock - txBlock
  }

  async confirmTransaction(
    txHash: string,
    requestID: number,
    confirmationsRequired: ?number = 10,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._intervals[requestID] = setInterval(async () => {
        try {
          // $FlowFixMe comparison type
          const confirmations = await this.getConfirmations(txHash)
          if (
            confirmations !== null &&
            confirmations >= confirmationsRequired
          ) {
            clearInterval(this._intervals[requestID])
            this._intervals[requestID] = undefined
            resolve(true)
          }
        } catch (err) {
          reject(err)
        }
      }, 1500)
    })
  }

  sendTX(requestData: Object, confirmations: ?number = 10): TXEventEmitter {
    const eventEmitter = new EventEmitter()
    if (requestData.params.length && !requestData.params[0].chainId) {
      requestData.params[0].chainId = Number(this.networkID)
    }
    const req = this.createRequest(requestData.method, requestData.params)
    this.sendRequest(req)
      .then(res => {
        eventEmitter.emit('hash', res)
        return this.confirmTransaction(res, req.id, 0).then(() => {
          eventEmitter.emit('mined', res)
          return this.confirmTransaction(res, req.id, confirmations)
        })
      })
      .then(res => {
        eventEmitter.emit('confirmed', res)
      })
      .catch(err => {
        eventEmitter.emit('error', err)
      })
    return eventEmitter
  }
}
