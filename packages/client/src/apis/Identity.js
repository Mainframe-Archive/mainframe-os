// @flow

import ClientAPIs from '../ClientAPIs'
import type {
  IdentityCreateDeveloperParams,
  IdentityCreateUserParams,
  IdentityCreateResult,
  IdentityGetOwnDevelopersResult,
  IdentityGetOwnUsersResult,
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
