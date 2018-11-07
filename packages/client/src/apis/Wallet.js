// @flow

import ClientAPIs from '../ClientAPIs'
import type {
  WalletAddHDAccountParams,
  WalletAddHDAccountResult,
  WalletCreateHDParams,
  WalletImportPKParams,
  WalletImportResult,
  WalletImportMnemonicParams,
  WalletGetEthWalletsResult,
  WalletCreateHDResult,
  WalletDeleteParams,
  WalletSignTxParams,
  WalletSignTxResult,
} from '../types'

export default class WalletAPIs extends ClientAPIs {
  async createHDWallet(
    params: WalletCreateHDParams,
  ): Promise<WalletCreateHDResult> {
    return this._rpc.request('wallet_createHD', params)
  }

  async importAccountByPK(
    params: WalletImportPKParams,
  ): Promise<WalletImportResult> {
    return this._rpc.request('wallet_importPK', params)
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

  async getEthWallets(): Promise<WalletGetEthWalletsResult> {
    return this._rpc.request('wallet_getEthWallets')
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
