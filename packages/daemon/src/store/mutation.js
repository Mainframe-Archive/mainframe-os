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
import type RequestContext from '../rpc/RequestContext'
import { type bzzHash } from '../swarm/feed.js'

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

  const saveRequired = await user.publicFeed.syncManifest(ctx.bzz)
  if (saveRequired) await ctx.openVault.save()
  user.publicFeed.publishJSON(ctx.bzz, user.publicFeedData)

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

export const deleteContact = async (
  ctx: RequestContext,
  userID: ID,
  contactID: ID,
): Promise<void> => {
  ctx.openVault.identities.deleteContact(userID, contactID)
  await ctx.openVault.save()
}
