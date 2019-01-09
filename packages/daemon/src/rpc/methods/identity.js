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

import type RequestContext from '../RequestContext'

export const createDeveloper = {
  params: IDENTITY_CREATE_OWN_DEVELOPER_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: IdentityCreateDeveloperParams,
  ): Promise<IdentityCreateResult> => {
    const dev = ctx.openVault.identities.createOwnDeveloper(params.profile)
    await ctx.openVault.save()
    return { id: toClientID(dev.localID) }
  },
}

export const createUser = {
  params: IDENTITY_CREATE_OWN_USER_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: IdentityCreateUserParams,
  ): Promise<IdentityCreateResult> => {
    const user = ctx.openVault.identities.createOwnUser(params.profile)
    await ctx.openVault.save()
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
    _ctx: RequestContext,
    _params: IdentityAddPeerByFeedParams,
  ): Promise<IdentityAddPeerResult> => {
    // TODO - Fetch key and profile from feed and create peer
    throw new Error('not yet implemented')
  },
}

export const addPeer = {
  params: IDENTITY_ADD_PEER_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: IdentityAddPeerParams,
  ): Promise<IdentityAddPeerResult> => {
    const peerID = ctx.openVault.identities.createPeerUser(
      params.key,
      params.profile,
      params.publicFeed,
      params.otherFeeds,
    )
    return { id: toClientID(peerID) }
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
    ctx.openVault.identities.deleteContact(
      fromClientID(params.userID),
      fromClientID(params.contactID),
    )
    await ctx.openVault.save()
  },
}

export const getUserContacts = {
  params: IDENTITY_GET_USER_CONTACTS_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: IdentityGetUserContactsParams,
  ): Promise<IdentityGetUserContactsResult> => {
    //TODO: replace this with the real thing.
    const result = []
    for (let i = 0; i < 10; i++) {
      const contactTemplate = {
        id: `some_id_${i}`,
        profile: {
          image_hash: `some_image_hash_${i}`,
          name: `contact_name_${i}`,
          eth_addr: `some_eth_addr_${i}`,
        },
        connection: `${i % 2 ? 'connected' : 'sent'}`,
      }
      result.push(contactTemplate)
    }

    // const contacts = ctx.openVault.identities.getContactsForUser(
    //   fromClientID(params.userID),
    // )
    // if (contacts) {
    //   Object.keys(contacts).forEach(id => {
    //     const contact = contacts[id]
    //     const peer = ctx.openVault.identities.getPeerUser(
    //       fromClientID(contact.peerID),
    //     )
    //     if (peer) {
    //       const profile = { ...peer.profile, ...contact.profile }
    //       const contactRes = {
    //         id,
    //         profile,
    //         connection: contact.contactFeed ? 'connected' : 'sent',
    //         // For v1 first contact, we assign a full contact state
    //         // depending on if we've seen a private feed for our user
    //       }
    //       result.push(contactRes)
    //     }
    //   })
    // }
    return { contacts: result }
  },
}
