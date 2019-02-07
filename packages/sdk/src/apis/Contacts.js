// @flow

import ClientAPIs from '../ClientAPIs'
import type { ContactID, Contact } from '../types'

export default class ContactsAPIs extends ClientAPIs {
  async selectContacts(): Promise<Array<Contact>> {
    return this._rpc.request('contacts_select', { multi: true })
  }

  async selectContact(): Promise<?Contact> {
    const contacts = await this._rpc.request('contacts_select', {})
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
