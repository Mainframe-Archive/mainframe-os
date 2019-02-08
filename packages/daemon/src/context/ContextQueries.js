//@flow

import { type PartialManifestData } from '@mainframe/app-manifest'
import type { ContactResult, AppUserContact } from '@mainframe/client'
import { idType, type ID } from '@mainframe/utils-id'

import { fetchJSON } from '../swarm/feed'
import type {
  AppFeedsPayload,
  SharedAppDataPayload,
} from '../contact/SharedAppData'
import type ClientContext from './ClientContext'

export type Wallet = {
  localID: string,
  name: ?string,
  type: string,
  accounts: Array<string>,
}

export default class ContextQueries {
  _context: ClientContext

  constructor(context: ClientContext) {
    this._context = context
  }

  // Apps

  getAppManifestData(appID: ID, version?: ?string): PartialManifestData {
    const { openVault } = this._context

    const app = openVault.apps.getOwnByID(appID)
    if (app == null) {
      throw new Error('App not found')
    }
    const devIdentity = openVault.identities.getOwnDeveloper(
      app.data.developerID,
    )
    if (devIdentity == null) {
      throw new Error('Developer identity not found')
    }
    const versionData = app.getVersionData(version)
    if (versionData == null) {
      throw new Error('Invalid app version')
    }

    return {
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
  }

  // Contacts

  getUserContacts(userID: string): Array<ContactResult> {
    const { identities } = this._context.openVault
    const result = []
    const contacts = identities.getContactsForUser(userID)
    if (contacts) {
      Object.keys(contacts).forEach(id => {
        const contact = contacts[id]
        const peer = identities.getPeerUser(idType(contact.peerID))
        if (peer) {
          const contactProfile = identities.getContactProfile(contact.localID)
          const profile = { ...peer.profile, ...contactProfile }
          const contactRes = {
            profile,
            localID: id,
            peerID: contact.peerID,
            connectionState: contact.connectionState,
          }
          result.push(contactRes)
        }
      })
    }
    return result
  }

  getAppApprovedContacts(appID: string, userID: string) {
    const { apps } = this._context.openVault
    const app = apps.getAnyByID(appID)
    if (!app) {
      throw new Error('App not found')
    }
    const contactIDs = Object.keys(app.getApprovedContacts(userID))
    return this.getAppUserContacts(appID, userID, contactIDs)
  }

  getAppUserContacts(
    appID: string,
    userID: string,
    contactIDs: Array<string>,
  ): Array<AppUserContact> {
    const { apps, identities } = this._context.openVault
    const app = apps.getAnyByID(appID)
    if (!app) {
      throw new Error('App not found')
    }
    const approvedContacts = app.getApprovedContacts(userID)
    const contacts = this.getUserContacts(userID)
    return contactIDs.map(id => {
      const approvedContact = approvedContacts[id]
      const contactData: AppUserContact = {
        id,
        data: null,
      }
      if (approvedContact) {
        const contact = contacts.find(
          c => c.localID === approvedContact.localID,
        )
        if (contact) {
          contactData.data = {
            profile: identities.getContactProfile(contact.localID),
          }
        }
      }
      return contactData
    })
  }

  async getContactAppFeeds(appID: ID, contactID: ID | string): AppFeedsPayload {
    const { openVault, io } = this._context

    const app = openVault.apps.getByID(appID)
    if (!app) {
      throw new Error('App not found')
    }
    const sharedAppID = app.updateFeedHash

    const sharedData = openVault.contactAppData.getSharedData(
      sharedAppID,
      contactID,
    )
    if (!sharedData || !sharedData.remoteFeed) {
      return {}
    }

    const remoteData = (await fetchJSON(
      io.bzz,
      sharedData.remoteFeed,
    ): SharedAppDataPayload)
    // TODO: validate payload version
    return remoteData.feeds || {}
  }

  getContactLocalIDByAppApprovedID(
    appID: string,
    userID: string,
    contactID: string,
  ): ?string {
    const app = this._context.openVault.apps.getByID(appID)
    if (!app) {
      throw new Error('App not found')
    }

    return app.getLocalIDByApprovedID(userID, contactID)
  }

  // Wallets

  getUserEthWallets(id: string): Array<Wallet> {
    const { identityWallets, wallets } = this._context.openVault
    if (identityWallets.walletsByIdentity[id]) {
      return Object.keys(identityWallets.walletsByIdentity[id]).reduce(
        (acc, wid) => {
          const wallet = wallets.getEthWalletByID(wid)
          if (wallet) {
            acc.push({
              localID: wallet.localID,
              name: wallet.name,
              type: wallet.type,
              accounts: wallet.getAccounts(),
            })
          }
          return acc
        },
        [],
      )
    }
    return []
  }

  getUserEthWalletForAccount(userID: string, address: string): ?Wallet {
    const wallets = this.getUserEthWallets(userID)
    return wallets.find(w => w.accounts.includes(address))
  }

  getUserEthAccounts(userID: string) {
    return this.getUserEthWallets(userID).reduce((acc, w) => {
      // $FlowFixMe concat types
      return acc.concat(w.accounts)
    }, [])
  }

  getUserDefaultEthAccount(userID: string): ?string {
    const { identityWallets } = this._context.openVault
    const defaultAcc = identityWallets.getDefaultEthWallet(userID)
    if (defaultAcc) {
      return defaultAcc
    }
    // Use first account if no default
    const wallets = this.getUserEthWallets(userID)
    if (wallets.length && wallets[0].accounts.length) {
      const addr = wallets[0].accounts[0]
      this._context.mutations.setUsersDefaultWallet(userID, addr)
      return addr
    }
  }
}
