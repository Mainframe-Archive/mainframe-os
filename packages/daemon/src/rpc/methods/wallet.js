// @flow

import {
  WALLET_CREATE_HD_SCHEMA,
  WALLET_SIGN_TRANSACTION_SCHEMA,
  WALLET_IMPORT_MNEMONIC_SCHEMA,
  WALLET_DELETE_SCHEMA,
  WALLET_GET_LEDGER_ETH_ACCOUNTS_SCHEMA,
  WALLET_ADD_LEDGER_ETH_ACCOUNT_SCHEMA,
  WALLET_ADD_HD_ACCOUNT_SCHEMA,
  WALLET_GET_USER_ETH_ACCOUNTS_SCHEMA,
  WALLET_GET_USER_ETH_WALLETS_SCHEMA,
  type WalletAddHDAccountParams,
  type WalletAddHDAccountResult,
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
  type WalletAddLedgerEthAccountParams,
  type WalletSignTxParams,
  type WalletSignTxResult,
} from '@mainframe/client'

import type ClientContext from '../../context/ClientContext'
import { getAccountsByPage } from '../../wallet/ledgerClient'

export const createHDWallet = {
  params: WALLET_CREATE_HD_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: WalletCreateHDParams,
  ): Promise<WalletCreateHDResult> => {
    const res = ctx.openVault.wallets.createHDWallet(params)
    await ctx.openVault.save()
    return res
  },
}

export const importMnemonic = {
  params: WALLET_IMPORT_MNEMONIC_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: WalletImportMnemonicParams,
  ): Promise<WalletImportResult> => {
    const hdWallet = ctx.openVault.wallets.importMnemonicWallet(params)
    await ctx.openVault.save()
    return hdWallet
  },
}

export const addHDAccount = {
  params: WALLET_ADD_HD_ACCOUNT_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: WalletAddHDAccountParams,
  ): Promise<WalletAddHDAccountResult> => {
    const newAddress = ctx.openVault.wallets.addHDWalletAccount(params)
    await ctx.openVault.save()
    return newAddress
  },
}

export const deleteWallet = {
  params: WALLET_DELETE_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: WalletDeleteParams,
  ): Promise<void> => {
    ctx.openVault.deleteWallet(params.chain, params.type, params.localID)
    await ctx.openVault.save()
  },
}

export const getUserEthWallets = {
  params: WALLET_GET_USER_ETH_WALLETS_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: WalletGetUserEthWalletsParams,
  ): Promise<WalletGetEthWalletsResult> => {
    const wallets = ctx.openVault.getUserEthWallets(params.userID)
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
    return ctx.openVault.getUserEthAccounts(params.userID)
  },
}

export const signTransaction = {
  params: WALLET_SIGN_TRANSACTION_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: WalletSignTxParams,
  ): Promise<WalletSignTxResult> => {
    if (params.chain === 'ethereum') {
      params.transactionData.chainId = ctx.openVault.settings.ethChainID
    }
    return ctx.openVault.wallets.signTransaction(params)
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

export const addLedgerEthAccount = {
  params: WALLET_ADD_LEDGER_ETH_ACCOUNT_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: WalletAddLedgerEthAccountParams,
  ): Promise<void> => {
    const res = await ctx.openVault.wallets.addLedgerEthAccount(params)
    await ctx.openVault.save()
    return res
  },
}
