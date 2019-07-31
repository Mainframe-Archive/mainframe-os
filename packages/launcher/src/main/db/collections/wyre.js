// @flow

import uuidv4 from 'uuid/v4'
import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams, Populate } from '../types'

import schema from '../schemas/wyreDeviceToken'

// type WyreMethods = {|
//   getToken(): string,
// |}
//
// export type WyreData = { deviceToken: ?string }
//
// export type WyreDoc = WyreData & WyreMethods
//
// export type WyreCollection = Collection<WyreData, WyreDoc>

export default async (params: CollectionParams) => {
  const db = params.db

  return await db.collection({
    name: COLLECTION_NAMES.WYRE,
    schema,
    methods: {
      async getToken(): string {
        // if (db.wyre.deviceToken == null) {
        const newID = uuidv4()
        const update = await db.wyre.insert({ deviceToken: newID })
        return newID
        // } else {
        //   return db.wyre
        // }
      },
    },
    statics: {},
  })
}
