// @flow

import {
  idType,
  WALLET_CREATE_HD_SCHEMA,
  WALLET_SIGN_TRANSACTION_SCHEMA,
  WALLET_IMPORT_PK_SCHEMA,
  WALLET_IMPORT_MNEMONIC_SCHEMA,
  type WalletCreateHDParams,
  type WalletCreateHDResult,
  type WalletImportPKParams,
  type WalletImportResult,
  type WalletImportMnemonicParams,
  type WalletResults,
  type WalletGetEthWalletsResult,
  type WalletSignTxParams,
  type WalletSignTxResult,
  type WalletTypes,
} from '@mainframe/client'

import type RequestContext from '../RequestContext'

export const createHDWallet = {
  params: WALLET_CREATE_HD_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: WalletCreateHDParams,
  ): Promise<WalletCreateHDResult> => {
    // TODO define params
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
    return ctx.openVault.wallets.signTransaction(params)
  },
}
