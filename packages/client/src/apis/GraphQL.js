// @flow

import { Observable } from 'rxjs'

import ClientAPIs from '../ClientAPIs'
import type { GraphQLQueryParams, GraphQLQueryResult } from '../types'

export default class GraphQLAPIs extends ClientAPIs {
  query(params: GraphQLQueryParams): Promise<GraphQLQueryResult> {
    return this._rpc.request('graphql_query', params)
  }

  async subscription(
    params: GraphQLQueryParams,
  ): Promise<Observable<GraphQLQueryResult>> {
    const subscription = await this._rpc.request('graphql_subscription', params)
    const unsubscribe = () => {
      return this._rpc.request('sub_unsubscribe', { id: subscription })
    }

    return Observable.create(observer => {
      this._rpc.subscribe({
        next: msg => {
          if (
            msg.method === 'graphql_subscription_update' &&
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
