// @flow

import EventEmitter from 'events'
import type { Observable } from 'rxjs'
import Web3EthAbi from 'web3-eth-abi'
import { WebsocketProvider } from 'web3-providers'
import {
  fromWei,
  hexToNumber,
  isAddress,
  numberToHex,
  toWei,
  toHex,
  toBN,
} from 'web3-utils'

import ERC20 from './Contracts/ERC20'
import BaseContract from './Contracts/BaseContract'
import type {
  AbstractProvider,
  EventFilterParams,
  SendParams,
  TXEventEmitter,
  TXParams,
} from './types'

export const NETWORKS = {
  '1': 'mainnet',
  '2': 'morden',
  '3': 'ropsten',
  '4': 'rinkeby',
  '5': 'goerli',
  '42': 'kovan',
  ganache: 'ganache',
}

const wsOptions = {
  timeout: 15000,
}

type Subscriptions = {
  networkChanged: () => Promise<Observable<*>>,
  accountsChanged: () => Promise<Observable<*>>,
}

type SignDataParams = {
  address: string,
  data: string,
}

type WalletProvider = {
  +signTransaction: (params: TXParams) => Promise<Object>,
  +sign: (params: SignDataParams) => Promise<string>,
  +getAccounts: () => Promise<Array<string>>,
}

export default class EthClient extends EventEmitter {
  _polling = false
  _networkName: ?string
  _networkID: ?string
  _web3Provider: AbstractProvider
  _subscriptions: ?Subscriptions
  _walletProvider: ?WalletProvider
  _requestCount: number = 0
  _contracts = {}
  _intervals = {}

  constructor(
    provider: AbstractProvider | string,
    walletProvider?: ?WalletProvider,
    subscriptions?: ?Subscriptions,
  ) {
    super()
    if (typeof provider === 'string') {
      const url = new URL(provider)
      if (url.protocol !== 'ws:' && url.protocol !== 'wss:') {
        throw new Error('rpc url must be a websocket endpoint')
      }
      // TODO: handle http endpoints
      this._web3Provider = new WebsocketProvider(provider, wsOptions)
    } else {
      this._web3Provider = provider
    }
    this._subscriptions = subscriptions
    this._walletProvider = walletProvider
    this.setup()
  }

  get web3Provider(): AbstractProvider {
    return this._web3Provider
  }

  set providerURL(url: string) {
    // TODO: handle http
    if (this._web3Provider.clearSubscriptions) {
      this._web3Provider.clearSubscriptions()
    }
    this._web3Provider = new WebsocketProvider(url, wsOptions)
    this.fetchNetwork()
  }

  get networkName(): string {
    return this._networkName || 'Awaiting network'
  }

  get networkID(): string {
    return this._networkID || '0'
  }

  get walletProvider(): ?WalletProvider {
    return this._walletProvider
  }

  setNetworkID(id: string) {
    if (id !== this._networkID) {
      if (Number(id) > 10000) {
        this._networkName = NETWORKS['ganache']
      } else {
        this._networkName = NETWORKS[id] || 'Unknown network'
      }
      this._networkID = id
      this.emit('networkChanged', id)
    }
  }

  async setup() {
    await this.fetchNetwork()
    if (!this._subscriptions) {
      return
    }

    if (this._subscriptions.networkChanged) {
      const sub = await this._subscriptions.networkChanged()
      sub.subscribe(res => {
        this.setNetworkID(res.networkID)
      })
    }

    if (this._subscriptions.accountsChanged) {
      const sub = await this._subscriptions.accountsChanged()
      sub.subscribe(res => {
        this.emit('accountsChanged', res.accounts)
      })
    }
  }

  async fetchNetwork(): Promise<string> {
    const id = await this.send('net_version', [])
    this.setNetworkID(id)
    return id
  }

  async getAccounts(): Promise<Array<string>> {
    if (this._walletProvider != null) {
      return this._walletProvider.getAccounts()
    }
    throw new Error('No wallet provider found')
  }

  async getETHBalance(address: string) {
    const res = await this.send('eth_getBalance', [address, 'latest'])
    return fromWei(res, 'ether')
  }

  getContract(abi: Array<Object>, address: string) {
    if (this._contracts[address]) {
      return this._contracts[address]
    }
    const contract = new BaseContract(this, abi, address)
    this._contracts[address] = contract
    return contract
  }

  erc20Contract(address: string) {
    if (this._contracts[address]) {
      return this._contracts[address]
    }
    const contract = new ERC20(this, address)
    this._contracts[address] = contract
    return contract
  }

  // Logs

  async getPastEvents(params: EventFilterParams) {
    if (params.fromBlock != null) {
      params.fromBlock = toHex(params.fromBlock)
    }
    if (params.toBlock != null) {
      params.toBlock = toHex(params.toBlock)
    }
    const res = await this.send('eth_getLogs', [params])
    return res
  }

  decodeLog(log: Object, inputs: Array<Object>) {
    return Web3EthAbi.decodeLog(inputs, log.data, log.topics)
  }

  // Subscriptions

  async subscribe(method: string, params: Array<string | Object>) {
    if (!this.web3Provider.subscribe) {
      throw new Error('subscriptions not supported')
    }
    return this.web3Provider.subscribe('eth_subscribe', method, params)
  }

  async unsubscribe(id: string) {
    if (!this.web3Provider.unsubscribe) {
      throw new Error('subscriptions not supported')
    }
    return this.web3Provider.unsubscribe(id)
  }

  async clearSubscriptions() {
    if (!this.web3Provider.clearSubscriptions) {
      throw new Error('subscriptions not supported')
    }
    return this.web3Provider.clearSubscriptions()
  }

  // Signing

  async signData(params: SignDataParams) {
    if (this._walletProvider != null) {
      return this._walletProvider.sign(params)
    }
    throw new Error('No wallet provider found')
  }

  async signMessage(message: string, address: string) {
    const data = toHex(message)
    return this.signData({ address, data })
  }

  // Sending transactions

  sendETH(params: SendParams) {
    const valueWei = toWei(String(params.value))
    const valueHex = toHex(valueWei)
    const txParams = {
      to: params.to,
      from: params.from,
      value: valueHex,
    }
    return this.sendAndListen(txParams, params.confirmations)
  }

  async getConfirmations(txHash: string): Promise<?number> {
    const res = await this.send('eth_getTransactionReceipt', [txHash])
    if (!res) {
      return null
    }
    const latestBlock = await this.getLatestBlock()
    const txBlock = hexToNumber(res.blockNumber)
    return latestBlock - txBlock
  }

  async getLatestBlock(): Promise<number> {
    const blockRes = await this.send('eth_blockNumber', [])
    return hexToNumber(blockRes)
  }

  async confirmTransaction(
    txHash: string,
    confirmationsRequired: ?number = 10,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._intervals[txHash] = setInterval(async () => {
        try {
          // $FlowFixMe comparison type
          const confirmations = await this.getConfirmations(txHash)
          if (
            confirmations !== null &&
            confirmations >= confirmationsRequired
          ) {
            clearInterval(this._intervals[txHash])
            this._intervals[txHash] = undefined
            resolve(true)
          }
        } catch (err) {
          reject(err)
        }
      }, 2000)
    })
  }

  async estimateGas(txParams: Object): Promise<string> {
    const { gasLimit } = await this.send('eth_getBlockByNumber', [
      'latest',
      false,
    ])
    // Get the block limit from previous block
    const blockGasLimitBN = toBN(gasLimit)
    const maxGasBN = blockGasLimitBN.muln(0.9)

    // Get estimated tx limit
    const estGasHex = await this.send('eth_estimateGas', [txParams])
    const estGasBN = toBN(estGasHex)

    // Pad the estimated limit
    const paddedGasBN = estGasBN.muln(1.5)

    if (estGasBN.gt(maxGasBN)) {
      return estGasHex
    }
    if (paddedGasBN.lt(maxGasBN)) {
      return numberToHex(paddedGasBN)
    }
    return numberToHex(maxGasBN)
  }

  async completeTxParams(txParams: Object): Promise<Object> {
    if (!txParams.from) {
      throw new Error('Transaction "from" address required')
    }
    /* eslint-disable require-atomic-updates */
    if (!txParams.nonce) {
      txParams.nonce = await this.send('eth_getTransactionCount', [
        txParams.from,
        'pending',
      ])
    }

    if (!txParams.gas) {
      try {
        txParams.gas = await this.estimateGas(txParams)
      } catch (err) {
        // handle simple value transfer case
        if (err.message === 'no contract code at given address') {
          txParams.gas = '0xcf08'
        } else {
          throw err
        }
      }
    }

    if (!txParams.gasPrice) {
      txParams.gasPrice = await this.send('eth_gasPrice', [])
    }
    /* eslint-enable require-atomic-updates */

    return txParams
  }

  async prepareAndSignTx(txParams: Object): Promise<string> {
    if (this._walletProvider != null) {
      this.validateTransaction(txParams)
      const fullParams = await this.completeTxParams(txParams)
      // $FlowFixMe checked for wallet provider
      return this._walletProvider.signTransaction(fullParams)
    }
    throw new Error('No wallet provider found')
  }

  validateTransaction(txParams: Object) {
    if (txParams.to && !isAddress(txParams.to)) {
      throw new Error('Invalid to address')
    }
    if (!txParams.from) {
      throw new Error('Missing sender address')
    }
    if (!isAddress(txParams.from)) {
      throw new Error('Invalid sender address')
    }
  }

  async generateTXRequest(
    txParams: Object,
  ): Promise<{| method: string, params: Array<*> |}> {
    const signedTx = await this.prepareAndSignTx(txParams)
    return {
      method: 'eth_sendRawTransaction',
      params: [signedTx],
    }
  }

  async sendAndListen(
    txParams: Object,
    confirmations: ?number,
  ): Promise<TXEventEmitter> {
    const eventEmitter = new EventEmitter()
    const request = await this.generateTXRequest(txParams)
    this.send(request.method, request.params)
      .then(res => {
        eventEmitter.emit('hash', res)
        return this.confirmTransaction(res, 0).then(() => {
          eventEmitter.emit('mined', res)
          if (confirmations) {
            return this.confirmTransaction(res, confirmations)
          }
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

  async send(method: string, params: Array<*>): Promise<*> {
    return await this.web3Provider.send(method, params)
  }
}
