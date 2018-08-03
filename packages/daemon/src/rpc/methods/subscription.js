// @flow

import type { ID } from '@mainframe/utils-id'

import type RequestContext from '../RequestContext'

import { localIdParam } from './parameters'

export const unsubscribe = {
  params: {
    id: localIdParam,
  },
  handler: (ctx: RequestContext, params: { id: ID }): void => {
    ctx.removeSubscription(params.id)
  },
}
