// @flow

import { Observable } from 'rxjs'

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
  WalletSetUserDefaulParams,
  WalletSignTxParams,
  WalletSignTxResult,
  WalletSignParams,
  WalletSignResult,
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

  async sign(params: WalletSignParams): Promise<WalletSignResult> {
    return this._rpc.request('wallet_sign', params)
  }

  async getLedgerEthAccounts(params: { pageNum: number }) {
    return this._rpc.request('wallet_ledgerGetEthAccounts', params)
  }

  async addLedgerEthAccounts(params: { indexes: Array<number> }) {
    return this._rpc.request('wallet_ledgerAddEthAccounts', params)
  }

  async setUsersDefaultWallet(params: WalletSetUserDefaulParams) {
    return this._rpc.request('wallet_setUserDefault', params)
  }

  async subscribeEthAccountsChanged(): Promise<
    Observable<{ networkID: string }>,
  > {
    const subscription = await this._rpc.request('wallet_subEthAccountsChanged')
    const unsubscribe = () => {
      return this._rpc.request('sub_unsubscribe', { id: subscription })
    }

    return Observable.create(observer => {
      this._rpc.subscribe({
        next: msg => {
          if (
            msg.method === 'eth_accounts_subscription' &&
            msg.params != null &&
            msg.params.subscription === subscription
          ) {
            const { result } = msg.params
            if (result != null) {
              try {
                observer.next(result)
              } catch (err) {
                // eslint-disable-next-line no-console
                console.warn('Error handling message', result, err)
              }
            }
          }
        },
        error: err => {
          observer.error(err)
          unsubscribe()
        },
        complete: () => {
          observer.complete()
          unsubscribe()
        },
      })

      return unsubscribe
    })
  }
}
