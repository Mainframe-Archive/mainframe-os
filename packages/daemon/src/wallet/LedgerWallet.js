// @flow

import AbstractWallet, { type AbstractWalletParams } from './AbstractWallet'

type AccountAddress = string

type LedgerWalletParams = AbstractWalletParams & {
  activeAccounts: { [index: string]: AccountAddress },
}

export type LedgerWalletSerialized = LedgerWalletParams

export default class LedgerWallet extends AbstractWallet {
  static fromJSON = (params: LedgerWalletSerialized): LedgerWallet =>
    new LedgerWallet(params)

  // $FlowFixMe: Wallet type
  static toJSON = (hdWallet: HDWallet): HDWalletSerialized => ({
    activeAccounts: Object.keys(hdWallet._activeAccounts),
  })

  _activeAccounts: { [index: string]: AccountAddress }
  _root: Object
  _hdPath: string

  constructor(params?: LedgerWalletParams) {
    super()
    this._activeAccounts = params ? params.activeAccounts : {}
  }

  // Public

  getAccounts(): Array<string> {
    // $FlowFixMe mixed values are actually strings
    return Object.values(this._activeAccounts)
  }

  addAccounts(indexes: Array<number>): Array<string> {
    return [String(indexes)]
    // TODO
    // const newWallets = []
    // indexes.forEach(i => {
    //   const child = this._root.deriveChild(i)
    //   const wallet = child.getWallet()
    //   newWallets.push(wallet)
    //   this._wallets[String(i)] = wallet
    // })
    // const hexWallets = newWallets.map(w => {
    //   return sigUtil.normalize(w.getAddress().toString('hex'))
    // })
    // return hexWallets
  }
}
