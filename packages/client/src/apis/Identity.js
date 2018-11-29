// @flow

import ClientAPIs from '../ClientAPIs'
import type {
  IdentityAddPeerByFeedParams,
  IdentityAddPeerParams,
  IdentityAddPeerResult,
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
