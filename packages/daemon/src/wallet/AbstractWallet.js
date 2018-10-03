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

export default class PKWallet {
  _walletID: ID
  _wallets: { [string]: EthWallet }

  // Getters

  get id(): ID {
    return this._walletID
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

  // Public

  getAccounts() {
    // $FlowFixMe mapping type
    return Object.keys(this._wallets).map((i: string) => {
      const wallet = this._wallets[i]
      return sigUtil.normalize(wallet.getAddress().toString('hex'))
    })
  }

  signTransaction(params: EthTransactionParams): string {
    const wallet = this._walletByAddress(params.from)

    if (!wallet) {
      throw new Error('Invalid from address')
    }

    const tx = new EthereumTx(params)
    tx.sign(wallet.getPrivateKey())
    return addHexPrefix(tx.serialize().toString('hex'))
  }

  sign(params: WalletEthSignDataParams) {
    const wallet = this._walletByAddress(params.address)

    if (!wallet) {
      throw new Error('Invalid address')
    }

    return addHexPrefix(
      sigUtil.personalSign(wallet.getPrivateKey(), { data: params.data }),
    )
  }
}
