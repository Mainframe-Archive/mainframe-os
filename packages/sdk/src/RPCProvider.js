//@flow
import EventEmitter from 'eventemitter3'
import { Observable } from 'rxjs'
import type StreamRPC from '@mainframe/rpc-stream'

let unsubCounter = 1

export default class RpcProvider extends EventEmitter {
  _rpc: StreamRPC

  subscriptions = {}

  constructor(rpc: StreamRPC) {
    super(rpc)
    this._rpc = rpc
  }

  async sendPayload(payload: Object) {
    let result
    if (payload.method === 'eth_unsubscribe') {
      result = await this._rpc.request('blockchain_web3Unsubscribe', {
        id: payload.params[0],
      })
    } else if (payload.method === 'eth_subscribe') {
      const subscription = await this._rpc.request(
        'blockchain_web3Subscribe',
        payload,
      )
      const unsubscribe = () => {
        unsubCounter += 1
        const unsubPayload = {
          id: unsubCounter,
          jsonrpc: '2.0',
          params: [subscription],
          method: 'eth_unsubscribe',
        }
        return this._rpc.request('blockchain_web3Send', unsubPayload)
      }

      const sub = Observable.create(observer => {
        this._rpc.subscribe({
          next: msg => {
            if (
              msg.method === 'eth_blockchain_subscription' &&
              msg.params != null &&
              msg.params.subscription === subscription
            ) {
              observer.next(msg)
            }
          },
          error: err => {
            observer.error(err)
            unsubscribe()
          },
          complete: () => {
            observer.complete()
            unsubscribe()
          },
        })

        return unsubscribe
      })

      const unsub = sub.subscribe(value => {
        this.emit('data', value)
      })
      this.subscriptions[subscription] = unsub
      result = subscription
    } else {
      result = await this._rpc.request('blockchain_web3Send', payload)
    }
    const response = {
      result,
      id: payload.id,
      jsonrpc: '2.0',
      error: null,
    }
    return response
  }
}
