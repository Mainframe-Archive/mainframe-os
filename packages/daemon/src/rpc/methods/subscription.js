// @flow

import type { ID } from '@mainframe/utils-id'

import type RequestContext from '../RequestContext'

export const unsubscribe = (ctx: RequestContext, [id]: [ID] = []): void => {
  ctx.removeSubscription(id)
}
