// @flow

import {
  idType as toClientID,
  /* eslint-disable import/named */
  type IdentityAddPeerByKeyParams,
  type IdentityAddPeerByKeyResult,
  type IdentityCreateDeveloperParams,
  type IdentityCreateUserParams,
  type IdentityCreateResult,
  type IdentityGetOwnDevelopersResult,
  type IdentityGetOwnUsersResult,
  type IdentityGetPeersResult,
  type IdentityLinkEthWalletAccountParams,
  type IdentityUnlinkEthWalletAccountParams,
  IDENTITY_ADD_PEER_BY_KEY_SCHEMA,
  IDENTITY_LINK_ETH_WALLET_SCHEMA,
  IDENTITY_UNLINK_ETH_WALLET_SCHEMA,
  /* eslint-enable import/named */
} from '@mainframe/client'
import { idType as fromClientID } from '@mainframe/utils-id'

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
    const wallets =
      ctx.openVault.identityWallets.walletsByIdentity[toClientID(id)] || {}
    return {
      id: toClientID(id),
      data: ownDevelopers[id].data,
      ethWallets: wallets,
    }
  })
  return { developers }
}

export const getOwnUsers = (ctx: RequestContext): IdentityGetOwnUsersResult => {
  const { ownUsers } = ctx.openVault.identities
  const users = Object.keys(ownUsers).map(id => {
    const wallets =
      ctx.openVault.identityWallets.walletsByIdentity[toClientID(id)] || {}
    return {
      id: toClientID(id),
      data: ownUsers[id].data,
      ethWallets: wallets,
    }
  })
  return { users }
}

export const linkEthWallet = {
  params: IDENTITY_LINK_ETH_WALLET_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: IdentityLinkEthWalletAccountParams,
  ): Promise<void> => {
    if (!ctx.openVault.wallets.getEthWalletByID(params.walletID)) {
      throw new Error('Wallet not found')
    }
    if (!ctx.openVault.identities.getOwn(fromClientID(params.id))) {
      throw new Error('Identity not found')
    }
    ctx.openVault.identityWallets.linkWalletToIdentity(
      params.id,
      params.walletID,
      params.address,
    )
    await ctx.openVault.save()
  },
}

export const unlinkEthWallet = {
  params: IDENTITY_UNLINK_ETH_WALLET_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: IdentityUnlinkEthWalletAccountParams,
  ): Promise<void> => {
    ctx.openVault.identityWallets.unlinkWalletToIdentity(
      params.id,
      params.walletID,
      params.address,
    )
    await ctx.openVault.save()
  },
}

export const addPeerByKey = {
  params: IDENTITY_ADD_PEER_BY_KEY_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: IdentityAddPeerByKeyParams,
  ): Promise<IdentityAddPeerByKeyResult> => {
    const peerID = ctx.openVault.identities.createPeerUserFromKey(
      params.key,
      params.data,
      params.feeds,
    )
    await ctx.openVault.save()
    return { id: toClientID(peerID) }
  },
}

export const getPeers = (ctx: RequestContext): IdentityGetPeersResult => {
  const peerUsers = ctx.openVault.identities.peerUsers
  const peers = Object.keys(peerUsers).map(id => {
    const peer = peerUsers[id]
    return {
      id: toClientID(id),
      name: peer.name,
      avatar: peer.avatar,
    }
  })
  return { peers }
}
