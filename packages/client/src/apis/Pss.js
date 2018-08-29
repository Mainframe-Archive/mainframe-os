// @flow

import { Observable } from 'rxjs'

import ClientAPIs from '../ClientAPIs'

export default class PssAPIs extends ClientAPIs {
  baseAddr(): Promise<string> {
    return this._rpc.request('pss_baseAddr')
  }

  async createTopicSubscription(topic: string): Promise<Observable<Object>> {
    const subscription = await this._rpc.request(
      'pss_createTopicSubscription',
      { topic },
    )
    const unsubscribe = () => {
      return this._rpc.request('sub_unsubscribe', { id: subscription })
    }

    return Observable.create(observer => {
      this._rpc.subscribe({
        next: msg => {
          if (
            msg.method === 'pss_subscription' &&
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

  getPublicKey(): Promise<string> {
    return this._rpc.request('pss_getPublicKey')
  }

  sendAsym(key: string, topic: string, message: string): Promise<null> {
    return this._rpc.request('pss_sendAsym', { key, topic, message })
  }

  setPeerPublicKey(key: string, topic: string): Promise<null> {
    return this._rpc.request('pss_setPeerPublicKey', { key, topic })
  }

  stringToTopic(string: string): Promise<string> {
    return this._rpc.request('pss_stringToTopic', { string })
  }
}
