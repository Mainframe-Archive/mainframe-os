// @flow
import EventEmitter from 'events'
import { fromWei, toWei, toHex, hexToNumber, isAddress } from 'web3-utils'
import type { Observable } from 'rxjs'
import { WebsocketProvider } from 'web3-providers'

import ERC20 from './Contracts/ERC20'
import BaseContract from './Contracts/BaseContract'
import type {
  AbstractProvider,
  RequestPayload,
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
  '42': 'kovan',
  ganache: 'ganache',
}

const wsOptions = {
  timeout: 15000,
}

type Subscriptions = {
  networkChanged: () => Observable,
  accountsChanged: () => Observable,
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

  get networkID(): ?string {
    return this._networkID
  }

  get walletProvider(): ?WalletProvider {
    return this._walletProvider
  }

  setNetworkID(id: string) {
    if (id !== this._networkID) {
      if (Number(id) > 10000) {
        this._networkName = NETWORKS['ganache']
      } else {
        this._networkName = NETWORKS[id] || 'Local Testnet'
      }
      this._networkID = id
      this.emit('networkChanged', id)
    }
  }

  async setup() {
    this.fetchNetwork()
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
    const req = this.createRequest('net_version', [])
    const id = await this.sendRequest(req)
    this.setNetworkID(id)
    return id
  }

  async getAccounts(): Promise<Array<string>> {
    const accountsReq = this.createRequest('eth_accounts', [])
    return this.sendRequest(accountsReq)
  }

  async getETHBalance(address: string) {
    const ethBalanceReq = this.createRequest('eth_getBalance', [
      address,
      'latest',
    ])
    const res = await this.sendRequest(ethBalanceReq)
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
    const request = this.createRequest('eth_getLogs', [params])
    const res = await this.sendRequest(request)
    return res
  }

  // Signing

  async signData(params: SignDataParams) {
    if (this._walletProvider != null) {
      return this._walletProvider.sign(params)
    }
    throw new Error('No wallet provider found')
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
    const request = this.createRequest('eth_getTransactionReceipt', [txHash])
    const res = await this.sendRequest(request)
    if (!res) {
      return null
    }
    const latestBlock = await this.getLatestBlock()
    const txBlock = hexToNumber(res.blockNumber)
    return latestBlock - txBlock
  }

  async getLatestBlock(): Promise<number> {
    const blockRequest = this.createRequest('eth_blockNumber', [])
    const blockRes = await this.sendRequest(blockRequest)
    return hexToNumber(blockRes)
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
      }, 2000)
    })
  }

  async completeTxParams(txParams: Object): Promise<Object> {
    if (!txParams.nonce) {
      const nonceReq = this.createRequest('eth_getTransactionCount', [
        txParams.from,
        'pending',
      ])
      txParams.nonce = await this.sendRequest(nonceReq)
    }

    if (!txParams.gas) {
      const gasReq = this.createRequest('eth_estimateGas', [txParams])
      try {
        txParams.gas = await this.sendRequest(gasReq)
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
      const gasPriceReq = this.createRequest('eth_gasPrice', [])
      txParams.gasPrice = await this.sendRequest(gasPriceReq)
    }
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
    if (!txParams.from || !isAddress(txParams.from)) {
      throw new Error('Invalid sender address')
    }
    if (!txParams.to || !isAddress(txParams.to)) {
      throw new Error('Invalid recipient address')
    }
  }

  async generateTXRequest(txParams: Object) {
    const signedTx = await this.prepareAndSignTx(txParams)
    const requestData = {
      method: 'eth_sendRawTransaction',
      params: [signedTx],
    }
    // TODO: Check this is still needed for Ledger
    // if (requestData.params.length && !requestData.params[0].chainId) {
    //   requestData.params[0].chainId = Number(this.networkID)
    // }
    return this.createRequest(requestData.method, requestData.params)
  }

  async sendAndListen(
    txParams: Object,
    confirmations: ?number,
  ): Promise<TXEventEmitter> {
    const eventEmitter = new EventEmitter()
    const request = await this.generateTXRequest(txParams)
    this.sendRequest(request)
      .then(res => {
        eventEmitter.emit('hash', res)
        return this.confirmTransaction(res, request.id, 0).then(() => {
          eventEmitter.emit('mined', res)
          if (confirmations) {
            return this.confirmTransaction(res, request.id, confirmations)
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

  createRequest(method: string, params: Array<any>): RequestPayload {
    this._requestCount += 1
    return {
      id: this._requestCount,
      jsonrpc: '2.0',
      method: method,
      params: params,
    }
  }

  async sendRequest(params: RequestPayload): Promise<any> {
    const res = await this.web3Provider.sendPayload(params)
    if (res.error) {
      throw new Error(res.error.message)
    } else {
      return res.result
    }
  }
}
