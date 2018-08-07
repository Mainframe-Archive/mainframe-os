// @flow
// eslint-disable-next-line import/named
import { type ID } from '@mainframe/utils-id'

import type RequestContext from '../RequestContext'

type OwnIdentity = {
  id: string,
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

export const getOwnUsers = (
  ctx: RequestContext,
): { users: Array<OwnIdentity> } => {
  const { ownUsers } = ctx.openVault.identities
  const users = Object.keys(ownUsers).map(id => {
    return { id, data: ownUsers[id].data }
  })
  return { users }
}

export const getOwnDevelopers = (
  ctx: RequestContext,
): { developers: Array<OwnIdentity> } => {
  const { ownDevelopers } = ctx.openVault.identities
  const developers = Object.keys(ownDevelopers).map(id => {
    return { id, data: ownDevelopers[id].data }
  })
  return { developers }
}
