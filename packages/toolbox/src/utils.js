// @flow

import type { EventEmitter } from 'events'

export const onDataMatch = (
  emitter: EventEmitter,
  lookup: string,
  callback: (match: string) => any,
) => {
  const match = lookup.toLowerCase()
  const listener = (chunk: Buffer) => {
    const str = chunk.toString().toLowerCase()
    if (str.includes(match)) {
      callback(str)
    }
  }
  emitter.on('data', listener)
  return () => {
    emitter.off('data', listener)
  }
}
