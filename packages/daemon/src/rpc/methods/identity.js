// @flow

import {
  idType as toClientID,
  /* eslint-disable import/named */
  type IdentityAddPeerParams,
  type IdentityAddPeerResult,
  type IdentityAddPeerByFeedParams,
  type IdentityCreateContactFromFeedParams,
  type IdentityCreateContactFromPeerParams,
  type IdentityCreateContactResult,
  type IdentityCreateDeveloperParams,
  type IdentityCreateUserParams,
  type IdentityCreateResult,
  type IdentityDeleteContactParams,
  type IdentityGetOwnDevelopersResult,
  type IdentityGetOwnUsersResult,
  type IdentityGetPeersResult,
  type IdentityGetUserContactsParams,
  type IdentityGetUserContactsResult,
  type IdentityLinkEthWalletAccountParams,
  type IdentityUnlinkEthWalletAccountParams,
  type IdentityUpdateUserParams,
  IDENTITY_ADD_PEER_SCHEMA,
  IDENTITY_ADD_PEER_BY_FEED_SCHEMA,
  IDENTITY_CREATE_CONTACT_FROM_FEED_SCHEMA,
  IDENTITY_CREATE_CONTACT_FROM_PEER_SCHEMA,
  IDENTITY_CREATE_OWN_USER_SCHEMA,
  IDENTITY_CREATE_OWN_DEVELOPER_SCHEMA,
  IDENTITY_DELETE_CONTACT_SCHEMA,
  IDENTITY_GET_USER_CONTACTS_SCHEMA,
  IDENTITY_LINK_ETH_WALLET_SCHEMA,
  IDENTITY_UNLINK_ETH_WALLET_SCHEMA,
  IDENTITY_UPDATE_USER_SCHEMA,
  /* eslint-enable import/named */
} from '@mainframe/client'
import { idType as fromClientID } from '@mainframe/utils-id'

import type ClientContext from '../../context/ClientContext'

export const createDeveloper = {
  params: IDENTITY_CREATE_OWN_DEVELOPER_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: IdentityCreateDeveloperParams,
  ): Promise<IdentityCreateResult> => {
    const dev = await ctx.mutations.createDeveloper(params.profile)
    return { id: toClientID(dev.localID) }
  },
}

export const createUser = {
  params: IDENTITY_CREATE_OWN_USER_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: IdentityCreateUserParams,
  ): Promise<IdentityCreateResult> => {
    const user = await ctx.mutations.createUser(params.profile)
    return { id: toClientID(user.localID) }
  },
}

export const getOwnDevelopers = (
  ctx: ClientContext,
): IdentityGetOwnDevelopersResult => {
  const { ownDevelopers } = ctx.openVault.identities
  const developers = Object.keys(ownDevelopers).map(id => {
    const wallets = ctx.queries.getUserEthWallets(id)
    return {
      id: ownDevelopers[id].id,
      localID: ownDevelopers[id].localID,
      profile: ownDevelopers[id].profile,
      ethWallets: wallets,
    }
  })
  return { developers }
}

export const getOwnUsers = (ctx: ClientContext): IdentityGetOwnUsersResult => {
  const { ownUsers } = ctx.openVault.identities
  const users = Object.keys(ownUsers).map(id => {
    const wallets = ctx.queries.getUserEthWallets(id)

    return {
      id: ownUsers[id].id,
      localID: id,
      profile: ownUsers[id].profile,
      feedHash: ownUsers[id].publicFeed.feedHash,
      ethWallets: wallets,
    }
  })
  return { users }
}

export const updateUser = {
  params: IDENTITY_UPDATE_USER_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: IdentityUpdateUserParams,
  ): Promise<void> => {
    await ctx.mutations.updateUser(fromClientID(params.userID), params.profile)
  },
}

export const linkEthWallet = {
  params: IDENTITY_LINK_ETH_WALLET_SCHEMA,
  handler: async (
    ctx: ClientContext,
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
    ctx: ClientContext,
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

export const addPeerByFeed = {
  params: IDENTITY_ADD_PEER_BY_FEED_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: IdentityAddPeerByFeedParams,
  ): Promise<IdentityAddPeerResult> => {
    const peer = await ctx.mutations.addPeerByFeed(params.feedHash)
    return { id: toClientID(peer.localID) }
  },
}

export const addPeer = {
  params: IDENTITY_ADD_PEER_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: IdentityAddPeerParams,
  ): Promise<IdentityAddPeerResult> => {
    const peer = await ctx.mutations.addPeer(params)
    return { id: toClientID(peer.localID) }
  },
}

export const getPeers = (ctx: ClientContext): IdentityGetPeersResult => {
  const peerUsers = ctx.openVault.identities.peerUsers
  const peers = Object.keys(peerUsers).map(id => {
    const peer = peerUsers[id]
    return {
      id: toClientID(id),
      publicFeed: peer.publicFeed,
      profile: {
        name: peer.name,
        avatar: peer.avatar,
      },
    }
  })
  return { peers }
}

export const createContactFromPeer = {
  params: IDENTITY_CREATE_CONTACT_FROM_PEER_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: IdentityCreateContactFromPeerParams,
  ): Promise<IdentityCreateContactResult> => {
    const contact = await ctx.mutations.createContactFromPeer(
      fromClientID(params.userID),
      fromClientID(params.peerID),
    )
    return { id: toClientID(contact.localID) }
  },
}

export const createContactFromFeed = {
  params: IDENTITY_CREATE_CONTACT_FROM_FEED_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: IdentityCreateContactFromFeedParams,
  ): Promise<IdentityCreateContactResult> => {
    const contact = await ctx.mutations.createContactFromFeed(
      fromClientID(params.userID),
      params.feedHash,
    )
    return { id: toClientID(contact.localID) }
  },
}

export const deleteContact = {
  params: IDENTITY_DELETE_CONTACT_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: IdentityDeleteContactParams,
  ): Promise<void> => {
    await ctx.mutations.deleteContact(
      fromClientID(params.userID),
      fromClientID(params.contactID),
    )
  },
}

export const getUserContacts = {
  params: IDENTITY_GET_USER_CONTACTS_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: IdentityGetUserContactsParams,
  ): Promise<IdentityGetUserContactsResult> => {
    const contacts = ctx.queries.getUserContacts(params.userID)
    return { contacts }
  },
}
