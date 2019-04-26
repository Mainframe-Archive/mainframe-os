// @flow

import {
  type CommsGetSubscribableParams,
  type CommsGetSubscribableResult,
  type CommsPublishParams,
  type CommsSubscribeParams,
  COMMS_GET_SUBSCRIBABLE_SCHEMA,
  COMMS_PUBLISH_SCHEMA,
  COMMS_SUBSCRIBE_SCHEMA,
} from '@mainframe/client'
import { idType as fromClientID } from '@mainframe/utils-id'
import type { Subscription as RxSubscription, Observable } from 'rxjs'

import { pollFeedJSON } from '../../swarm/feed'
import { ContextSubscription } from '../../context/ContextSubscriptions'
import type ClientContext from '../../context/ClientContext'
import type { NotifyFunc } from '../../rpc/handleClient'

const MINUTE = 60 * 1000

class CommsSubscription extends ContextSubscription<RxSubscription> {
  constructor() {
    super('comms_subscription')
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

export const publish = {
  params: COMMS_PUBLISH_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: CommsPublishParams,
  ): Promise<void> => {
    const localID = ctx.queries.getContactLocalIDByAppApprovedID(
      fromClientID(params.appID),
      fromClientID(params.userID),
      fromClientID(params.contactID),
    )
    if (!localID) {
      throw new Error('Contact not found')
    }
    await ctx.mutations.publishAppData(
      fromClientID(params.appID),
      localID,
      params.key,
      params.value,
    )
  },
}

export const subscribe = {
  params: COMMS_SUBSCRIBE_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: CommsSubscribeParams,
  ): Promise<string> => {
    const localID = ctx.queries.getContactLocalIDByAppApprovedID(
      fromClientID(params.appID),
      fromClientID(params.userID),
      fromClientID(params.contactID),
    )
    if (!localID) {
      throw new Error('Contact not found')
    }
    const appFeeds = await ctx.queries.getContactAppFeeds(
      fromClientID(params.appID),
      localID,
    )
    if (!appFeeds[params.key]) {
      throw new Error('Feed not found')
    }

    const sub = new CommsSubscription()
    ctx.subscriptions.set(sub)

    // TODO: Integrate with FeedsHandler to de-duplicate multiple calls to poll the same feed
    const poll = pollFeedJSON(ctx.io.bzz, appFeeds[params.key].feedHash, {
      interval: MINUTE,
    })
    sub.startNotify(ctx.notify, poll)

    return sub.id
  },
}

export const getSubscribable = {
  params: COMMS_GET_SUBSCRIBABLE_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: CommsGetSubscribableParams,
  ): Promise<CommsGetSubscribableResult> => {
    const localID = ctx.queries.getContactLocalIDByAppApprovedID(
      fromClientID(params.appID),
      fromClientID(params.userID),
      fromClientID(params.contactID),
    )
    if (!localID) {
      throw new Error('Contact not found')
    }
    const appFeeds = await ctx.queries.getContactAppFeeds(
      fromClientID(params.appID),
      localID,
    )
    return Object.keys(appFeeds).filter(key => appFeeds[key].type === 'json')
  },
}
