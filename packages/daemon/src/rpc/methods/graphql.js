// @flow

import {
  GRAPHQL_QUERY_SCHEMA,
  type GraphQLQueryParams,
  type GraphQLQueryResult,
} from '@mainframe/client'
import type { ID } from '@mainframe/utils-id'
import { graphql, parse } from 'graphql'
import { subscribe } from 'graphql/subscription'

import type ClientContext from '../../context/ClientContext'
import { ContextSubscription } from '../../context/ContextSubscriptions'
import type { SubscriptionIterator } from '../../graphql/observableToAsyncIterator'
import schema from '../../graphql/schema'
import type { NotifyFunc } from '../../rpc/handleClient'

class GraphQLSubscription<T = *> extends ContextSubscription<
  SubscriptionIterator<T>,
> {
  constructor(iterator: SubscriptionIterator<T>) {
    super('graphql_subscription_update', iterator)
  }

  async startNotify(notify: NotifyFunc) {
    if (this.data == null) {
      throw new Error('Invalid subscription')
    }
    for await (const result of this.data) {
      if (result != null) {
        notify(this.method, { subscription: this.id, result })
      }
    }
  }

  async dispose() {
    if (this.data != null) {
      await this.data.return()
    }
  }
}

export const query = {
  params: GRAPHQL_QUERY_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: GraphQLQueryParams,
  ): Promise<GraphQLQueryResult> => {
    return graphql(schema, params.query, {}, ctx, params.variables)
  },
}

export const subscription = {
  params: GRAPHQL_QUERY_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: GraphQLQueryParams,
  ): Promise<ID> => {
    // $FlowFixMe: AsyncIterator
    const iterator = await subscribe(
      schema,
      parse(params.query),
      {},
      ctx,
      params.variables,
    )

    const subscription = new GraphQLSubscription(iterator)
    ctx.subscriptions.set(subscription)

    subscription.startNotify(ctx.notify).catch(() => {
      ctx.subscriptions.remove(subscription.id)
    })

    return subscription.id
  },
}
