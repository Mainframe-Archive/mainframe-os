// @flow

import { Observable } from 'rxjs'

import ClientAPIs from '../ClientAPIs'
import type { ContactID } from '../types'

export default class CommsAPIs extends ClientAPIs {
  async publish(
    contactID: ContactID,
    key: string,
    value: Object,
  ): Promise<void> {
    return this._rpc.request('comms_publish', { contactID, key, value })
  }

  async subscribe(
    contactID: ContactID,
    key: string,
  ): Promise<Observable<Object>> {
    const subscription = await this._rpc.request('comms_subscribe', {
      contactID,
      key,
    })
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

  async getSubscribable(contactID: ContactID): Promise<Array<string>> {
    return this._rpc.request('comms_getSubscribable', { contactID })
  }
}
