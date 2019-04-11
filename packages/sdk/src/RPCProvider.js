//@flow
import EventEmitter from 'eventemitter3'
import { Observable } from 'rxjs'
import type StreamRPC from '@mainframe/rpc-stream'

export default class RpcProvider extends EventEmitter {
  _rpc: StreamRPC
  _requestId: number = 1

  subscriptions = {}

  constructor(rpc: StreamRPC) {
    super()
    this._rpc = rpc
  }

  async send(method: string, params: Array<*>): Promise<Object> {
    let result
    const payload = {
      id: this._requestId++,
      jsonrpc: '2.0',
      params,
      method,
    }
    if (method === 'eth_unsubscribe') {
      result = await this._rpc.request('blockchain_ethUnsubscribe', {
        id: params[0],
      })
    } else if (method === 'eth_subscribe') {
      const subscription = await this._rpc.request(
        'blockchain_ethSubscribe',
        payload,
      )
      const unsubscribe = () => {
        const unsubPayload = {
          id: this._requestId++,
          jsonrpc: '2.0',
          params: [subscription],
          method: 'eth_unsubscribe',
        }
        return this._rpc.request('blockchain_ethSend', unsubPayload)
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
      result = await this._rpc.request('blockchain_ethSend', payload)
    }

    return result
  }
}
