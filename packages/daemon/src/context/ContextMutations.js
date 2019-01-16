// @flow

import { hexValueType } from '@erebos/hex'
import type {
  AppCreateParams,
  IdentityAddPeerByFeedParams,
  IdentityAddPeerParams,
  IdentityCreateDeveloperParams,
  IdentityCreateUserParams,
  IdentityDeleteContactParams,
  VaultParams,
} from '@mainframe/client'
import { idType as fromClientID } from '@mainframe/utils-id'

import type { OwnApp } from '../app'
import type {
  OwnDeveloperIdentity,
  OwnUserIdentity,
  PeerUserIdentity,
} from '../identity'

import type ClientContext from './ClientContext'

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

  async createApp(params: AppCreateParams): Promise<OwnApp> {
    const app = this._context.openVault.createApp({
      contentsPath: params.contentsPath,
      developerID: fromClientID(params.developerID),
      name: params.name,
      version: params.version,
      permissionsRequirements: params.permissionsRequirements,
    })
    await this._context.openVault.save()
    this._context.next({ type: 'own_app_created', app })
    return app
  }

  // Contacts

  async addPeer(params: IdentityAddPeerParams): Promise<PeerUserIdentity> {
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

  async addPeerByFeed(
    params: IdentityAddPeerByFeedParams,
  ): Promise<PeerUserIdentity> {
    // TODO: validate peer data
    const peerPublicRes = await this._context.io.bzz.download(params.feedHash)
    const data = await peerPublicRes.json()
    return await this.addPeer({
      key: data.publicKey,
      profile: data.profile,
      firstContactAddress: data.firstContactAddress,
      publicFeed: params.feedHash,
      otherFeeds: {},
    })
  }

  async deleteContact(params: IdentityDeleteContactParams): Promise<void> {
    this._context.openVault.identities.deleteContact(
      fromClientID(params.userID),
      fromClientID(params.contactID),
    )
    await this._context.openVault.save()
  }

  // Identities

  async createDeveloper(
    params: IdentityCreateDeveloperParams,
  ): Promise<OwnDeveloperIdentity> {
    const dev = this._context.openVault.identities.createOwnDeveloper(
      params.profile,
    )
    await this._context.openVault.save()
    return dev
  }

  async createUser(params: IdentityCreateUserParams): Promise<OwnUserIdentity> {
    const user = this._context.openVault.identities.createOwnUser(
      params.profile,
    )
    await this._context.openVault.save()

    const saveRequired = await user.publicFeed.syncManifest(
      this._context.io.bzz,
    )
    if (saveRequired) await this._context.openVault.save()
    user.publicFeed.publishJSON(this._context.io.bzz, user.publicFeedData)

    return user
  }

  // Vault

  async createVault(params: VaultParams): Promise<void> {
    await this._context.vaults.create(
      this._context.socket,
      params.path,
      Buffer.from(params.password),
    )
    await this._context.io.eth.setup()
    this._context.next({ type: 'vault_created' })
  }

  async openVault(params: VaultParams): Promise<void> {
    await this._context.vaults.open(
      this._context.socket,
      params.path,
      Buffer.from(params.password),
    )
    await this._context.io.eth.setup()
    this._context.next({ type: 'vault_opened' })
  }
}
