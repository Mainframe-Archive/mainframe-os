// @flow

import HDkey from 'ethereumjs-wallet/hdkey'
import sigUtil from 'eth-sig-util'
import bip39 from 'bip39'

import AbstractSoftwareWallet, {
  type AbstractWalletParams,
} from './AbstractSoftwareWallet'

type HDWalletParams = AbstractWalletParams & {
  mnemonic: string,
  hdPath?: string,
  activeAccounts?: Array<number>,
}

export type HDWalletSerialized = HDWalletParams

const hdPathString = `m/44'/60'/0'/0`

export default class HDWallet extends AbstractSoftwareWallet {
  static fromJSON = (params: HDWalletSerialized): HDWallet =>
    new HDWallet(params)

  // $FlowFixMe: Wallet type
  static toJSON = (hdWallet: HDWallet): HDWalletSerialized => ({
    mnemonic: hdWallet._mnemonic,
    walletID: hdWallet._walletID,
    // $FlowFixMe: Keys are numbers
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
      this._walletID = params.walletID
      this._initFromMnemonic(params.mnemonic)
      if (params.activeAccounts && params.activeAccounts.length) {
        this.addAccounts(params.activeAccounts)
      }
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

  getAccounts(): Array<string> {
    // $FlowFixMe mapping type
    return Object.keys(this._wallets).map(i => {
      const wallet = this._wallets[i]
      return sigUtil.normalize(wallet.getAddress().toString('hex'))
    })
  }

  // Public

  addAccounts(indexes: Array<number>): Array<string> {
    const newWallets = []
    indexes.forEach(i => {
      const child = this._root.deriveChild(i)
      const wallet = child.getWallet()
      newWallets.push(wallet)
      this._wallets[i] = wallet
    })
    const hexWallets = newWallets.map(w => {
      return sigUtil.normalize(w.getAddress().toString('hex'))
    })
    return hexWallets
  }
}
