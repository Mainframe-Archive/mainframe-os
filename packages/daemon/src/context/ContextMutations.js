// @flow

import { hexValueType } from '@erebos/hex'
import {
  createSignedManifest,
  isValidSemver,
  type ManifestData,
} from '@mainframe/app-manifest'
import {
  type StrictPermissionsRequirements,
  type PermissionsRequirements,
} from '@mainframe/app-permissions'
import type {
  AppUserContact,
  AppUserPermissionsSettings,
} from '@mainframe/client'
import { idType, type ID } from '@mainframe/utils-id'
import { ensureDir } from 'fs-extra'

import { type App, OwnApp } from '../app'
import type { ContactToApprove } from '../app/AbstractApp'
import {
  getContentsPath,
  type UpdateAppDetailsParams,
} from '../app/AppsRepository'
import type {
  Contact,
  OwnDeveloperIdentity,
  OwnUserIdentity,
  PeerUserIdentity,
} from '../identity'
import type { OwnDeveloperProfile } from '../identity/OwnDeveloperIdentity'
import type { OwnUserProfile } from '../identity/OwnUserIdentity'
import type { PeerUserProfile } from '../identity/PeerUserIdentity'
import type { ContactProfile, ContactAppsPayload } from '../identity/Contact'
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

export type InstallAppParams = {
  manifest: ManifestData,
  userID: ID,
  permissionsSettings: AppUserPermissionsSettings,
}

export type CreateAppParams = {
  contentsPath: string,
  developerID: ID,
  name?: ?string,
  version?: ?string,
  permissionsRequirements?: ?StrictPermissionsRequirements,
}

export type PublishAppParams = {
  appID: ID,
  version?: ?string,
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

  async installApp(params: InstallAppParams): Promise<App> {
    const { env, io, openVault } = this._context

    const app = openVault.installApp(
      params.manifest,
      params.userID,
      params.permissionsSettings,
    )

    if (app.installationState !== 'ready') {
      const contentsPath = getContentsPath(env, params.manifest)
      try {
        app.installationState = 'downloading'
        await ensureDir(contentsPath)
        await io.bzz.downloadDirectoryTo(
          app.manifest.contentsHash,
          contentsPath,
        )
        app.installationState = 'ready'
      } catch (err) {
        app.installationState = 'download_error'
      }
    }

    this._context.next({ type: 'app_installed', app, userID: params.userID })
    return app
  }

  async createApp(params: CreateAppParams): Promise<OwnApp> {
    const { openVault, io } = this._context

    const appIdentity = openVault.identities.getOwnApp(
      openVault.identities.createOwnApp(),
    )
    if (appIdentity == null) {
      throw new Error('Failed to create app identity')
    }

    const devIdentity = openVault.identities.getOwnDeveloper(params.developerID)
    if (devIdentity == null) {
      throw new Error('Developer identity not found')
    }

    const app = openVault.apps.create({
      contentsPath: params.contentsPath,
      developerID: params.developerID,
      mfid: appIdentity.id,
      name: params.name || 'Untitled',
      permissions: params.permissionsRequirements,
      version:
        params.version == null || !isValidSemver(params.version)
          ? '1.0.0'
          : params.version,
    })
    // Do this here so app shared data can be referenced by update hash
    await app.updateFeed.syncManifest(io.bzz)

    this._context.next({ type: 'app_created', app })
    return app
  }

  async updateAppDetails(params: UpdateAppDetailsParams): Promise<void> {
    const { openVault } = this._context
    openVault.apps.updateAppDetails(params)
    await openVault.save()
  }

  async publishApp(params: PublishAppParams): Promise<string> {
    const { io, openVault } = this._context

    const app = openVault.apps.getOwnByID(params.appID)
    if (app == null) {
      throw new Error('App not found')
    }
    const appIdentityID = openVault.identities.getID(app.mfid)
    if (appIdentityID == null) {
      throw new Error('App identity not found')
    }
    const appIdentity = openVault.identities.getOwnApp(appIdentityID)
    if (appIdentity == null) {
      throw new Error('App identity not found')
    }
    const devIdentity = openVault.identities.getOwnDeveloper(
      app.data.developerID,
    )
    if (devIdentity == null) {
      throw new Error('Developer identity not found')
    }

    const versionData = app.getVersionData(params.version)
    if (versionData == null) {
      throw new Error('Invalid app version')
    }

    if (versionData.versionHash != null) {
      throw new Error('Manifest has already been published for this version')
    }

    if (versionData.contentsHash == null) {
      const hash = await io.bzz.uploadDirectoryFrom(app.contentsPath)
      app.setContentsHash(hash, params.version)
    }
    await app.updateFeed.syncManifest(io.bzz)

    const manifestData = {
      id: app.mfid,
      author: {
        id: devIdentity.id,
        name: devIdentity.profile.name,
      },
      name: app.data.name,
      version: app.data.version,
      contentsHash: versionData.contentsHash,
      updateHash: app.updateFeed.feedHash,
      permissions: versionData.permissions,
    }
    // Sanity checks
    if (manifestData.contentsHash == null) {
      throw new Error('Missing contents hash')
    }
    if (manifestData.updateHash == null) {
      throw new Error('Missing update hash')
    }

    // $FlowFixMe: doesn't seem to detect sanity checks for hashes
    const signedManifest = createSignedManifest(manifestData, [
      appIdentity.keyPair,
      devIdentity.keyPair,
    ])
    const versionHash = await app.updateFeed.publishJSON(io.bzz, signedManifest)
    app.setVersionHash(versionHash, params.version)

    this._context.next({ type: 'app_changed', app, change: 'versionPublished' })
    // $FlowFixMe: weird issue with return type not detected as Promise
    return manifestData.updateHash
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
    const contactsIDs = Object.keys(approvedContacts)
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

  async setAppPermissionsRequirements(
    appID: string,
    permissionRequirements: PermissionsRequirements,
  ): Promise<void> {
    const { openVault } = this._context
    const app = openVault.apps.getOwnByID(idType(appID))
    if (!app) {
      throw new Error('App not found')
    }
    app.setPermissionsRequirements(permissionRequirements)
    await openVault.save()
  }

  // Comms

  async publishAppData(
    appID: ID,
    contactID: ID | string,
    key: string,
    value: Object,
  ): Promise<void> {
    const { openVault, io } = this._context
    const res = openVault.identities.getContactByID(contactID)
    if (!res) {
      throw new Error('Contact not found')
    }
    const { userID, contact } = res

    const app = openVault.apps.getByID(appID)
    if (!app) {
      throw new Error('App not found')
    }
    const sharedAppID = app.updateFeedHash
    if (!sharedAppID) {
      throw new Error('updateFeedHash missing for app')
    }

    const existingSharedData = openVault.contactAppData.getSharedData(
      sharedAppID,
      contactID,
    )
    const sharedData = existingSharedData
      ? existingSharedData
      : openVault.contactAppData.createSharedData(sharedAppID, contactID)

    const existingAppFeed = sharedData.getAppFeed(key)
    const appFeed = existingAppFeed
      ? existingAppFeed
      : sharedData.createAppFeed('json', key)

    if (appFeed.type !== 'json') {
      throw new Error(`Incorrect feed type '${appFeed.type}' expected 'json'`)
    }

    await appFeed.feed.publishJSON(io.bzz, value)

    if (!existingAppFeed) {
      await appFeed.feed.syncManifest(io.bzz)
      await sharedData.publish(io.bzz)
      this._context.next({
        type: 'app_data_changed',
        sharedData,
        appID,
        contactID,
      })
    }

    if (!existingSharedData || sharedData.feedHash == null) {
      await sharedData.syncManifest(io.bzz)
      const { apps } = contact.sharedFeed.localFeedData
      apps[sharedAppID] = sharedData.feedHash
      await contact.sharedFeed.publishLocalData(io.bzz)
      this._context.next({
        type: 'contact_changed',
        contact,
        userID,
        change: 'localFeed',
      })
    }
  }

  updateContactApps(
    userID: ID | string,
    contactID: ID | string,
    apps: ContactAppsPayload,
  ) {
    const { openVault } = this._context
    Object.keys(apps).forEach(sharedAppID => {
      const app = openVault.apps
        .getAppsForUser(idType(userID))
        .find((a: App) => a.updateFeedHash === sharedAppID)
      if (!app) return

      const existingSharedData = openVault.contactAppData.getSharedData(
        sharedAppID,
        contactID,
      )
      const sharedData = existingSharedData
        ? existingSharedData
        : openVault.contactAppData.createSharedData(sharedAppID, contactID, {
            remoteFeed: apps[sharedAppID],
          })
      let changed = false
      if (!existingSharedData) {
        changed = true
      } else if (sharedData.remoteFeed !== apps[sharedAppID]) {
        sharedData.remoteFeed = apps[sharedAppID]
        changed = true
      }

      if (changed) {
        this._context.next({
          type: 'app_data_changed',
          sharedData,
          appID: app.id,
          contactID,
        })
      }
    })
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

    contact.sharedFeed.remoteFeed = feed
    this._context.next({
      type: 'contact_changed',
      contact,
      userID,
      change: 'remoteFeed',
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

  async createUser(
    profile: OwnUserProfile,
    privateProfile?: boolean,
  ): Promise<OwnUserIdentity> {
    const user = this._context.openVault.identities.createOwnUser(
      profile,
      privateProfile,
    )
    await this._context.openVault.save()
    this._context.next({ type: 'user_created', user })
    return user
  }

  async updateUser(
    userID: ID,
    profile: $Shape<OwnUserProfile>,
    privateProfile?: boolean,
  ): Promise<void> {
    const user = this._context.openVault.identities.getOwnUser(userID)
    if (!user) throw new Error('User not found')

    user.profile = { ...user.profile, ...profile }
    if (privateProfile != null && user.privateProfile !== privateProfile) {
      user.privateProfile = privateProfile
    }
    this._context.next({ type: 'user_changed', change: 'profile', user })
  }

  async setUserProfileVisibility(
    userID: string,
    visibile: boolean,
  ): Promise<void> {
    const user = this._context.openVault.identities.getOwnUser(userID)
    if (!user) throw new Error('User not found')
    if (user.privateProfile !== visibile) {
      user.privateProfile = visibile
      this._context.next({ type: 'user_changed', change: 'profile', user })
    }
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

  async setEthNetwork(url: string): Promise<void> {
    const { openVault, io } = this._context
    openVault.setEthUrl(url)
    io.eth.ethHttpUrl = url
    await openVault.save()
  }
}
