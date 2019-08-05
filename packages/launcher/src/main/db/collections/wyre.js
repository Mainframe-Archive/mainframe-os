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
        const dump = db.wyre.find()
        const exec = await dump.exec()
        if (exec[0]) {
          const tok = exec[0].get('deviceToken')
          return tok
        } else {
          const newID = uuidv4()
          const update = await db.wyre.insert({
            name: 'singleToken',
            deviceToken: newID,
          })
          return newID
        }
      },
    },
    statics: {},
  })
}
