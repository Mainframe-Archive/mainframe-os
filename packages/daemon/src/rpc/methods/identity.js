// @flow

import type { ID } from '@mainframe/utils-id'

import type RequestContext from '../RequestContext'

export const createUser = (ctx: RequestContext): { id: ID } => {
  return { id: ctx.openVault.identities.createOwnUser() }
}

export const getOwnUsers = (ctx: RequestContext): { ids: Array<string> } => {
  return { ids: Object.keys(ctx.openVault.identities.ownUsers) }
}
