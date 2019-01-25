// @flow

import EthWallet from 'ethereumjs-wallet'
import EthereumTx from 'ethereumjs-tx'
import sigUtil from 'eth-sig-util'
import { addHexPrefix } from 'ethereumjs-util'
import type {
  EthTransactionParams,
  WalletEthSignDataParams,
} from '@mainframe/client'

export type AbstractWalletParams = {
  localID: string,
}

export type AbstractWalletSerialized = AbstractWalletParams

export default class AbstractSoftwareWallet {
  _localID: string
  _wallets: { [index: string]: EthWallet }

  // Getters

  get id(): string {
    return this._localID
  }

  get localID(): string {
    return this._localID
  }

  getAccounts(): Array<string> {
    throw new Error('Must be implemented')
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

  containsAccount(account: string): boolean {
    return !!this._accountWalletByAddress(account)
  }

  signTransaction(params: EthTransactionParams): string {
    const accountWallet = this._accountWalletByAddress(params.from)

    if (!accountWallet) {
      throw new Error('Invalid from address')
    }

    const tx = new EthereumTx(params)
    tx.sign(accountWallet.getPrivateKey())
    return addHexPrefix(tx.serialize().toString('hex'))
  }

  sign(params: WalletEthSignDataParams) {
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
