// @flow
import EventEmitter from 'events'
import Web3HTTPProvider from 'web3-providers-http'

type MFWeb3Provider = Object

export default class EthRequestManager extends EventEmitter {
  _web3Provider: ?Web3HTTPProvider | ?MFWeb3Provider
  _httpUrl: string
  _intervals = {}
  _requestCount: number = 0

  constructor(provider: string | MFWeb3Provider) {
    super()
    if (typeof provider === 'string') {
      this._web3Provider = new Web3HTTPProvider(provider)
      this._httpUrl = provider
    } else {
      this._web3Provider = provider
    }
  }

  get ethURL(): string {
    return this._httpUrl
  }

  set ethHttpUrl(url: string) {
    if (this._httpUrl && this._web3Provider) {
      // Only set if using http provider
      this._httpUrl = url
      this._web3Provider.host = url
    }
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
