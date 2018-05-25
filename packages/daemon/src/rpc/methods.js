// @flow

import {
  decodeBase64,
  encodeBase64,
  type base64,
} from '@mainframe/utils-base64'
import type { ID } from '@mainframe/utils-id'
import type { Socket } from 'net'

import { RPCError } from './errors'
import type { RequestContext } from './types'
import web3Client from './web3Client'

export default {
  mf_apiVersion: () => 0,

  mf_openVault: async (
    ctx: RequestContext,
    [path, key]: [string, base64] = [],
  ) => {
    try {
      await ctx.vaults.open(ctx.socket, path, decodeBase64(key))
      return 'OK'
    } catch (err) {
      // TODO: different error code depending on actual error
      throw new RPCError(-32000, err.message)
    }
  },

  mf_newVault: async (
    ctx: RequestContext,
    [path, key]: [string, base64] = [],
  ) => {
    try {
      await ctx.vaults.create(ctx.socket, path, decodeBase64(key))
      return 'OK'
    } catch (err) {
      // TODO: different error code depending on actual error
      throw new RPCError(-32000, err.message)
    }
  },

  mf_newUserIdentity: (ctx: RequestContext): { id: ID } => {
    const id = ctx.openVault.identities.createOwnUser()
    return { id }
  },

  mf_callWeb3: (
    ctx: RequestContext,
    [appID, identityID, method, params]: [ID, ID, string, any] = [],
  ) => {
    // TODO: check app permissions to ensure call is allowed
    const app = ctx.openVault.apps.getApp(appID)

    if (app == null) {
      // TODO: error code
      throw new RPCError(-32000, 'App not found')
    }

    return web3Client.request(method, params)
  },
}
