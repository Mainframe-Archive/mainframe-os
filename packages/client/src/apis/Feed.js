// @flow

import { Observable } from 'rxjs'

import ClientAPIs from '../ClientAPIs'

export default class FeedAPIs extends ClientAPIs {
  async createSubscription(params: {
    key: string,
  }): Promise<Observable<Object>> {
    const { key } = params
    const subscription = await this._rpc.request('sub_feed', { key })
    const unsubscribe = () => {
      return this._rpc.request('sub_unsubscribe', { id: subscription })
    }

    return Observable.create(observer => {
      this._rpc.subscribe({
        next: msg => {
          if (
            msg.method === `feed_update_${key}` &&
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
