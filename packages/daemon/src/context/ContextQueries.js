//@flow

import { type PartialManifestData } from '@mainframe/app-manifest'
import { type ContactResult } from '@mainframe/client'
import { idType, type ID } from '@mainframe/utils-id'

import type ClientContext from './ClientContext'

export type Wallet = {
  localID: string,
  type: 'ledger' | 'hd',
  accounts: Array<{
    name: string,
    address: string,
  }>,
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
          const profile = { ...peer.profile, ...contact.profile }
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
              type: wallet.type,
              accounts: wallet.getNamedAccounts(),
            })
          }
          return acc
        },
        [],
      )
    }
    return []
  }

  getUserEthAccounts(userID: string) {
    return this.getUserEthWallets(userID).reduce((acc, w) => {
      // $FlowFixMe concat types
      return acc.concat(w.accounts.map(a => a.address))
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
      const addr = wallets[0].accounts[0].address
      this._context.mutations.setUsersDefaultWallet(userID, addr)
      return addr
    }
  }
}
