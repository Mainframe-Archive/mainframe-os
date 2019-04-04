// @flow
import EventEmitter from 'eventemitter3'

import { EthClient, jsonRpcResponse, type RequestPayload } from '@mainframe/eth'

// Extends the EthClient to make it compatible with Web3 JS by
// implementing the send function and routing calls

export default class MFWeb3Provider extends EventEmitter {
  _ethClient: EthClient

  constructor(ethClient: EthClient) {
    super()
    this._ethClient = ethClient
  }

  // TODO make compatible with web3 1.0 send(method, params)
  async send(
    payload: RequestPayload,
    cb: (error: ?Error, response: ?Object) => void,
  ) {
    try {
      let response
      switch (payload.method) {
        case 'eth_sendTransaction':
          if (this._ethClient.walletProvider) {
            const request = await this._ethClient.generateTXRequest(
              payload.params[0],
            )
            response = await this._ethClient.send(
              request.method,
              request.params,
            )
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
              payload.params[0],
            )
          }
          break
        default:
          response = await this._ethClient.send(payload.method, payload.params)
      }
      cb(null, jsonRpcResponse(response, payload.id))
    } catch (err) {
      cb(err)
    }
  }
}
