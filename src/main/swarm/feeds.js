// @flow

import type { Bzz, FeedParams } from '@erebos/api-bzz-node'
import type { Observable } from 'rxjs'
import { flatMap } from 'rxjs/operators'

import type OwnFeed from './OwnFeed'

export const DEFAULT_POLL_INTERVAL = 10 * 60 * 1000 // 10 mins

type IdentityFunc = <T>(t: T) => T
const identity: IdentityFunc = <T>(input: T): T => input

export type PublisherParams<T> = {
  bzz: Bzz,
  feed: OwnFeed,
  transform?: T => any,
}

export const createPublisher = <T>(params: PublisherParams<T>) => {
  const transform = params.transform || identity
  return async (data: T): Promise<string> => {
    const transformed = await transform(data)
    return await params.feed.publishJSON(params.bzz, transformed)
  }
}

export type SubscriberParams<T> = {
  bzz: Bzz,
  feed: FeedParams,
  interval?: ?number,
  transform?: (data: Object) => Promise<T>,
}

export const createSubscriber = <T: any>(
  params: SubscriberParams<T>,
): Observable<T> => {
  const transform = params.transform || identity

  return params.bzz
    .pollFeedContent(params.feed, {
      interval: params.interval || DEFAULT_POLL_INTERVAL,
      mode: 'raw',
      whenEmpty: 'ignore',
      changedOnly: true,
    })
    .pipe(
      flatMap(async res => {
        const data = await res.json()
        return await transform(data)
      }),
    )
}

export const readJSON = async (
  bzz: Bzz,
  feed: string | FeedParams,
): Promise<Object | null> => {
  const res = await bzz.getFeedContent(feed, { mode: 'raw' })
  if (res == null) {
    return null
  }
  return res.ok ? await res.json() : null
}
