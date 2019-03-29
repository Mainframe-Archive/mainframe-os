// @flow

import {
  WALLET_CREATE_HD_SCHEMA,
  WALLET_SIGN_ETH_TRANSACTION_SCHEMA,
  WALLET_IMPORT_MNEMONIC_SCHEMA,
  WALLET_DELETE_SCHEMA,
  WALLET_GET_LEDGER_ETH_ACCOUNTS_SCHEMA,
  WALLET_ADD_LEDGER_ETH_ACCOUNT_SCHEMA,
  WALLET_ADD_HD_ACCOUNT_SCHEMA,
  WALLET_GET_USER_ETH_ACCOUNTS_SCHEMA,
  WALLET_GET_USER_ETH_WALLETS_SCHEMA,
  WALLET_SET_USER_DEFAULT_SCHEMA,
  WALLET_SIGN_ETH_SCHEMA,
  type WalletAddHDAccountParams,
  type WalletCreateHDParams,
  type WalletCreateHDResult,
  type WalletImportResult,
  type WalletImportMnemonicParams,
  type WalletDeleteParams,
  type WalletGetUserEthAccountsParams,
  type WalletGetUserEthWalletsParams,
  type WalletGetEthWalletsResult,
  type WalletGetEthAccountsResult,
  type WalletGetLedgerEthAccountsParams,
  type WalletGetLedgerEthAccountsResult,
  type WalletAddLedgerEthAccountsParams,
  type WalletAddLedgerResult,
  type WalletSetUserDefaulParams,
  type WalletEthSignTxParams,
  type WalletSignTxResult,
  type WalletEthSignParams,
  type WalletSignResult,
} from '@mainframe/client'
import type { Subscription as RxSubscription, Observable } from 'rxjs'

import type ClientContext from '../../context/ClientContext'
import { getAccountsByPage } from '../../wallet/ledgerClient'
import { ContextSubscription } from '../../context/ContextSubscriptions'
import type { NotifyFunc } from '../../rpc/handleClient'

class EthWalletSubscription extends ContextSubscription<RxSubscription> {
  constructor() {
    super('eth_accounts_subscription')
  }

  startNotify(notify: NotifyFunc, observable: Observable<Object>) {
    this.data = observable.subscribe(result =>
      notify(this.method, { subscription: this.id, result }),
    )
  }

  async dispose() {
    if (this.data != null) {
      this.data.unsubscribe()
    }
  }
}

export const createHDWallet = {
  params: WALLET_CREATE_HD_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: WalletCreateHDParams,
  ): Promise<WalletCreateHDResult> => {
    // $FlowFixMe Issue with promise type
    const hdWallet = await ctx.mutations.createHDWallet(
      params.blockchain,
      params.name,
      params.userID,
    )
    return {
      localID: hdWallet.localID,
      mnemonic: hdWallet.mnemonic,
      accounts: hdWallet.getAccounts(),
    }
  },
}

export const importMnemonic = {
  params: WALLET_IMPORT_MNEMONIC_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: WalletImportMnemonicParams,
  ): Promise<WalletImportResult> => {
    // $FlowFixMe Issue with promise type
    const hdWallet = await ctx.mutations.importHDWallet(params)
    return {
      localID: hdWallet.localID,
      accounts: hdWallet.getAccounts(),
    }
  },
}

export const addHDAccount = {
  params: WALLET_ADD_HD_ACCOUNT_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: WalletAddHDAccountParams,
  ): Promise<string> => {
    return ctx.mutations.addHDWalletAccount(params)
  },
}

export const deleteWallet = {
  params: WALLET_DELETE_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: WalletDeleteParams,
  ): Promise<void> => {
    await ctx.mutations.deleteWallet(params.chain, params.type, params.localID)
  },
}

export const getUserEthWallets = {
  params: WALLET_GET_USER_ETH_WALLETS_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: WalletGetUserEthWalletsParams,
  ): Promise<WalletGetEthWalletsResult> => {
    const wallets = ctx.queries.getUserEthWallets(params.userID)
    return {
      hd: wallets.filter(w => w.type === 'hd'),
      ledger: wallets.filter(w => w.type === 'ledger'),
    }
  },
}

export const getUserEthAccounts = {
  params: WALLET_GET_USER_ETH_ACCOUNTS_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: WalletGetUserEthAccountsParams,
  ): Promise<WalletGetEthAccountsResult> => {
    const accounts = ctx.queries.getUserEthAccounts(params.userID)
    return accounts
  },
}

export const signTransaction = {
  params: WALLET_SIGN_ETH_TRANSACTION_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: WalletEthSignTxParams,
  ): Promise<WalletSignTxResult> => {
    return ctx.openVault.wallets.signEthTransaction(params)
  },
}

export const sign = {
  params: WALLET_SIGN_ETH_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: WalletEthSignParams,
  ): Promise<WalletSignResult> => {
    return ctx.openVault.wallets.signEthData(params)
  },
}

export const getLedgerEthAccounts = {
  params: WALLET_GET_LEDGER_ETH_ACCOUNTS_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: WalletGetLedgerEthAccountsParams,
  ): Promise<WalletGetLedgerEthAccountsResult> => {
    return getAccountsByPage(params)
  },
}

export const addLedgerEthAccounts = {
  params: WALLET_ADD_LEDGER_ETH_ACCOUNT_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: WalletAddLedgerEthAccountsParams,
  ): Promise<WalletAddLedgerResult> => {
    return ctx.mutations.addLedgerWalletAccounts(
      params.indexes,
      params.name,
      params.userID,
    )
  },
}

export const setUsersDefaultWallet = {
  params: WALLET_SET_USER_DEFAULT_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: WalletSetUserDefaulParams,
  ): Promise<void> => {
    return ctx.mutations.setUsersDefaultWallet(params.userID, params.address)
  },
}

export const subEthAccountsChanged = {
  handler: async (ctx: ClientContext): Promise<string> => {
    const sub = new EthWalletSubscription()
    ctx.subscriptions.set(sub)
    sub.startNotify(ctx.notify, ctx.events.ethAccountsChanged)
    return sub.id
  },
}
