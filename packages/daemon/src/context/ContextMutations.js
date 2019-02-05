// @flow

import { hexValueType } from '@erebos/hex'
import type { StrictPermissionsRequirements } from '@mainframe/app-permissions'
import { idType, type ID } from '@mainframe/utils-id'
import type { AppUserContact } from '@mainframe/client'

import type { OwnApp } from '../app'
import type { ContactToApprove } from '../app/AbstractApp'
import type {
  Contact,
  OwnDeveloperIdentity,
  OwnUserIdentity,
  PeerUserIdentity,
} from '../identity'
import type { OwnDeveloperProfile } from '../identity/OwnDeveloperIdentity'
import type { OwnUserProfile } from '../identity/OwnUserIdentity'
import type { PeerUserProfile } from '../identity/PeerUserIdentity'
import type { ContactProfile } from '../identity/Contact'
import type { bzzHash } from '../swarm/feed'

import type {
  AddHDWalletAccountParams,
  ImportHDWalletParams,
  Blockchains,
  WalletTypes,
  WalletAddLedgerResult,
} from '../wallet/WalletsRepository'
import type HDWallet from '../wallet/HDWallet'

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
    ethAddress?: ?string,
  },
  publicFeed: string,
  firstContactAddress: string,
  otherFeeds: Feeds,
}

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
    this._context.next({ type: 'app_created', app })
    return app
  }

  async appApproveContacts(
    appID: string,
    userID: string,
    contactsToApprove: Array<ContactToApprove>,
  ): Promise<Array<AppUserContact>> {
    const { openVault } = this._context
    const approvedContacts = openVault.apps.approveContacts(
      appID,
      userID,
      contactsToApprove,
    )
    // $FlowFixMe map type
    const contactsIDs = Object.values(approvedContacts).map(c => c.id)
    const contacts = this._context.queries.getAppUserContacts(
      appID,
      userID,
      contactsIDs,
    )
    await openVault.save()
    return contacts
  }

  async setAppUserDefaultWallet(
    appID: string,
    userID: string,
    address: string,
  ) {
    const { openVault, queries } = this._context
    const app = openVault.apps.getAnyByID(appID)
    if (!app) {
      throw new Error('App not found')
    }
    const wallet = queries.getUserEthWalletForAccount(userID, address)
    if (!wallet) {
      throw new Error('Wallet not found')
    }
    app.setDefaultEthAccount(idType(userID), idType(wallet.localID), address)
    await openVault.save()
  }

  async publishContents(appID: string, version: string): Promise<string> {
    const { openVault } = this._context
    const app = openVault.apps.getOwnByID(idType(appID))
    if (app == null) {
      throw new Error('App not found')
    }

    const hash = await this._context.io.bzz.uploadDirectoryFrom(
      app.contentsPath,
    )
    const contentsURI = `urn:bzz:${hash}`
    app.setContentsURI(contentsURI, version)
    await openVault.save()

    return contentsURI
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

  createContactFromPeer(userID: ID, peerID: ID, aliasName?: string): Contact {
    const contact = this._context.openVault.identities.createContactFromPeer(
      userID,
      peerID,
      aliasName,
    )
    this._context.next({ type: 'contact_created', contact, userID })
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

  updatePeerProfile(peerID: string, profile: PeerUserProfile) {
    const peer = this._context.openVault.identities.getPeerUser(peerID)
    if (peer == null) {
      throw new Error('Peer not found')
    }
    peer.profile = profile
    this._context.next({ type: 'peer_changed', peer })
  }

  setContactFeed(userID: ID | string, contactID: ID | string, feed: bzzHash) {
    const contact = this._context.openVault.identities.getContact(
      userID,
      contactID,
    )
    if (!contact) throw new Error('User not found')

    contact.contactFeed = feed
    this._context.next({
      type: 'contact_changed',
      contact,
      userID,
      change: 'contactFeed',
    })
  }

  updateContactProfile(
    userID: ID | string,
    contactID: ID | string,
    profile: ContactProfile,
  ) {
    const contact = this._context.openVault.identities.getContact(
      userID,
      contactID,
    )
    if (contact == null) {
      throw new Error('Peer not found')
    }
    contact.profile = profile
    this._context.next({
      type: 'contact_changed',
      contact,
      userID,
      change: 'profile',
    })
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
    this._context.next({ type: 'user_created', user })
    return user
  }

  async updateUser(userID: ID, profile: $Shape<OwnUserProfile>): Promise<void> {
    const user = this._context.openVault.identities.getOwnUser(userID)
    if (!user) throw new Error('User not found')

    user.profile = { ...user.profile, ...profile }
    await this._context.openVault.save()
    await user.publicFeed.publishJSON(
      this._context.io.bzz,
      user.publicFeedData(),
    )
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
    name: string,
    userID?: string,
  ): Promise<HDWallet> {
    const { openVault } = this._context
    const wallet = openVault.wallets.createHDWallet(blockchain, name)
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

  async addLedgerWalletAccounts(
    indexes: Array<number>,
    name: string,
    userID?: string,
  ): Promise<WalletAddLedgerResult> {
    const { openVault } = this._context
    const res = await openVault.wallets.addLedgerEthAccounts(indexes, name)
    if (userID) {
      res.addresses.forEach(a => {
        // $FlowFixMe userID already checked
        openVault.identityWallets.linkWalletToIdentity(userID, res.localID, a)
      })
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

  async setUsersDefaultWallet(userID: string, address: string): Promise<void> {
    const { openVault } = this._context
    const wallet = openVault.wallets.getEthWalletByAccount(address)
    if (!wallet) {
      throw new Error(`Could not find a wallet containing account: ${address}`)
    }
    openVault.identityWallets.setDefaultEthWallet(
      userID,
      wallet.localID,
      address,
    )
    await openVault.save()
  }
}
