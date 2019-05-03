// @flow

import type { Collection, DB } from '../db/types'
import type { Logger } from '../logger'

import type { UserContext } from './user'

export type ContextParams = {
  db: DB,
  logger: Logger,
  user: UserContext,
}

export class GraphQLContext {
  db: DB
  logger: Logger
  user: UserContext

  constructor(params: ContextParams) {
    this.db = params.db
    this.logger = params.logger.child({ context: 'graphql' })
    this.user = params.user
  }

  get userID(): string {
    return this.user.userID
  }

  async getUser(): Promise<Object> {
    return await this.user.getUser()
  }

  async getDoc(collection: Collection, id: string): Promise<Object | null> {
    if (this.db[collection] == null) {
      throw new Error(`Invalid collection: ${collection}`)
    }
    return await this.db[collection].findOne(id).exec()
  }
}
