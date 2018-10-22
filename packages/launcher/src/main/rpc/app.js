// @flow

import {
  LOCAL_ID_SCHEMA,
  type BlockchainWeb3SendParams,
  type WalletSignTxParams,
  type WalletSignTxResult,
} from '@mainframe/client'
import type { Subscription as RxSubscription } from 'rxjs'

import { type AppContext, ContextSubscription } from '../contexts'
import { userDeniedError, requestTransactionPermission } from '../permissions'

class TopicSubscription extends ContextSubscription<RxSubscription> {
  data: ?RxSubscription

  constructor() {
    super('pss_subscription')
  }

  async dispose() {
    if (this.data != null) {
      this.data.unsubscribe()
    }
  }
}

export const sandboxed = {
  api_version: (ctx: AppContext) => ctx.client.apiVersion(),

  // Blockchain

  blockchain_web3Send: async (
    ctx: AppContext,
    params: BlockchainWeb3SendParams,
  ): Promise<Object> => {
    return ctx.client.blockchain.web3Send(params)
  },

  // Wallet

  wallet_signTx: async (
    ctx: AppContext,
    params: WalletSignTxParams,
  ): Promise<WalletSignTxResult> => {
    // TODO validate tx params
    const granted = await requestTransactionPermission(ctx, params)
    if (granted) {
      return ctx.client.wallet.signTransaction(params)
    }
    throw userDeniedError('BLOCKCHAIN_SEND')
  },

  wallet_getEthAccounts: async (ctx: AppContext): Promise<Array<string>> => {
    const ethWallets = await ctx.client.wallet.getEthWallets()
    // TODO might need to refactor wallets type
    // or add seaprate call for only accounts
    const accounts = Object.keys(ethWallets).reduce((acc, key) => {
      ethWallets[key].forEach(w => acc.push(...w.accounts))
      return acc
    }, [])
    if (
      ctx.appSession.defaultWallet &&
      accounts.includes(ctx.appSession.defaultWallet.account)
    ) {
      const defualtAccount = ctx.appSession.defaultWallet.account
      accounts.splice(accounts.indexOf(defualtAccount), 1)
      accounts.unshift(defualtAccount)
    }
    return accounts
  },

  // Temporary PSS APIs - should be removed when communication APIs are settled
  pss_baseAddr: (ctx: AppContext): Promise<string> => {
    return ctx.client.pss.baseAddr()
  },
  pss_createTopicSubscription: {
    params: {
      topic: 'string',
    },
    handler: async (
      ctx: AppContext,
      params: { topic: string },
    ): Promise<string> => {
      const subscription = await ctx.client.pss.createTopicSubscription(params)
      const sub = new TopicSubscription()
      sub.data = subscription.subscribe(msg => {
        ctx.notifySandboxed(sub.id, msg)
      })
      ctx.setSubscription(sub)
      return sub.id
    },
  },
  pss_getPublicKey: (ctx: AppContext): Promise<string> => {
    return ctx.client.pss.getPublicKey()
  },
  pss_sendAsym: {
    params: {
      key: 'string',
      topic: 'string',
      message: 'string',
    },
    handler: (
      ctx: AppContext,
      params: { key: string, topic: string, message: string },
    ): Promise<null> => {
      return ctx.client.pss.sendAsym(params)
    },
  },
  pss_setPeerPublicKey: {
    params: {
      key: 'string',
      topic: 'string',
    },
    handler: (
      ctx: AppContext,
      params: { key: string, topic: string },
    ): Promise<null> => {
      return ctx.client.pss.setPeerPublicKey(params)
    },
  },
  pss_stringToTopic: {
    params: {
      string: 'string',
    },
    handler: (ctx: AppContext, params: { string: string }): Promise<string> => {
      return ctx.client.pss.stringToTopic(params)
    },
  },
}

export const trusted = {
  sub_createPermissionDenied: (ctx: AppContext): { id: string } => ({
    id: ctx.createPermissionDeniedSubscription(),
  }),
  sub_unsubscribe: {
    params: {
      id: LOCAL_ID_SCHEMA,
    },
    handler: (ctx: AppContext, params: { id: string }): void => {
      ctx.removeSubscription(params.id)
    },
  },

  // WALLET

  wallet_getEthWallets: async (
    ctx: AppContext,
  ): Promise<WalletGetAllResult> => {
    return ctx.client.wallet.getEthWallets()
  },
}
