// @flow

import ClientAPIs from '../ClientAPIs'
import type {
  IdentityAddPeerByKeyParams,
  IdentityAddPeerByKeyResult,
  IdentityCreateDeveloperParams,
  IdentityCreateUserParams,
  IdentityCreateResult,
  IdentityGetOwnDevelopersResult,
  IdentityGetOwnUsersResult,
  IdentityGetPeersResult,
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

  addPeerByKey(
    params: IdentityAddPeerByKeyParams,
  ): Promise<IdentityAddPeerByKeyResult> {
    return this._rpc.request('identity_addPeerByKey', params)
  }

  getOwnDevelopers(): Promise<IdentityGetOwnDevelopersResult> {
    return this._rpc.request('identity_getOwnDevelopers')
  }

  getOwnUsers(): Promise<IdentityGetOwnUsersResult> {
    return this._rpc.request('identity_getOwnUsers')
  }

  getPeers(): Promise<IdentityGetPeersResult> {
    return this._rpc.request('identity_getPeers')
  }

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
