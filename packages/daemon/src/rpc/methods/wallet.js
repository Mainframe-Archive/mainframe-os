// @flow

import {
  idType,
  WALLET_CREATE_HD_SCHEMA,
  WALLET_SIGN_TRANSACTION_SCHEMA,
  WALLET_IMPORT_PK_SCHEMA,
  WALLET_IMPORT_MNEMONIC_SCHEMA,
  WALLET_DELETE_SCHEMA,
  WALLET_GET_LEDGER_ETH_ACCOUNTS_SCHEMA,
  WALLET_ADD_LEDGER_ETH_ACCOUNT_SCHEMA,
  WALLET_ADD_HD_ACCOUNT_SCHEMA,
  type WalletAddHDAccountParams,
  type WalletAddHDAccountResult,
  type WalletCreateHDParams,
  type WalletCreateHDResult,
  type WalletImportPKParams,
  type WalletImportResult,
  type WalletImportMnemonicParams,
  type WalletDeleteParams,
  type WalletResults,
  type WalletGetEthWalletsResult,
  type WalletGetLedgerEthAccountsParams,
  type WalletGetLedgerEthAccountsResult,
  type WalletAddLedgerEthAccountParams,
  type WalletSignTxParams,
  type WalletSignTxResult,
  type WalletTypes,
} from '@mainframe/client'

import { getAccountsByPage } from '../../wallet/ledgerClient'

import type RequestContext from '../RequestContext'

export const createHDWallet = {
  params: WALLET_CREATE_HD_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: WalletCreateHDParams,
  ): Promise<WalletCreateHDResult> => {
    const res = ctx.openVault.wallets.createHDWallet(params)
    await ctx.openVault.save()
    return res
  },
}

export const importAccountByPK = {
  params: WALLET_IMPORT_PK_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: WalletImportPKParams,
  ): Promise<WalletImportResult> => {
    const simpleWallet = ctx.openVault.wallets.importPKWallet(params)
    await ctx.openVault.save()
    return simpleWallet
  },
}

export const importMnemonic = {
  params: WALLET_IMPORT_MNEMONIC_SCHEMA,
  handler: async (
    ctx: RequestContext,
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
    ctx: RequestContext,
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
    ctx: RequestContext,
    params: WalletDeleteParams,
  ): Promise<void> => {
    await ctx.openVault.wallets.deleteWallet(params)
    ctx.openVault.identityWallets.deleteWallet(params.walletID)
    await ctx.openVault.save()
  },
}

export const getEthWallets = (
  ctx: RequestContext,
): WalletGetEthWalletsResult => {
  const mapData = (type: WalletTypes): WalletResults =>
    Object.keys(ctx.openVault.wallets.ethWallets[type]).map(id => {
      const wallet = ctx.openVault.wallets.ethWallets[type][id]
      const accounts = wallet.getAccounts()
      return {
        type: type,
        walletID: idType(id),
        accounts,
      }
    })
  return {
    hd: mapData('hd'),
    simple: mapData('pk'),
    ledger: mapData('ledger'),
  }
}

export const signTransaction = {
  params: WALLET_SIGN_TRANSACTION_SCHEMA,
  handler: async (
    ctx: RequestContext,
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
    ctx: RequestContext,
    params: WalletGetLedgerEthAccountsParams,
  ): Promise<WalletGetLedgerEthAccountsResult> => {
    return getAccountsByPage(params)
  },
}

export const addLedgerEthAccount = {
  params: WALLET_ADD_LEDGER_ETH_ACCOUNT_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: WalletAddLedgerEthAccountParams,
  ): Promise<void> => {
    await ctx.openVault.wallets.addLedgerEthAccount(params)
    await ctx.openVault.save()
  },
}
