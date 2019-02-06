// @flow

import {
  type CommsPublishParams,
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
