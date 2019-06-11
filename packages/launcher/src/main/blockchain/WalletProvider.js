// @flow

import type { UserDoc } from '../db/collections/users'

export default class WalletProvider {
  _user: UserDoc

  constructor(user: UserDoc) {
    this._user = user
  }

  getAccounts(): Promise<Array<string>> {
    return Promise.resolve(this._user.getEthAccounts())
  }

  signTransaction(params: Object) {
    const eth = this._user.getEth()
    return this._user.signEthTransaction(params, eth.networkID)
  }

  sign(params: Object) {
    return this._user.signEthData(params)
  }
}
