// @flow

import HDkey from 'ethereumjs-wallet/hdkey'
import sigUtil from 'eth-sig-util'
import bip39 from 'bip39'

import AbstractWallet, { type AbstractWalletParams } from './AbstractWallet'

type HDWalletParams = AbstractWalletParams & {
  mnemonic: string,
  hdPath?: string,
  activeAccounts?: { [number]: string },
}

export type HDWalletSerialized = HDWalletParams

const hdPathString = `m/44'/60'/0'/0`

export default class HDWallet extends AbstractWallet {
  static fromJSON = (params: HDWalletSerialized): HDWallet =>
    new HDWallet(params)

  // $FlowFixMe: Wallet type
  static toJSON = (hdWallet: HDWallet): HDWalletSerialized => ({
    mnemonic: hdWallet._mnemonic,
    activeAccounts: Object.keys(hdWallet._wallets),
  })

  _hdKey: HDkey
  _root: Object
  _mnemonic: string
  _hdPath: string

  constructor(params?: HDWalletParams) {
    super()
    this._wallets = {}
    this._hdPath = params && params.hdPath ? params.hdPath : hdPathString
    if (params) {
      this._initFromMnemonic(params.mnemonic)
    } else {
      this._initFromMnemonic(bip39.generateMnemonic())
    }
    if (!this._wallets.length) {
      this.addAccounts([0])
    }
  }

  // Internal

  _initFromMnemonic(mnemonic: string) {
    const seed = bip39.mnemonicToSeed(mnemonic)
    this._hdKey = HDkey.fromMasterSeed(seed)
    this._root = this._hdKey.derivePath(this._hdPath)
    this._mnemonic = mnemonic
  }

  // Getters

  get publicExtendedKey() {
    return this._hdKey.publicExtendedKey()
  }

  // Public

  addAccounts(indexes: Array<number>): Array<string> {
    const newWallets = []
    indexes.forEach(i => {
      const child = this._root.deriveChild(i)
      const wallet = child.getWallet()
      newWallets.push(wallet)
      this._wallets[String(i)] = wallet
    })
    const hexWallets = newWallets.map(w => {
      return sigUtil.normalize(w.getAddress().toString('hex'))
    })
    return hexWallets
  }
}
