// @flow

import {
  type CommsGetSubscribableParams,
  type CommsGetSubscribableResult,
  type CommsPublishParams,
  COMMS_GET_SUBSCRIBABLE_SCHEMA,
  COMMS_PUBLISH_SCHEMA,
} from '@mainframe/client'
import { idType as fromClientID } from '@mainframe/utils-id'

import type ClientContext from '../../context/ClientContext'

export const publish = {
  params: COMMS_PUBLISH_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: CommsPublishParams,
  ): Promise<void> => {
    await ctx.mutations.publishAppData(
      fromClientID(params.appID),
      fromClientID(params.contactID),
      params.key,
      params.value,
    )
  },
}

export const getSubscribable = {
  params: COMMS_GET_SUBSCRIBABLE_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: CommsGetSubscribableParams,
  ): Promise<CommsGetSubscribableResult> => {
    const appFeeds = await ctx.queries.getContactAppFeeds(
      fromClientID(params.appID),
      fromClientID(params.contactID),
    )
    return Object.keys(appFeeds).filter(key => appFeeds[key].type === 'json')
  },
}
