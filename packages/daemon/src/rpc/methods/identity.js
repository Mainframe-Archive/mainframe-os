// @flow
// eslint-disable-next-line import/named
import { idType, type ID } from '@mainframe/utils-id'

import type RequestContext from '../RequestContext'

type OwnId = {
  id: ID,
  data: Object,
}

export const createDeveloper = {
  params: {
    data: 'any', // TODO: data schema
  },
  handler: async (
    ctx: RequestContext,
    params: { data: Object },
  ): Promise<{ id: ID }> => {
    const id = ctx.openVault.identities.createOwnDeveloper(params.data)
    await ctx.openVault.save()
    return { id }
  },
}

export const createUser = {
  params: {
    data: 'any', // TODO: data schema
  },
  handler: async (
    ctx: RequestContext,
    params: { data: Object },
  ): Promise<{ id: ID }> => {
    const id = ctx.openVault.identities.createOwnUser(params.data)
    await ctx.openVault.save()
    return { id }
  },
}

export const getOwnUsers = (ctx: RequestContext): { users: Array<OwnId> } => {
  const { ownUsers } = ctx.openVault.identities
  const users = Object.keys(ownUsers).map(id => {
    const uID = idType(id)
    return { id: uID, data: ownUsers[uID].data }
  })
  return { users }
}

export const getOwnDevelopers = (
  ctx: RequestContext,
): { developers: Array<OwnId> } => {
  const { ownDevelopers } = ctx.openVault.identities
  const developers = Object.keys(ownDevelopers).map(id => {
    const uID = idType(id)
    return { id: uID, data: ownDevelopers[uID].data }
  })
  return { developers }
}
