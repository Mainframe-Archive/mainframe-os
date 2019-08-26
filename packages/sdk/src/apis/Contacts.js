// @flow

import ClientAPIs from '../ClientAPIs'
import type { ContactID, Contact } from '../types'

export default class ContactsAPIs extends ClientAPIs {
  async selectContacts(options?: {
    withWallet?: boolean,
  }): Promise<Array<Contact>> {
    return this._rpc.request('contacts_select', { multi: true, options })
  }

  async selectContact(options?: { withWallet?: boolean }): Promise<?Contact> {
    const contacts = await this._rpc.request('contacts_select', { options })
    if (contacts && contacts.length) {
      return contacts[0]
    }
    return null
  }

  async getDataForContacts(
    contactIDs: Array<ContactID>,
  ): Promise<Array<Contact>> {
    return this._rpc.request('contacts_getData', { contactIDs })
  }

  async getDataForContact(contactID: ?ContactID): Promise<?Contact> {
    const contacts = await this._rpc.request('contacts_getData', {
      contactIDs: [contactID],
    })
    if (contacts && contacts.length) {
      return contacts[0]
    }
    return null
  }

  async getApprovedContacts(): Promise<Array<Contact>> {
    return this._rpc.request('contacts_getApproved')
  }
}
