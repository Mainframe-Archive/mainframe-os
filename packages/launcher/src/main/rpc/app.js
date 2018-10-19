// @flow

import {
  LOCAL_ID_SCHEMA,
  type BlockchainGetContractEventsParams,
  type BlockchainGetContractEventsResult,
  type BlockchainReadContractParams,
  type BlockchainReadContractResult,
} from '@mainframe/client'
import type { Subscription as RxSubscription } from 'rxjs'

import { type AppContext, ContextSubscription } from '../contexts'

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
  blockchain_getContractEvents: (
    ctx: AppContext,
    params: BlockchainGetContractEventsParams,
  ): Promise<BlockchainGetContractEventsResult> => {
    return ctx.client.blockchain.getContractEvents(params)
  },
  blockchain_readContract: (
    ctx: AppContext,
    params: BlockchainReadContractParams,
  ): Promise<BlockchainReadContractResult> => {
    return ctx.client.blockchain.readContract(params)
  },
  blockchain_getLatestBlock: (ctx: AppContext) => {
    return ctx.client.blockchain.getLatestBlock()
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
  db_read: {
    params: {
      uuid: 'string',
      key: 'string',
    },
    handler: (ctx: AppContext, params: { uuid: string, key: string }): Promise<string> => {
      return ctx.client.bluzelle.read(params)
    },
  },
  db_write: {
    params: {
      uuid: 'string',
      key: 'string',
    },
    handler: (ctx: AppContext, params: { uuid: string, key: string, value: string }): Promise<null> => {
      return ctx.client.bluzelle.write(params)
    },
  }
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
}
