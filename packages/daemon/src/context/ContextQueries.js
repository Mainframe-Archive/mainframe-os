//@flow
import type { ContactResult, AppUserContact } from '@mainframe/client'
import { idType } from '@mainframe/utils-id'

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

  getAppApprovedContacts(appID: string, userID: string) {
    const { apps } = this._context.openVault
    const app = apps.getAnyByID(appID)
    if (!app) {
      throw new Error('App not found')
    }
    const contactIDs = app.listApprovedContacts(userID).map(c => c.id)
    return this.getAppUserContacts(appID, userID, contactIDs)
  }

  getAppUserContacts(
    appID: string,
    userID: string,
    contactIDs: Array<string>,
  ): Array<AppUserContact> {
    const { apps } = this._context.openVault
    const app = apps.getAnyByID(appID)
    if (!app) {
      throw new Error('App not found')
    }
    const approvedContacts = app.listApprovedContacts(userID)
    const contacts = this.getUserContacts(userID)
    return contactIDs.map(id => {
      const approvedContact = approvedContacts.find(c => c.id === id)
      const contactData: AppUserContact = {
        id,
        data: null,
      }
      if (approvedContact) {
        const contact = contacts.find(
          c => c.localID === approvedContact.localID,
        )
        if (contact) {
          contactData.data = { profile: contact.profile }
        }
      }
      return contactData
    })
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
