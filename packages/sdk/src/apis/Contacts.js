// @flow

import ClientAPIs from '../ClientAPIs'

type ContactID = string

export default class ContactsAPIs extends ClientAPIs {
  async selectContacts(params: { multi: boolean }) {
    return this.rpc.request('contacts_select', params)
  }

  async getDataForContacts(contactIDs: Array<ContactID>) {
    return this.rpc.request('contacts_getData', { contactIDs })
  }

  async getApprovedContacts() {
    return this.rpc.request('contacts_getApproved')
  }
}
