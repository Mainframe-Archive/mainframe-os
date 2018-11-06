// @flow

import EthWallet from 'ethereumjs-wallet'
import { stripHexPrefix } from 'ethereumjs-util'

import AbstractSoftwareWallet, {
  type AbstractWalletParams,
} from './AbstractSoftwareWallet'

type PKWalletParams = AbstractWalletParams & {
  privateKeys: Array<string>,
}

export type PKWalletSerialized = PKWalletParams

export default class PKWallet extends AbstractSoftwareWallet {
  static fromJSON = (params: PKWalletSerialized): PKWallet =>
    new PKWallet(params)

  // $FlowFixMe: Wallet type
  static toJSON = (pkWallet: PKWallet): PKWalletSerialized => ({
    walletID: pkWallet._walletID,
    privateKeys: Object.keys(pkWallet._wallets).map(k => {
      return pkWallet._wallets[Number(k)].getPrivateKey().toString('hex')
    }),
  })

  constructor(params?: PKWalletParams) {
    super()
    if (params) {
      this._walletID = params.walletID
      this._wallets = params.privateKeys.reduce((acc, pk) => {
        const wallet = this._getWalletFromPrivateKey(pk)
        const address = wallet.getAddress()
        if (!acc[address]) {
          acc[address] = wallet
        }
        return acc
      }, {})
    } else {
      this._wallets = {}
    }
  }

  // Internal

  _getWalletFromPrivateKey(privateKey: string): EthWallet {
    const strippedKey = stripHexPrefix(privateKey)
    const buffer = new Buffer(strippedKey, 'hex')
    return EthWallet.fromPrivateKey(buffer)
  }

  // Getters

  get wallets() {
    return this._wallets
  }

  // Public

  containsAccount(account: string): boolean {
    return !!this._accountWalletByAddress(account)
  }

  importAccountByPK(privateKey: string): string {
    const wallet = this._getWalletFromPrivateKey(privateKey)
    const address = wallet.getAddress().toString('hex')
    if (!this._wallets[address]) {
      this._wallets[address] = wallet
    }
    return address
  }
}
