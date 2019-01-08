// @flow
import { uniqueID } from '@mainframe/utils-id'

import HDWallet, { generateWalletParams, type HDWalletParams } from './HDWallet'

type AccountNames = { [address: string]: string }

export type HDWalletLabeledParams = HDWalletParams & {
  accountNames?: AccountNames,
}

type HDLabeledImportParams = {
  mnemonic: string,
  firstAccountName: string,
}

export type HDWalletLabeledSerialized = HDWalletLabeledParams

export default class HDWalletLabeled extends HDWallet {
  static create = (firstAccountName: string): HDWalletLabeled => {
    const params = generateWalletParams()
    const wallet = new HDWalletLabeled(params)
    const fisrAcc = wallet.getAccounts()[0]
    wallet.accountNames[fisrAcc] = firstAccountName
    return wallet
  }

  static import = (params: HDLabeledImportParams): HDWalletLabeled => {
    const wallet = new HDWalletLabeled({
      ...params,
      localID: uniqueID(),
      activeAccounts: ['0'],
    })
    const fisrAcc = wallet.getAccounts()[0]
    wallet.accountNames[fisrAcc] = params.firstAccountName
    return wallet
  }

  static fromJSON = (params: HDWalletLabeledSerialized): HDWalletLabeled =>
    new HDWalletLabeled(params)

  static toJSON = (wallet: HDWalletLabeled): HDWalletLabeledSerialized => ({
    mnemonic: wallet._mnemonic,
    localID: wallet._localID,
    activeAccounts: Object.keys(wallet._wallets),
    accountNames: wallet.accountNames,
  })

  _accountNames: AccountNames = {}

  constructor(params: HDWalletLabeledParams) {
    super(params)
    this._accountNames = params.accountNames || {}
  }

  get accountNames() {
    return this._accountNames
  }

  getNamedAccounts(): Array<{ address: string, name: string }> {
    return this.getAccounts().map(a => ({
      address: a,
      name: this.accountNames[a],
    }))
  }

  addAccount(index: number, name: string): string {
    const res = this.addAccounts([index])
    this.accountNames[res[0]] = name
    return res[0]
  }
}
