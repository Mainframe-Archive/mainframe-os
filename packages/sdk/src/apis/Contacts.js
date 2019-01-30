// @flow

import ClientAPIs from '../ClientAPIs'

type ContactID = string

export default class ContactsAPIs extends ClientAPIs {
  async selectContacts() {
    return this._rpc.request('contacts_select', { multi: true })
  }

  async selectContact() {
    const res = await this._rpc.request('contacts_select', {})
    if (res.contacts && res.contacts.length) {
      return res.contacts[0]
    }
    return null
  }

  async getDataForContacts(contactIDs: Array<ContactID>) {
    return this._rpc.request('contacts_getData', { contactIDs })
  }

  async getDataForContact(contactID: ?ContactID) {
    const res = this._rpc.request('contacts_getData', {
      contactIDs: [contactID],
    })
    if (res.contacts && res.contacts.length) {
      return res.contacts[0]
    }
    return null
  }

  async getApprovedContacts() {
    return this._rpc.request('contacts_getApproved')
  }
}
