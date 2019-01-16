// @flow

import {
  idType as toClientID,
  /* eslint-disable import/named */
  type IdentityAddPeerParams,
  type IdentityAddPeerResult,
  type IdentityAddPeerByFeedParams,
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
  IDENTITY_ADD_PEER_SCHEMA,
  IDENTITY_ADD_PEER_BY_FEED_SCHEMA,
  IDENTITY_CREATE_OWN_USER_SCHEMA,
  IDENTITY_CREATE_OWN_DEVELOPER_SCHEMA,
  IDENTITY_DELETE_CONTACT_SCHEMA,
  IDENTITY_GET_USER_CONTACTS_SCHEMA,
  IDENTITY_LINK_ETH_WALLET_SCHEMA,
  IDENTITY_UNLINK_ETH_WALLET_SCHEMA,
  /* eslint-enable import/named */
} from '@mainframe/client'
import { idType as fromClientID } from '@mainframe/utils-id'
import { hexValueType } from '@erebos/hex'

import * as mutation from '../../store/mutation'
import type RequestContext from '../RequestContext'

export const createDeveloper = {
  params: IDENTITY_CREATE_OWN_DEVELOPER_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: IdentityCreateDeveloperParams,
  ): Promise<IdentityCreateResult> => {
    const dev = await mutation.createDeveloper(ctx, params.profile)
    return { id: toClientID(dev.localID) }
  },
}

export const createUser = {
  params: IDENTITY_CREATE_OWN_USER_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: IdentityCreateUserParams,
  ): Promise<IdentityCreateResult> => {
    const user = await mutation.createUser(ctx, params.profile)
    return { id: toClientID(user.localID) }
  },
}

export const getOwnDevelopers = (
  ctx: RequestContext,
): IdentityGetOwnDevelopersResult => {
  const { ownDevelopers } = ctx.openVault.identities
  const developers = Object.keys(ownDevelopers).map(id => {
    const wallets = ctx.openVault.getWalletsForIdentity(id)
    return {
      id: ownDevelopers[id].id,
      localID: ownDevelopers[id].localID,
      profile: ownDevelopers[id].profile,
      ethWallets: wallets,
    }
  })
  return { developers }
}

export const getOwnUsers = (ctx: RequestContext): IdentityGetOwnUsersResult => {
  const { ownUsers } = ctx.openVault.identities
  const users = Object.keys(ownUsers).map(id => {
    const wallets = ctx.openVault.getWalletsForIdentity(id)

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

export const addPeerByFeed = {
  params: IDENTITY_ADD_PEER_BY_FEED_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: IdentityAddPeerByFeedParams,
  ): Promise<IdentityAddPeerResult> => {
    const peer = await mutation.addPeerByFeed(ctx, params.feedHash)
    return { id: toClientID(peer.localID) }
  },
}

export const addPeer = {
  params: IDENTITY_ADD_PEER_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: IdentityAddPeerParams,
  ): Promise<IdentityAddPeerResult> => {
    const peer = await mutation.addPeer(
      ctx,
      params.key,
      params.profile,
      params.publicFeed,
      hexValueType(params.firstContactAddress),
      params.otherFeeds,
    )
    return { id: toClientID(peer.localID) }
  },
}

export const getPeers = (ctx: RequestContext): IdentityGetPeersResult => {
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

export const deleteContact = {
  params: IDENTITY_DELETE_CONTACT_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: IdentityDeleteContactParams,
  ): Promise<void> => {
    await mutation.deleteContact(
      ctx,
      fromClientID(params.userID),
      fromClientID(params.contactID),
    )
  },
}

export const getUserContacts = {
  params: IDENTITY_GET_USER_CONTACTS_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: IdentityGetUserContactsParams,
  ): Promise<IdentityGetUserContactsResult> => {
    const result = []
    const contacts = ctx.openVault.identities.getContactsForUser(
      fromClientID(params.userID),
    )
    if (contacts) {
      Object.keys(contacts).forEach(id => {
        const contact = contacts[id]
        const peer = ctx.openVault.identities.getPeerUser(
          fromClientID(contact.peerID),
        )
        if (peer) {
          const profile = { ...peer.profile, ...contact.profile }
          const contactRes = {
            id,
            profile,
            connection: contact.contactFeed ? 'connected' : 'sent',
            // For v1 first contact, we assign a full contact state
            // depending on if we've seen a private feed for our user
          }
          result.push(contactRes)
        }
      })
    }
    return { contacts: result }
  },
}
