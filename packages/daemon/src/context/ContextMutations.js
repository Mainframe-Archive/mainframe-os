// @flow

import { hexValueType } from '@erebos/hex'
import type { StrictPermissionsRequirements } from '@mainframe/app-permissions'
import type { ID } from '@mainframe/utils-id'

import type { OwnApp } from '../app'
import type {
  OwnDeveloperIdentity,
  OwnUserIdentity,
  PeerUserIdentity,
} from '../identity'
import type { OwnDeveloperProfile } from '../identity/OwnDeveloperIdentity'
import type { OwnUserProfile } from '../identity/OwnUserIdentity'
import type {
  Blockchains,
  WalletTypes,
  WalletAddLedgerResult,
} from '../wallet/WalletsRepository'
import type HDWallet from '../wallet/HDWallet'

import type ClientContext from './ClientContext'

export type FeedHash = string

export type Feeds = {
  [type: string]: FeedHash,
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

export type ImportHDWalletParams = {
  blockchain: Blockchains,
  mnemonic: string,
  firstAccountName: string,
  userID?: string,
}

export type AddHDWalletAccountParams = {
  walletID: string,
  index: number,
  name: string,
  userID?: string,
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

  async addPeerByFeed(hash: FeedHash): Promise<PeerUserIdentity> {
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

    const saveRequired = await user.publicFeed.syncManifest(
      this._context.io.bzz,
    )
    if (saveRequired) await this._context.openVault.save()
    user.publicFeed.publishJSON(this._context.io.bzz, user.publicFeedData)

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

  // Wallets

  async createHDWallet(
    blockchain: Blockchains,
    firstAccountName: string,
    userID?: string,
  ): Promise<HDWallet> {
    const { openVault } = this._context
    const wallet = openVault.wallets.createHDWallet(
      blockchain,
      firstAccountName,
    )
    if (userID) {
      openVault.identityWallets.linkWalletToIdentity(
        userID,
        wallet.localID,
        wallet.getAccounts()[0],
      )
    }
    await openVault.save()
    return wallet
  }

  async importHDWallet(params: ImportHDWalletParams): Promise<HDWallet> {
    const { openVault } = this._context
    const words = params.mnemonic.split(' ')
    if (words.length !== 12) {
      throw new Error('Seed phrase must consist of 12 words.')
    }
    const wallet = openVault.wallets.importMnemonicWallet(params)
    if (params.userID) {
      openVault.identityWallets.linkWalletToIdentity(
        params.userID,
        wallet.localID,
        wallet.getAccounts()[0],
      )
    }
    await openVault.save()
    return wallet
  }

  async addHDWalletAccount(params: AddHDWalletAccountParams): Promise<string> {
    const { openVault } = this._context
    const address = openVault.wallets.addHDWalletAccount(params)
    if (params.userID) {
      openVault.identityWallets.linkWalletToIdentity(
        params.userID,
        params.walletID,
        address,
      )
    }
    return address
  }

  async addLedgerWalletAccount(
    index: number,
    name: string,
    userID?: string,
  ): Promise<WalletAddLedgerResult> {
    const { openVault } = this._context
    const res = await openVault.wallets.addLedgerEthAccount(index, name)
    if (userID) {
      openVault.identityWallets.linkWalletToIdentity(
        userID,
        res.localID,
        res.address,
      )
    }
    await openVault.save()
    return res
  }

  async deleteWallet(blockchain: string, type: WalletTypes, localID: string) {
    const { openVault } = this._context
    openVault.wallets.deleteWallet(blockchain, type, localID)
    openVault.identityWallets.deleteWallet(localID)
    await openVault.save()
  }
}
