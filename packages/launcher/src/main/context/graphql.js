// @flow

import type { Collection, DB } from '../db/types'
import type { Logger } from '../logger'

export type ContextParams = {
  db: DB,
  logger: Logger,
  userID: string,
}

export class GraphQLContext {
  db: DB
  logger: Logger
  userID: string

  constructor(params: ContextParams) {
    this.db = params.db
    this.logger = params.logger.child({ userID: params.userID })
    this.userID = params.userID
  }

  async getDoc(collection: Collection, id: string): Promise<Object | null> {
    if (this.db[collection] == null) {
      throw new Error(`Invalid collection: ${collection}`)
    }
    return await this.db[collection].findOne(id).exec()
  }

  async getUser(): Promise<Object> {
    return await this.db.users.findOne(this.userID).exec()
  }
}
