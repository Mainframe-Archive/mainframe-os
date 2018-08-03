// @flow

import type { ID } from '@mainframe/utils-id'

import { clientError, permissionErrorFromResult } from '../errors'
import type RequestContext from '../RequestContext'
import web3Client from '../web3Client'

export const request = async (
  ctx: RequestContext,
  params: { sessID: ID, method: string, params: any, granted: ?boolean },
): Promise<?mixed> => {
  const session = ctx.openVault.getSession(params.sessID)
  if (session == null) {
    throw clientError('Invalid session')
  }

  if (params.granted !== true) {
    const result = session.checkPermission('WEB3_CALL')
    if (result !== 'granted') {
      throw permissionErrorFromResult(result)
    }
  }

  return web3Client.request(params.method, params.params)
}
