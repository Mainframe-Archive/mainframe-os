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
  const transform = params.transform || identity
  return async (data: T): Promise<string> => {
    return await params.feed.publishJSON(params.bzz, transform(data))
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
