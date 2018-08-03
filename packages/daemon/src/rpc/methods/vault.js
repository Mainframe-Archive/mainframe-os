// @flow

import { vaultError } from '../errors'
import type RequestContext from '../RequestContext'

const vaultParams = {
  path: { type: 'string', empty: false },
  password: { type: 'string', empty: false },
}

type VaultParams = { path: string, password: string }

export const create = {
  params: vaultParams,
  handler: async (ctx: RequestContext, params: VaultParams) => {
    try {
      await ctx.vaults.create(
        ctx.socket,
        params.path,
        Buffer.from(params.password),
      )
    } catch (err) {
      // TODO: different error code depending on actual error
      throw vaultError(err.message)
    }
  },
}

export const open = {
  params: vaultParams,
  handler: async (ctx: RequestContext, params: VaultParams) => {
    try {
      await ctx.vaults.open(
        ctx.socket,
        params.path,
        Buffer.from(params.password),
      )
    } catch (err) {
      // TODO: different error code depending on actual error
      throw vaultError(err.message)
    }
  },
}
