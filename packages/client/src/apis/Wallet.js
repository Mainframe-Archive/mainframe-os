// @flow

import ClientAPIs from '../ClientAPIs'
import type {
  WalletEthSignTransactionParams,
  WalletImportPKParams,
  WalletSupportedChains,
  WalletImportPKResult,
  WalletGetEthWalletsResult,
  WalletCreateHDResult,
  WalletEthSignTransactionResult,
} from '../types'

export default class WalletAPIs extends ClientAPIs {
  async createHDWallet(
    chain: WalletSupportedChains,
  ): Promise<WalletCreateHDResult> {
    return this._rpc.request('wallet_createHD', { chain })
  }

  async importAccountByPK(
    params: WalletImportPKParams,
  ): Promise<WalletImportPKResult> {
    return this._rpc.request('wallet_importPK', params)
  }

  async getEthWallets(): Promise<WalletGetEthWalletsResult> {
    return this._rpc.request('wallet_getEthWallets')
  }

  async signEthTransaction(
    params: WalletEthSignTransactionParams,
  ): Promise<WalletEthSignTransactionResult> {
    return this._rpc.request('wallet_signEthTransaction', params)
  }
}
