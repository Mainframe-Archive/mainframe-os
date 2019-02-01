// @flow
import Web3HTTPProvider from 'web3-providers-http'

type MFWeb3Provider = Object

export const NETWORKS = {
  '1': 'mainnet',
  '2': 'morden',
  '3': 'ropsten',
  '4': 'rinkeby',
  '42': 'kovan',
}

export default class EthRequestManager {
  _web3Provider: ?Web3HTTPProvider | ?MFWeb3Provider
  _network: ?string
  _httpUrl: string
  _intervals = {}
  _requestCount: number = 0

  constructor(provider: string | MFWeb3Provider) {
    if (typeof provider === 'string') {
      this._web3Provider = new Web3HTTPProvider(provider)
      this._httpUrl = provider
    } else {
      this._web3Provider = provider
    }
    this.setup()
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
    return this._httpUrl
  }

  get web3Provider(): Web3HTTPProvider {
    return this._web3Provider
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

  async getNetworkID(): Promise<?string> {
    const req = this.createRequest('net_version', [])
    const res = await this.sendRequest(req)
    return NETWORKS[res]
  }

  async sendRequest(params: Object): Promise<any> {
    // Use sendAsync for RPC provider and send for http
    // as provider engine only supports sendAsync
    const method = this._httpUrl ? 'send' : 'sendAsync'
    return new Promise((resolve, reject) => {
      this.web3Provider[method](params, (err, res) => {
        if (err || res.error) {
          reject(err || res.error)
        } else {
          resolve(res.result)
        }
      })
    })
  }
}
