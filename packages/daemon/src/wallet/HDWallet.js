// @flow

import HDkey from 'ethereumjs-wallet/hdkey'
import sigUtil from 'eth-sig-util'
import bip39 from 'bip39'
import { uniqueID } from '@mainframe/utils-id'
import EthereumTx from 'ethereumjs-tx'
import type EthWallet from 'ethereumjs-wallet'
import { addHexPrefix } from 'ethereumjs-util'

import AbstractWallet, {
  type WalletEthSignTxParams,
  type WalletSignDataParams,
} from './AbstractWallet'

type AccountIndex = string

export type HDWalletParams = {
  localID: string,
  name: ?string,
  mnemonic: string,
  hdPath?: string,
  activeAccounts: Array<AccountIndex>,
}

type HDWalletImportParams = {
  mnemonic: string,
  name: string,
}

export type HDWalletSerialized = HDWalletParams

const HD_PATH_STRING = `m/44'/60'/0'/0`

export default class HDWallet extends AbstractWallet {
  static create = (name: string): HDWallet => {
    const params = {
      name,
      localID: uniqueID(),
      mnemonic: bip39.generateMnemonic(),
      hdPath: HD_PATH_STRING,
      activeAccounts: ['0'],
    }
    return new HDWallet(params)
  }

  static import = (params: HDWalletImportParams): HDWallet => {
    const wallet = new HDWallet({
      ...params,
      localID: uniqueID(),
      activeAccounts: ['0'],
    })
    return wallet
  }

  static fromJSON = (params: HDWalletSerialized): HDWallet =>
    new HDWallet(params)

  static toJSON = (wallet: HDWallet): HDWalletSerialized => ({
    mnemonic: wallet._mnemonic,
    localID: wallet._localID,
    activeAccounts: Object.keys(wallet._wallets),
    name: wallet.name,
  })

  _hdKey: HDkey
  _root: HDkey
  _mnemonic: string
  _hdPath: string
  _wallets: { [index: string]: EthWallet }

  constructor(params: HDWalletParams) {
    super({ ...params, type: 'hd' })
    this._wallets = {}
    this._hdPath = params.hdPath ? params.hdPath : HD_PATH_STRING
    this._initFromMnemonic(params.mnemonic)
    if (params.activeAccounts && params.activeAccounts.length) {
      this.addAccounts(params.activeAccounts.map(a => Number(a)))
    }
    if (!this._wallets.length) {
      this.addAccounts([0])
    }
  }

  // Getters

  get publicExtendedKey() {
    return this._hdKey.publicExtendedKey()
  }

  get mnemonic(): string {
    return this._mnemonic
  }

  // Internal

  _initFromMnemonic(mnemonic: string) {
    const seed = bip39.mnemonicToSeed(mnemonic)
    this._hdKey = HDkey.fromMasterSeed(seed)
    this._root = this._hdKey.derivePath(this._hdPath)
    this._mnemonic = mnemonic
  }

  _accountWalletByAddress(address: string): ?EthWallet {
    const targetAddress = sigUtil.normalize(address)
    let accountWallet
    const indexes: Array<string> = Object.keys(this._wallets)
    indexes.forEach(i => {
      const normalizedAddr = sigUtil.normalize(
        this._wallets[i].getAddress().toString('hex'),
      )
      if (normalizedAddr === targetAddress) {
        accountWallet = this._wallets[i]
      }
    })
    return accountWallet
  }

  // Public

  getAccounts(): Array<string> {
    // $FlowFixMe mapping type
    return Object.keys(this._wallets).map(i => {
      const wallet = this._wallets[i]
      return sigUtil.normalize(wallet.getAddress().toString('hex'))
    })
  }

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

  containsAccount(account: string): boolean {
    return !!this._accountWalletByAddress(account)
  }

  signTransaction(params: WalletEthSignTxParams): string {
    const accountWallet = this._accountWalletByAddress(params.from)

    if (!accountWallet) {
      throw new Error('Invalid from address')
    }

    const tx = new EthereumTx(params)
    tx.sign(accountWallet.getPrivateKey())
    return addHexPrefix(tx.serialize().toString('hex'))
  }

  sign(params: WalletSignDataParams): string {
    const accountWallet = this._accountWalletByAddress(params.address)

    if (!accountWallet) {
      throw new Error('Invalid address')
    }

    return addHexPrefix(
      sigUtil.personalSign(accountWallet.getPrivateKey(), {
        data: params.data,
      }),
    )
  }
}
