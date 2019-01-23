// @flow

import type { Observable } from 'rxjs'

export type SubscriptionIterator<T> = AsyncIterator<T> & {
  return: () => Promise<void>,
}

// Adapted from https://github.com/graphql/graphql-js/blob/master/src/subscription/__tests__/eventEmitterAsyncIterator.js
const observableToAsyncIterator = <T>(
  observable: Observable<T>,
): AsyncIterator<T> => {
  const pullQueue = []
  const pushQueue = []
  let listening = true

  const subscription = observable.subscribe((value: T) => {
    if (pullQueue.length !== 0) {
      pullQueue.shift()({ value, done: false })
    } else {
      pushQueue.push(value)
    }
  })

  const pullValue = () => {
    return new Promise(resolve => {
      if (pushQueue.length !== 0) {
        const value = pushQueue.shift()
        resolve({ value, done: false })
      } else {
        pullQueue.push(resolve)
      }
    })
  }

  const emptyQueue = () => {
    if (listening) {
      listening = false
      subscription.unsubscribe()
      for (const resolve of pullQueue) {
        resolve({ value: undefined, done: true })
      }
      pullQueue.length = 0
      pushQueue.length = 0
    }
  }

  // $FlowFixMe: AsyncIterator support
  return {
    // $FlowFixMe: AsyncIterator support
    [Symbol.asyncIterator]() {
      return this
    },
    next() {
      return listening ? pullValue() : this.return()
    },
    return() {
      emptyQueue()
      return Promise.resolve({ value: undefined, done: true })
    },
    throw(error) {
      emptyQueue()
      return Promise.reject(error)
    },
  }
}

export default observableToAsyncIterator
