// @flow

import { Observable } from 'rxjs'

import ClientAPIs from '../ClientAPIs'
import type {
  CommsGetSubscribableParams,
  CommsGetSubscribableResult,
  CommsPublishParams,
  CommsSubscribeParams,
} from '../types'

export default class ContactAPIs extends ClientAPIs {
  publish(params: CommsPublishParams): Promise<void> {
    return this._rpc.request('comms_publish', params)
  }

  async subscribe(params: CommsSubscribeParams): Promise<Observable<Object>> {
    const subscription = await this._rpc.request('comms_subscribe', params)
    const unsubscribe = () => {
      return this._rpc.request('sub_unsubscribe', { id: subscription })
    }

    return Observable.create(observer => {
      this._rpc.subscribe({
        next: msg => {
          if (
            msg.method === 'comms_subscription' &&
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

  getSubscribable(
    params: CommsGetSubscribableParams,
  ): Promise<CommsGetSubscribableResult> {
    return this._rpc.request('comms_getSubscribable', params)
  }
}
