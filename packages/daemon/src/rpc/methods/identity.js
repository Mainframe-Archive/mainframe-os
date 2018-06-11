// @flow

import type { ID } from '@mainframe/utils-id'

import type RequestContext from '../RequestContext'

type OwnId = {
  id: ID,
  data: Object,
}

export const createUser = async (
  ctx: RequestContext,
  [data]: [Object] = [],
): { id: ID } => {
  const id = ctx.openVault.identities.createOwnUser(data)
  await ctx.openVault.save()
  return { id }
}

export const getOwnUsers = (ctx: RequestContext): { ids: Array<OwnId> } => {
  return {
    ids: Object.keys(ctx.openVault.identities.ownUsers).reduce((acc, id) => {
      const user = ctx.openVault.identities.ownUsers[id]
      acc.push({
        id,
        data: user.data || {},
      })
      return acc
    }, []),
  }
}
