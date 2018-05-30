// @flow

import type { ID } from '@mainframe/utils-id'

import type RequestContext from '../RequestContext'

export const identity_createUser = (ctx: RequestContext): { id: ID } => {
  const id = ctx.openVault.identities.createOwnUser()
  return { id }
}
