// @flow

import type { ID } from '@mainframe/utils-id'

import { clientError, permissionErrorFromResult } from '../errors'
import type RequestContext from '../RequestContext'
import web3Client from '../web3Client'

export const request = async (
  ctx: RequestContext,
  [sessID, method, params, granted]: [ID, string, any, ?boolean] = [],
): Promise<?mixed> => {
  const session = ctx.openVault.getSession(sessID)
  if (session == null) {
    throw clientError('Invalid session')
  }

  if (granted !== true) {
    const result = session.checkPermission('WEB3_CALL')
    if (result !== 'granted') {
      throw permissionErrorFromResult(result)
    }
  }

  return web3Client.request(method, params)
}
