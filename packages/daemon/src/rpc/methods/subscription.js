// @flow

import { LOCAL_ID_SCHEMA } from '@mainframe/client'
import type { ID } from '@mainframe/utils-id'

import type ClientContext from '../ClientContext'

export const feed = {
  params: {
    key: 'string',
  },
  handler: (ctx: ClientContext, params: { key: string }): string => {
    const sub = ctx.createFeedSubscription(params.key)
    return sub.id
  },
}

export const unsubscribe = {
  params: {
    id: LOCAL_ID_SCHEMA,
  },
  handler: (ctx: ClientContext, params: { id: ID }): void => {
    ctx.removeSubscription(params.id)
  },
}
