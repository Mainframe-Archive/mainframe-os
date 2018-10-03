// @flow

import EthWallet from 'ethereumjs-wallet'
import sigUtil from 'eth-sig-util'
import { stripHexPrefix } from 'ethereumjs-util'

import AbstractWallet, { type AbstractWalletParams } from './AbstractWallet'

type PKWalletParams = AbstractWalletParams & {
  privateKeys: Array<string>,
}

export type PKWalletSerialized = PKWalletParams

export default class PKWallet extends AbstractWallet {
  static fromJSON = (params: PKWalletSerialized): PKWallet =>
    new PKWallet(params)

  // $FlowFixMe: Wallet type
  static toJSON = (pkWallet: PKWallet): PKWalletSerialized => ({
    privateKeys: Object.keys(pkWallet._wallets).map(k => {
      return pkWallet._wallets[k].getPrivateKey().toString('hex')
    }),
  })

  _wallets: { [index: string]: EthWallet }

  constructor(params?: PKWalletParams) {
    super()
    if (params) {
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

  _walletByAddress(address: string): ?EthWallet {
    const targetAddress = sigUtil.normalize(address)
    let wallet
    Object.keys(this._wallets).forEach(key => {
      const normalizedAddr = sigUtil.normalize(
        this._wallets[key].getAddress().toString('hex'),
      )
      if (normalizedAddr === targetAddress) {
        wallet = this._wallets[key]
      }
    })
    return wallet
  }

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

  importAccountByPK(privateKey: string): string {
    const wallet = this._getWalletFromPrivateKey(privateKey)
    const address = wallet.getAddress().toString('hex')
    if (!this._wallets[address]) {
      this._wallets[address] = wallet
    }
    return address
  }
}
