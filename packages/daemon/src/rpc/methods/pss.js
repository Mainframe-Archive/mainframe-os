// @flow

import type { Subscription as RxSubscription } from 'rxjs'

import type { hex } from '@mainframe/utils-hex'

import {
  type default as RequestContext,
  ContextSubscription,
} from '../RequestContext'

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

export const baseAddr = (ctx: RequestContext): Promise<hex> => {
  return ctx.pss.baseAddr()
}

export const createTopicSubscription = {
  params: {
    topic: 'string',
  },
  handler: async (
    ctx: RequestContext,
    params: { topic: hex },
  ): Promise<string> => {
    // Create topic subscription in Swarm node
    const subKey = await ctx.pss.subscribeTopic(params.topic)
    // Create local subscription
    const sub = new TopicSubscription()
    // Subscribe to messages from Swarm and store the created Rx Subscription
    // object in the TopicSubscription so it can be disposed of
    sub.data = ctx.pss.createSubscription(subKey).subscribe(msg => {
      ctx.notify(sub.id, msg)
    })
    // Add local subscription to context and return its ID to client so it can unsubscribe
    ctx.setSubscription(sub)
    return sub.id
  },
}

export const getPublicKey = (ctx: RequestContext): Promise<hex> => {
  return ctx.pss.getPublicKey()
}

export const sendAsym = {
  params: {
    key: 'string',
    topic: 'string',
    message: 'string',
  },
  handler: (
    ctx: RequestContext,
    params: { key: hex, topic: hex, message: hex },
  ): Promise<null> => {
    return ctx.pss.sendAsym(params.key, params.topic, params.message)
  },
}

export const setPeerPublicKey = {
  params: {
    key: 'string',
    topic: 'string',
  },
  handler: (
    ctx: RequestContext,
    params: { key: hex, topic: hex },
  ): Promise<null> => {
    return ctx.pss.setPeerPublicKey(params.key, params.topic)
  },
}

export const stringToTopic = {
  params: {
    string: 'string',
  },
  handler: (
    ctx: RequestContext,
    params: { string: string },
  ): Promise<string> => {
    return ctx.pss.stringToTopic(params.string)
  },
}
