// @flow

import { LOCAL_ID_SCHEMA } from '@mainframe/client'
import type { ID } from '@mainframe/utils-id'

import type RequestContext from '../RequestContext'

export const unsubscribe = {
  params: {
    id: LOCAL_ID_SCHEMA,
  },
  handler: (ctx: RequestContext, params: { id: ID }): void => {
    ctx.removeSubscription(params.id)
  },
}
