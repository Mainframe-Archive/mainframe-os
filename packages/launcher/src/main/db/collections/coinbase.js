// @flow

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams } from '../types'

import schema, { type CoinbaseData } from '../schemas/coinbase'

type CoinbaseMethods = {|
  subscribeToCoinbaseState(): void,
  getState(): Promise<string>,
  setState(state: string): Promise<void>,
|}

export type CoinbaseDoc = CoinbaseData & CoinbaseMethods

export type CoinbaseCollection = Collection<CoinbaseData, CoinbaseDoc>

export default async (
  params: CollectionParams,
): Promise<CoinbaseCollection> => {
  const db = params.db

  return await db.collection<CoinbaseData, CoinbaseDoc, CoinbaseMethods, {}>({
    name: COLLECTION_NAMES.COINBASE,
    schema,
    statics: {},
    methods: {
      subscribeToCoinbaseState() {
        db.coinbase.$.subscribe(changeEvent => console.log(changeEvent))
      },
      async getState(): Promise<string> {
        const dump = db.coinbase.find()
        const exec = await dump.exec()
        const state = exec[0].get('state')
        return state
      },
      async setState(newState: string): Promise<void> {
        const dump = db.coinbase.find()
        const exec = await dump.exec()
        const update = await db.coinbase.insert({
          name: 'state',
          state: newState,
        })
      },
    },
  })
}
