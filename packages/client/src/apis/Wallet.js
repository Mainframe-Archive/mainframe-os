// @flow

import ClientAPIs from '../ClientAPIs'
import type {
  WalletAddHDAccountParams,
  WalletAddHDAccountResult,
  WalletCreateHDParams,
  WalletImportResult,
  WalletImportMnemonicParams,
  WalletGetUserEthWalletsParams,
  WalletGetEthWalletsResult,
  WalletCreateHDResult,
  WalletDeleteParams,
  WalletGetUserEthAccountsParams,
  WalletGetEthAccountsResult,
  WalletSignTxParams,
  WalletSignTxResult,
} from '../types'

export default class WalletAPIs extends ClientAPIs {
  async createHDWallet(
    params: WalletCreateHDParams,
  ): Promise<WalletCreateHDResult> {
    return this._rpc.request('wallet_createHD', params)
  }

  async importWalletByMnemonic(
    params: WalletImportMnemonicParams,
  ): Promise<WalletImportResult> {
    return this._rpc.request('wallet_importMnemonic', params)
  }

  async addHDWalletAccount(
    params: WalletAddHDAccountParams,
  ): Promise<WalletAddHDAccountResult> {
    return this._rpc.request('wallet_addHDAccount', params)
  }

  async deleteWallet(params: WalletDeleteParams): Promise<void> {
    return this._rpc.request('wallet_delete', params)
  }

  async getUserEthWallets(
    params: WalletGetUserEthWalletsParams,
  ): Promise<WalletGetEthWalletsResult> {
    return this._rpc.request('wallet_getUserEthWallets', params)
  }

  async getUserEthAccounts(
    params: WalletGetUserEthAccountsParams,
  ): Promise<WalletGetEthAccountsResult> {
    return this._rpc.request('wallet_getUserEthAccounts', params)
  }

  async signTransaction(
    params: WalletSignTxParams,
  ): Promise<WalletSignTxResult> {
    return this._rpc.request('wallet_signTx', params)
  }

  async getLedgerEthAccounts(params: { pageNum: number }) {
    return this._rpc.request('wallet_ledgerGetEthAccounts', params)
  }

  async addLedgerEthAccount(params: { index: number }) {
    return this._rpc.request('wallet_ledgerAddEthAccount', params)
  }
}
