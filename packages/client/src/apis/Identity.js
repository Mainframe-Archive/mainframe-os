// @flow

import ClientAPIs from '../ClientAPIs'
import type {
  IdentityAddPeerByFeedParams,
  IdentityAddPeerParams,
  IdentityAddPeerResult,
  IdentityCreateContactFromFeedParams,
  IdentityCreateContactFromPeerParams,
  IdentityCreateContactResult,
  IdentityCreateDeveloperParams,
  IdentityCreateUserParams,
  IdentityCreateResult,
  IdentityDeleteContactParams,
  IdentityGetOwnDevelopersResult,
  IdentityGetOwnUsersResult,
  IdentityGetPeersResult,
  IdentityGetUserContactsParams,
  IdentityGetUserContactsResult,
  IdentityLinkEthWalletAccountParams,
  IdentityUnlinkEthWalletAccountParams,
  IdentityUpdateUserParams,
} from '../types'

export default class IdentityAPIs extends ClientAPIs {
  createDeveloper(
    params: IdentityCreateDeveloperParams,
  ): Promise<IdentityCreateResult> {
    return this._rpc.request('identity_createDeveloper', params)
  }

  createUser(params: IdentityCreateUserParams): Promise<IdentityCreateResult> {
    return this._rpc.request('identity_createUser', params)
  }

  getOwnDevelopers(): Promise<IdentityGetOwnDevelopersResult> {
    return this._rpc.request('identity_getOwnDevelopers')
  }

  getOwnUsers(): Promise<IdentityGetOwnUsersResult> {
    return this._rpc.request('identity_getOwnUsers')
  }

  updateUser(params: IdentityUpdateUserParams): Promise<void> {
    return this._rpc.request('identity_updateUser', params)
  }

  // Contacts

  addPeer(params: IdentityAddPeerParams): Promise<IdentityAddPeerResult> {
    return this._rpc.request('identity_addPeer', params)
  }

  addPeerByFeed(
    params: IdentityAddPeerByFeedParams,
  ): Promise<IdentityAddPeerResult> {
    return this._rpc.request('identity_addPeerByFeed', params)
  }

  getPeers(): Promise<IdentityGetPeersResult> {
    return this._rpc.request('identity_getPeers')
  }

  createContactFromPeer(
    params: IdentityCreateContactFromPeerParams,
  ): Promise<IdentityCreateContactResult> {
    return this._rpc.request('identity_createContactFromPeer', params)
  }

  createContactFromFeed(
    params: IdentityCreateContactFromFeedParams,
  ): Promise<IdentityCreateContactResult> {
    return this._rpc.request('identity_createContactFromFeed', params)
  }

  deleteContact(params: IdentityDeleteContactParams): Promise<void> {
    return this._rpc.request('identity_deleteContact', params)
  }

  getUserContacts(
    params: IdentityGetUserContactsParams,
  ): Promise<IdentityGetUserContactsResult> {
    return this._rpc.request('identity_getUserContacts', params)
  }

  // Wallets

  linkEthWalletAccount(
    params: IdentityLinkEthWalletAccountParams,
  ): Promise<void> {
    return this._rpc.request('identity_linkEthWallet', params)
  }

  unlinkEthWalletAccount(
    params: IdentityUnlinkEthWalletAccountParams,
  ): Promise<void> {
    return this._rpc.request('identity_unlinkEthWallet', params)
  }
}
