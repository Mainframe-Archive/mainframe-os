// @flow

import { type ID } from '@mainframe/utils-id'
import { type hexValue } from '@erebos/hex'

import OwnDeveloperIdentity, {
  type OwnDeveloperProfile,
} from '../identity/OwnDeveloperIdentity'
import OwnUserIdentity, {
  type OwnUserProfile,
} from '../identity/OwnUserIdentity'
import PeerUserIdentity, {
  type PeerUserProfile,
  type Feeds,
} from '../identity/PeerUserIdentity'
import Contact from '../identity/Contact'
import type RequestContext from '../rpc/RequestContext'
import { OwnFeed, type bzzHash } from '../swarm/feed'

export const createDeveloper = async (
  ctx: RequestContext,
  profile: OwnDeveloperProfile,
): Promise<OwnDeveloperIdentity> => {
  const dev = ctx.openVault.identities.createOwnDeveloper(profile)
  await ctx.openVault.save()
  return dev
}

export const createUser = async (
  ctx: RequestContext,
  profile: OwnUserProfile,
): Promise<OwnUserIdentity> => {
  const user = ctx.openVault.identities.createOwnUser(profile)
  await ctx.openVault.save()

  // TODO: Process feed work asynchronously
  const saveRequired = await user.publicFeed.syncManifest(ctx.bzz)
  if (saveRequired) await ctx.openVault.save()
  await user.publicFeed.publishJSON(ctx.bzz, user.publicFeedData())

  return user
}

export const addPeerByFeed = async (
  ctx: RequestContext,
  feedHash: bzzHash,
): Promise<PeerUserIdentity> => {
  const peerPublicData = await ctx.bzz.download(feedHash)
  const {
    publicKey,
    profile,
    firstContactAddress,
  } = await peerPublicData.json()
  return addPeer(ctx, publicKey, profile, feedHash, firstContactAddress)
}

export const addPeer = async (
  ctx: RequestContext,
  publicKey: string,
  profile: PeerUserProfile,
  publicFeed: string,
  firstContactAddress: hexValue,
  feeds?: Feeds,
): Promise<PeerUserIdentity> => {
  const peer = ctx.openVault.identities.createPeerUser(
    publicKey,
    profile,
    publicFeed,
    firstContactAddress,
    feeds,
  )
  await ctx.openVault.save()
  return peer
}

export const createContactFromPeer = async (
  ctx: RequestContext,
  userID: ID,
  peerID: ID,
): Promise<Contact> => {
  const contact = ctx.openVault.identities.createContactFromPeer(userID, peerID)
  await ctx.openVault.save()

  // TODO: Process feed work asynchronously
  const user = ctx.openVault.identities.getOwnUser(userID)
  if (!user) throw new Error('User not found')
  const peer = ctx.openVault.identities.getPeerUser(peerID)
  if (!peer) throw new Error('Peer not found')

  await contact.ownFeed.syncManifest(ctx.bzz)
  // TODO: Actual data
  await contact.ownFeed.publishJSON(ctx.bzz, { message: 'connected' })

  // Create ephemeral one-use feed from the first-contact keypair and peer-specific topic
  const firstContactFeed = OwnFeed.create(
    user.firstContactFeed.keyPair,
    peer.base64PublicKey(),
  )
  await firstContactFeed.publishJSON(ctx.bzz, contact.firstContactData())
  contact.requestSent = true
  await ctx.openVault.save()

  return contact
}

export const deleteContact = async (
  ctx: RequestContext,
  userID: ID,
  contactID: ID,
): Promise<void> => {
  ctx.openVault.identities.deleteContact(userID, contactID)
  await ctx.openVault.save()
}
