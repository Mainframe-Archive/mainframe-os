// @flow

import type { TXParams } from '@mainframe/eth'

import type { UserDoc } from '../db/collections/users'

export default class WalletProvider {
  _user: UserDoc

  constructor(user: UserDoc) {
    this._user = user
  }

  getAccounts(): Promise<Array<string>> {
    return Promise.resolve(this._user.getEthAccounts())
  }

  async signTransaction(params: TXParams): Promise<string> {
    return await this._user.signEthTransaction(params)
  }

  async sign(params: { address: string, data: string }): Promise<string> {
    return await this._user.signEthData(params)
  }
}
