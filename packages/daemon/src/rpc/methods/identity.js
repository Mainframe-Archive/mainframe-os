// @flow

import type { ID } from '@mainframe/utils-id'

import type RequestContext from '../RequestContext'

export const createUser = (ctx: RequestContext): { id: ID } => {
  return { id: ctx.openVault.identities.createOwnUser() }
}

// returns Array<ID> in practice but type gets lost by Object.keys()
export const getOwnUsers = (ctx: RequestContext): { ids: Array<string> } => {
  return { ids: Object.keys(ctx.openVault.identities.ownUsers) }
}
