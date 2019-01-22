//@flow
import { type ContactResult } from '@mainframe/client'
import { idType } from '@mainframe/utils-id'

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
