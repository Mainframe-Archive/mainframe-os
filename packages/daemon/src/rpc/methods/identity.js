// @flow

import {
  idType as toClientID,
  /* eslint-disable import/named */
  type IdentityCreateDeveloperParams,
  type IdentityCreateUserParams,
  type IdentityCreateResult,
  type IdentityGetOwnDevelopersResult,
  type IdentityGetOwnUsersResult,
  /* eslint-enable import/named */
} from '@mainframe/client'

import type RequestContext from '../RequestContext'

export const createDeveloper = {
  params: {
    data: 'any', // TODO: data schema
  },
  handler: async (
    ctx: RequestContext,
    params: IdentityCreateDeveloperParams,
  ): Promise<IdentityCreateResult> => {
    const id = ctx.openVault.identities.createOwnDeveloper(params.data)
    await ctx.openVault.save()
    return { id: toClientID(id) }
  },
}

export const createUser = {
  params: {
    data: 'any', // TODO: data schema
  },
  handler: async (
    ctx: RequestContext,
    params: IdentityCreateUserParams,
  ): Promise<IdentityCreateResult> => {
    const id = ctx.openVault.identities.createOwnUser(params.data)
    await ctx.openVault.save()
    return { id: toClientID(id) }
  },
}

export const getOwnDevelopers = (
  ctx: RequestContext,
): IdentityGetOwnDevelopersResult => {
  const { ownDevelopers } = ctx.openVault.identities
  const developers = Object.keys(ownDevelopers).map(id => {
    return { id: toClientID(id), data: ownDevelopers[id].data }
  })
  return { developers }
}

export const getOwnUsers = (ctx: RequestContext): IdentityGetOwnUsersResult => {
  const { ownUsers } = ctx.openVault.identities
  const users = Object.keys(ownUsers).map(id => {
    return { id: toClientID(id), data: ownUsers[id].data }
  })
  return { users }
}
