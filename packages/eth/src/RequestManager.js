// @flow
import EventEmitter from 'events'
import { WebsocketProvider } from 'web3-providers'

import type { AbstractProvider, RequestPayload } from './types'

const wsOptions = {
  timeout: 15000,
}

export default class EthRequestManager extends EventEmitter {
  _web3Provider: AbstractProvider
  _requestCount: number = 0

  constructor(provider: AbstractProvider | string) {
    super()
    if (typeof provider === 'string') {
      // TODO: handle http endpoints
      this._web3Provider = new WebsocketProvider(provider, wsOptions)
    } else {
      this._web3Provider = provider
    }
  }

  get web3Provider(): AbstractProvider {
    return this._web3Provider
  }

  setProviderURL(url: string) {
    // TODO: handle http
    // TODO: Cleanup websocket subs
    this._web3Provider = new WebsocketProvider(url, wsOptions)
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
    const res = await this.web3Provider.sendPayload(params)
    if (res.error) {
      throw res.error
    } else {
      return res.result
    }
  }
}
