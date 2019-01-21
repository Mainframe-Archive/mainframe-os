// @flow

import HDkey from 'ethereumjs-wallet/hdkey'
import sigUtil from 'eth-sig-util'
import bip39 from 'bip39'
import { uniqueID } from '@mainframe/utils-id'

import AbstractSoftwareWallet, {
  type AbstractWalletParams,
} from './AbstractSoftwareWallet'

type AccountIndex = string

export type HDWalletParams = AbstractWalletParams & {
  mnemonic: string,
  hdPath?: string,
  activeAccounts?: Array<AccountIndex>,
}

const HD_PATH_STRING = `m/44'/60'/0'/0`

export const generateWalletParams = () => ({
  localID: uniqueID(),
  mnemonic: bip39.generateMnemonic(),
  hdPath: HD_PATH_STRING,
  activeAccounts: ['0'],
})

export default class HDWallet extends AbstractSoftwareWallet {
  _hdKey: HDkey
  _root: HDkey
  _mnemonic: string
  _hdPath: string
  _type: 'hd'

  constructor(params: HDWalletParams) {
    super()
    this._type = 'hd'
    this._wallets = {}
    this._hdPath = params.hdPath ? params.hdPath : HD_PATH_STRING
    this._localID = params.localID
    this._initFromMnemonic(params.mnemonic)
    if (params.activeAccounts && params.activeAccounts.length) {
      this.addAccounts(params.activeAccounts.map(a => Number(a)))
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

  get mnemonic(): string {
    return this._mnemonic
  }

  get type(): 'hd' {
    return this._type
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
      if (!this._wallets[String(i)]) {
        const child = this._root.deriveChild(i)
        const wallet = child.getWallet()
        newWallets.push(wallet)
        this._wallets[String(i)] = wallet
      }
    })
    const hexWallets = newWallets.map(w => {
      return sigUtil.normalize(w.getAddress().toString('hex'))
    })
    return hexWallets
  }
}
