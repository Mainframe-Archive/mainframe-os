// @flow
import EventEmitter from 'events'

import type { AbstractProvider, RequestPayload } from './types'

export default class EthRequestManager extends EventEmitter {
  _web3Provider: AbstractProvider
  _requestCount: number = 0

  constructor(provider: AbstractProvider) {
    super()
    // TODO: Embed WS and HTTP provider types
    // to allow users to just pass a url
    this._web3Provider = provider
  }

  get web3Provider(): AbstractProvider {
    return this._web3Provider
  }

  // Requests

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
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Web3 request timeout'))
      }, 10000)
      this.web3Provider.send(params, (err, res) => {
        clearTimeout(timeout)
        if (res) {
          resolve(res.result)
        } else {
          reject(err || (res && res.error))
        }
      })
    })
  }
}
