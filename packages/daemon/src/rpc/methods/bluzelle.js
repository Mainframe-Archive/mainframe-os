// @flow

// eslint-disable-next-line import/named
import {
  BLUZELLE_READ_SCHEMA,
  BLUZELLE_WRITE_SCHEMA,
  type BluzelleReadParams,
  type BluzelleWriteParams,
} from '@mainframe/client'

import type RequestContext from '../RequestContext'

export const read = {
  params: BLUZELLE_READ_SCHEMA,
  handler: async (ctx: RequestContext, params: BluzelleReadParams): Promise<string> => {
    return ctx.bluzelle.read(params.uuid, params.key)
  },
}

export const write = {
  params: BLUZELLE_WRITE_SCHEMA,
  handler: async (ctx: RequestContext, params: BluzelleWriteParams): Promise<void> => {
    const hasKey = await ctx.bluzelle.has(params.uuid, params.key)
    if (hasKey) {
      return ctx.bluzelle.update(params.uuid, params.key, params.value)
    } else {
      return ctx.bluzelle.create(params.uuid, params.key, params.value)
    }
  },
}
