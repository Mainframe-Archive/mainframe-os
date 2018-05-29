// @flow

import type { ID } from '@mainframe/utils-id'

import { clientError } from '../errors'
import type RequestContext from '../RequestContext'
import web3Client from '../web3Client'

export const web3_call = (
  ctx: RequestContext,
  [appID, identityID, method, params]: [ID, ID, string, any] = [],
) => {
  // TODO: replace by session and check app permissions to ensure call is allowed
  const app = ctx.openVault.apps.getApp(appID)

  if (app == null) {
    // TODO: proper error code
    throw clientError('App not found')
  }

  return web3Client.request(method, params)
}
