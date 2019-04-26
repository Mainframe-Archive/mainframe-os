// @flow

import ClientAPIs from '../ClientAPIs'
import type {
  ContactsGetUserContactsParams,
  ContactsGetAppUserContactsParams,
  ContactsGetAppUserContactsResult,
  ContactsGetAppApprovedContactsParams,
  ContactsApproveContactsForAppParams,
  ContactsApproveContactsForAppResult,
  ContactsGetUserContactsResult,
} from '../types'

export default class ContactAPIs extends ClientAPIs {
  getUserContacts(
    params: ContactsGetUserContactsParams,
  ): Promise<ContactsGetUserContactsResult> {
    return this._rpc.request('contact_getUserContacts', params)
  }

  getAppUserContacts(
    params: ContactsGetAppUserContactsParams,
  ): Promise<ContactsGetAppUserContactsResult> {
    return this._rpc.request('contact_getAppUserContacts', params)
  }

  getAppApprovedContacts(
    params: ContactsGetAppApprovedContactsParams,
  ): Promise<ContactsGetAppUserContactsResult> {
    return this._rpc.request('contact_getAppApprovedContacts', params)
  }

  approveContactsForApp(
    params: ContactsApproveContactsForAppParams,
  ): Promise<ContactsApproveContactsForAppResult> {
    return this._rpc.request('contact_approveContacts', params)
  }
}
