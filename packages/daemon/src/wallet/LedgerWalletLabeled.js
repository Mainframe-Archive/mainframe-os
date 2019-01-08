// @flow

import LedgerWallet, { type LedgerWalletParams } from './LedgerWallet'

type AccountNames = { [address: string]: string }

type LedgerWalletLabeledParams = LedgerWalletParams & {
  accountNames: AccountNames,
}

export type LedgerWalletLabeledSerialized = LedgerWalletLabeledParams

export default class LedgerWalletLabeled extends LedgerWallet {
  static fromJSON = (
    params: LedgerWalletLabeledSerialized,
  ): LedgerWalletLabeled => new LedgerWalletLabeled(params)

  // $FlowFixMe: Wallet type
  static toJSON = (
    wallet: LedgerWalletLabeled,
  ): LedgerWalletLabeledSerialized => ({
    activeAccounts: wallet._activeAccounts,
    localID: wallet._localID,
    firstAddress: wallet._firstAddress,
    accountNames: wallet._accountNames,
  })

  _accountNames: AccountNames

  constructor(params?: LedgerWalletLabeledParams) {
    super(params)
    this._accountNames = params ? params.accountNames : {}
  }

  get accountNames(): AccountNames {
    return this._accountNames
  }

  getNamedAccounts(): Array<{ address: string, name: string }> {
    return this.getAccounts().map(a => ({
      address: a,
      name: this.accountNames[a],
    }))
  }

  async addAccount(index: number, name: string): Promise<string> {
    const res = await this.addAccounts([index])
    this.accountNames[res[0]] = name
    return res[0]
  }
}
