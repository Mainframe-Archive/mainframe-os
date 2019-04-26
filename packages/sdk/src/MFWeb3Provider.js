// @flow
import EventEmitter from 'eventemitter3'

import {
  EthClient,
  jsonRpcResponse,
  type JsonRpcRequest,
  type JsonRpcResponse,
} from '@mainframe/eth'

// Extends the EthClient to make it compatible with Web3 JS by
// implementing the send function and routing calls

type callback = (error: ?Error, response: ?JsonRpcResponse) => void

export default class EthereumProvider extends EventEmitter {
  _ethClient: EthClient

  constructor(ethClient: EthClient) {
    super()
    this._ethClient = ethClient
  }

  // Emulate older provider types that use sendAsync
  async sendAsync(payload: JsonRpcRequest, cb: callback) {
    return this.send(payload, cb)
  }

  // Emulate older provider types that use callbacks
  async send(
    methodOrPayload: string | JsonRpcRequest,
    paramsOrCallback: Array<*> | callback,
  ) {
    if (
      typeof methodOrPayload === 'string' &&
      Array.isArray(paramsOrCallback)
    ) {
      return this._send(methodOrPayload, paramsOrCallback)
    } else if (
      typeof methodOrPayload !== 'object' ||
      typeof paramsOrCallback !== 'function'
    ) {
      throw new Error('Bad argument types')
    }

    try {
      const { method, params, id } = methodOrPayload
      const response = await this._send(method, params)
      paramsOrCallback(null, jsonRpcResponse(response, id))
    } catch (err) {
      paramsOrCallback(err)
    }
  }

  async _send(method: string, params: Array<*>) {
    let response
    switch (method) {
      case 'eth_sendTransaction':
        if (this._ethClient.walletProvider) {
          const request = await this._ethClient.generateTXRequest(params[0])
          response = await this._ethClient.send(request.method, request.params)
        }
        break
      case 'eth_accounts':
        if (this._ethClient.walletProvider) {
          response = await this._ethClient.walletProvider.getAccounts()
        }
        break
      case 'eth_signTransaction':
        if (this._ethClient.walletProvider) {
          response = await this._ethClient.walletProvider.signTransaction(
            params[0],
          )
        }
        break
      case 'eth_sign':
        if (this._ethClient.walletProvider) {
          response = await this._ethClient.walletProvider.sign({
            address: params[0],
            data: params[1],
          })
        }
        break
      default:
        response = await this._ethClient.send(method, params)
    }
    return response
  }

  // Signal EIP1193 support
  isEIP1193() {
    return true
  }
}
