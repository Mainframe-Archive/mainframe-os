// @flow

import { hexValueType } from '@erebos/hex'
import type { StrictPermissionsRequirements } from '@mainframe/app-permissions'
import { idType, type ID } from '@mainframe/utils-id'
import { getFeedTopic } from '@erebos/api-bzz-base'

import type { OwnApp } from '../app'
import type {
  Contact,
  OwnDeveloperIdentity,
  OwnUserIdentity,
  PeerUserIdentity,
} from '../identity'
import type { OwnDeveloperProfile } from '../identity/OwnDeveloperIdentity'
import type { OwnUserProfile } from '../identity/OwnUserIdentity'
import { OwnFeed, type bzzHash } from '../swarm/feed'

import type ClientContext from './ClientContext'

export type Feeds = {
  [type: string]: bzzHash,
}

export type CreateAppParams = {
  contentsPath: string,
  developerID: ID,
  name?: ?string,
  version?: ?string,
  permissionsRequirements?: ?StrictPermissionsRequirements,
}

export type AddPeerParams = {
  key: string,
  profile: {
    name?: ?string,
    avatar?: ?string,
  },
  publicFeed: string,
  firstContactAddress: string,
  otherFeeds: Feeds,
}

export type MutationEventType =
  | 'own_app_created'
  | 'vault_created'
  | 'vault_opened'

export default class ContextMutations {
  _context: ClientContext

  constructor(context: ClientContext) {
    this._context = context
  }

  // Apps

  async createApp(params: CreateAppParams): Promise<OwnApp> {
    const app = this._context.openVault.createApp({
      contentsPath: params.contentsPath,
      developerID: params.developerID,
      name: params.name,
      version: params.version,
      permissionsRequirements: params.permissionsRequirements,
    })
    await this._context.openVault.save()
    this._context.next({ type: 'own_app_created', app })
    return app
  }

  // Contacts

  async addPeer(params: AddPeerParams): Promise<PeerUserIdentity> {
    const peer = this._context.openVault.identities.createPeerUser(
      params.key,
      params.profile,
      params.publicFeed,
      hexValueType(params.firstContactAddress),
      params.otherFeeds,
    )
    await this._context.openVault.save()
    return peer
  }

  async addPeerByFeed(hash: bzzHash): Promise<PeerUserIdentity> {
    // TODO: validate peer data
    const peerPublicRes = await this._context.io.bzz.download(hash)
    const data = await peerPublicRes.json()
    return await this.addPeer({
      key: data.publicKey,
      profile: data.profile,
      firstContactAddress: data.firstContactAddress,
      publicFeed: hash,
      otherFeeds: {},
    })
  }

  async createContactFromPeer(
    userID: ID,
    peerID: ID,
    aliasName?: string,
  ): Promise<Contact> {
    const contact = this._context.openVault.identities.createContactFromPeer(
      userID,
      peerID,
      aliasName,
    )
    await this._context.openVault.save()

    // TODO: Process feed work asynchronously
    const user = this._context.openVault.identities.getOwnUser(userID)
    if (!user) throw new Error('User not found')
    const peer = this._context.openVault.identities.getPeerUser(peerID)
    if (!peer) throw new Error('Peer not found')

    await contact.ownFeed.syncManifest(this._context.io.bzz)
    // TODO: Actual data
    await contact.ownFeed.publishJSON(this._context.io.bzz, {
      message: 'connected',
    })

    // Create ephemeral one-use feed from the first-contact keypair and peer-specific topic
    const firstContactFeed = OwnFeed.create(
      user.firstContactFeed.keyPair,
      peer.base64PublicKey(),
    )
    await firstContactFeed.publishJSON(
      this._context.io.bzz,
      contact.firstContactData(),
    )
    contact.requestSent = true
    await this._context.openVault.save()

    // Check if other user created feed
    try {
      const topic = getFeedTopic({ name: user.base64PublicKey() })
      const peerFeedRes = await this._context.io.bzz.getFeedValue(
        peer.firstContactAddress,
        { topic },
        { mode: 'content-response' },
      )
      const data = await peerFeedRes.json()
      contact.contactFeed = data.privateFeed
      await this._context.openVault.save()
    } catch (_e) {
      // Should always be due to contact feed not being ready
      // TODO: Rethrow other errors
    }

    return contact
  }

  async createContactFromFeed(userID: ID, hash: bzzHash): Promise<Contact> {
    const peer = await this.addPeerByFeed(hash)
    return await this.createContactFromPeer(userID, idType(peer.localID))
  }

  async deleteContact(userID: ID, contactID: ID): Promise<void> {
    this._context.openVault.identities.deleteContact(userID, contactID)
    await this._context.openVault.save()
  }

  // Identities

  async createDeveloper(
    profile: OwnDeveloperProfile,
  ): Promise<OwnDeveloperIdentity> {
    const dev = this._context.openVault.identities.createOwnDeveloper(profile)
    await this._context.openVault.save()
    return dev
  }

  async createUser(profile: OwnUserProfile): Promise<OwnUserIdentity> {
    const user = this._context.openVault.identities.createOwnUser(profile)
    await this._context.openVault.save()

    // TODO: Process feed work asynchronously
    const saveRequired = await user.publicFeed.syncManifest(
      this._context.io.bzz,
    )
    if (saveRequired) await this._context.openVault.save()
    await user.publicFeed.publishJSON(
      this._context.io.bzz,
      user.publicFeedData(),
    )

    return user
  }

  // Vault

  async createVault(path: string, password: Buffer): Promise<void> {
    await this._context.vaults.create(this._context.socket, path, password)
    await this._context.io.eth.setup()
    this._context.next({ type: 'vault_created' })
  }

  async openVault(path: string, password: Buffer): Promise<void> {
    await this._context.vaults.open(this._context.socket, path, password)
    await this._context.io.eth.setup()
    this._context.next({ type: 'vault_opened' })
  }
}
