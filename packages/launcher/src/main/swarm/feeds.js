// @flow

import type { FeedParams } from '@erebos/api-bzz-base'
import type Bzz from '@erebos/api-bzz-node'
import type { Observable } from 'rxjs'
import { flatMap } from 'rxjs/operators'

import type OwnFeed from './OwnFeed'

const DEFAULT_POLL_INTERVAL = 10 * 60 * 1000 // 10 mins

const identity = input => input

export type PublisherParams<T> = {
  bzz: Bzz,
  feed: OwnFeed,
  transform?: T => any,
}

export const createPublisher = <T: any>(params: PublisherParams<T>) => {
  const feed = { user: params.feed.address }
  const key = params.feed.keyPair.getPrivate()
  const transform = params.transform || identity

  return async (data: T): Promise<string> => {
    const body = JSON.stringify(transform(data))
    return await params.bzz.uploadFeedValue(feed, body, { mode: 'raw' }, key)
  }
}

export type SubscriberParams<T> = {
  bzz: Bzz,
  feed: FeedParams,
  interval?: ?number,
  transform?: (data: Object) => T,
}

export const createSubscriber = <T: any>(
  params: SubscriberParams<T>,
): Observable<T> => {
  const transform = params.transform || identity

  return params.bzz
    .pollFeedValue(params.feed, {
      interval: params.interval || DEFAULT_POLL_INTERVAL,
      mode: 'content-hash',
      whenEmpty: 'ignore',
      contentChangedOnly: true,
    })
    .pipe(
      flatMap(async (hash: string) => {
        const res = await params.bzz.download(hash, { mode: 'raw' })
        const data = await res.json()
        return transform(data)
      }),
    )
}
