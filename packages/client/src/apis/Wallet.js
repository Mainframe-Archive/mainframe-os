// @flow

import ClientAPIs from '../ClientAPIs'
import type {
  WalletCreateHDParams,
  WalletImportPKParams,
  WalletImportResult,
  WalletImportMnemonicParams,
  WalletGetEthWalletsResult,
  WalletCreateHDResult,
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

  async getEthWallets(): Promise<WalletGetEthWalletsResult> {
    return this._rpc.request('wallet_getEthWallets')
  }

  async signTransaction(
    params: WalletSignTxParams,
  ): Promise<WalletSignTxResult> {
    return this._rpc.request('wallet_signTx', params)
  }
}
