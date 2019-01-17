// @flow

import { LOCAL_ID_SCHEMA } from '@mainframe/client'
import type { ID } from '@mainframe/utils-id'

import type ClientContext from '../../context/ClientContext'

export const unsubscribe = {
  params: {
    id: LOCAL_ID_SCHEMA,
  },
  handler: (ctx: ClientContext, params: { id: ID }): void => {
    ctx.subscriptions.remove(params.id)
  },
}
