import ClientAPIs from '../ClientAPIs'

export default class ContactsAPIs extends ClientAPIs {
  getContacts() {
    const rpc = this._rpc
    const contacts = rpc.request('contacts_getContacts')
    return contacts
  }
}
