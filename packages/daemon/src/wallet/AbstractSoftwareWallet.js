// @flow

import EthWallet from 'ethereumjs-wallet'
import EthereumTx from 'ethereumjs-tx'
import sigUtil from 'eth-sig-util'
import { addHexPrefix } from 'ethereumjs-util'
import type {
  EthTransactionParams,
  WalletEthSignDataParams,
} from '@mainframe/client'
import type { ID } from '@mainframe/utils-id'

export type AbstractWalletParams = {
  walletID: ID,
}

export type AbstractWalletSerialized = AbstractWalletParams

export default class AbstractSoftwareWallet {
  _walletID: ID
  _wallets: { [index: number]: EthWallet }

  // Getters

  get id(): ID {
    return this._walletID
  }

  getAccounts(): Array<string> {
    throw new Error('Must be implemented')
  }

  _accountWalletByAddress(address: string): ?EthWallet {
    const targetAddress = sigUtil.normalize(address)
    let accountWallet
    const indexes: Array<number> = Object.keys(this._wallets).map(k =>
      Number(k),
    )
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
