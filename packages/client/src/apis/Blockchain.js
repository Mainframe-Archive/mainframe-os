// @flow
import { Observable } from 'rxjs'

import ClientAPIs from '../ClientAPIs'
import type { BlockchainWeb3SendParams } from '../types'

export default class BlockchainAPIs extends ClientAPIs {
  web3Send(params: BlockchainWeb3SendParams): Promise<Object> {
    return this._rpc.request('blockchain_web3Send', params)
  }

  async web3Subscribe(params: BlockchainWeb3SendParams) {
    const subID = await this._rpc.request('blockchain_web3Subscribe', params)

    const unsubscribe = () => {
      return this._rpc.request('blockchain_web3Unsubscribe', { id: subID })
    }

    const subscription = Observable.create(observer => {
      this._rpc.subscribe({
        next: msg => {
          if (
            msg.method === 'eth_subscription' &&
            msg.params != null &&
            msg.params.subscription === subID
          ) {
            observer.next(msg.params)
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
    return {
      subscription,
      id: subID,
    }
  }

  async web3Unsubscribe(params: BlockchainWeb3SendParams): Promise<Object> {
    return this._rpc.request('blockchain_web3Unsubscribe', params)
  }

  async subscribeNetworkChanged(): Promise<Observable<{ networkID: string }>> {
    const subscription = await this._rpc.request(
      'blockchain_subEthNetworkChanged',
    )
    const unsubscribe = () => {
      return this._rpc.request('sub_unsubscribe', { id: subscription })
    }

    return Observable.create(observer => {
      this._rpc.subscribe({
        next: msg => {
          if (
            msg.method === 'eth_network_subscription' &&
            msg.params != null &&
            msg.params.subscription === subscription
          ) {
            const { result } = msg.params
            if (result != null) {
              try {
                observer.next(result)
              } catch (err) {
                // eslint-disable-next-line no-console
                console.warn('Error handling message', result, err)
              }
            }
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
  }
}
