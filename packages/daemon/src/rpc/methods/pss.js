// @flow

import type { hexValue } from '@erebos/hex'
import type { Subscription as RxSubscription } from 'rxjs'

import ClientContext from '../../context/ClientContext'
import { ContextSubscription } from '../../context/ContextSubscriptions'

class TopicSubscription extends ContextSubscription<RxSubscription> {
  data: ?RxSubscription

  constructor() {
    super('pss_subscription')
  }

  async dispose() {
    // TODO: also unsubscribe from Swarm if possible
    if (this.data != null) {
      this.data.unsubscribe()
    }
  }
}

export const baseAddr = (ctx: ClientContext): Promise<hexValue> => {
  return ctx.io.pss.baseAddr()
}

export const createTopicSubscription = {
  params: {
    topic: 'string',
  },
  handler: async (
    ctx: ClientContext,
    params: { topic: hexValue },
  ): Promise<string> => {
    // Create topic subscription in Swarm node
    const subKey = await ctx.io.pss.subscribeTopic(params.topic)
    // Create local subscription
    const sub = new TopicSubscription()
    // Subscribe to messages from Swarm and store the created Rx Subscription
    // object in the TopicSubscription so it can be disposed of
    sub.data = ctx.io.pss.createSubscription(subKey).subscribe(event => {
      ctx.notify(sub.id, { key: event.key, msg: event.msg.value })
    })
    // Add local subscription to context and return its ID to client so it can unsubscribe
    ctx.subscriptions.set(sub)
    return sub.id
  },
}

export const getPublicKey = (ctx: ClientContext): Promise<hexValue> => {
  return ctx.io.pss.getPublicKey()
}

export const sendAsym = {
  params: {
    key: 'string',
    topic: 'string',
    message: 'string',
  },
  handler: (
    ctx: ClientContext,
    params: { key: hexValue, topic: hexValue, message: hexValue },
  ): Promise<null> => {
    return ctx.io.pss.sendAsym(params.key, params.topic, params.message)
  },
}

export const setPeerPublicKey = {
  params: {
    key: 'string',
    topic: 'string',
  },
  handler: (
    ctx: ClientContext,
    params: { key: hexValue, topic: hexValue },
  ): Promise<null> => {
    return ctx.io.pss.setPeerPublicKey(params.key, params.topic)
  },
}

export const stringToTopic = {
  params: {
    string: 'string',
  },
  handler: (
    ctx: ClientContext,
    params: { string: string },
  ): Promise<hexValue> => {
    return ctx.io.pss.stringToTopic(params.string)
  },
}
