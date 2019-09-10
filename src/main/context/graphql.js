// @flow

import type { UserDoc } from '../db/collections/users'
import type { CollectionKey, Collections, DB } from '../db/types'
import type { Logger } from '../logger'

import type { SystemContext } from './system'
import type { UserContext } from './user'

export type ContextParams = {
  db: DB,
  logger: Logger,
  system: SystemContext,
  user: UserContext,
}

export class GraphQLContext {
  db: DB
  logger: Logger
  system: SystemContext
  user: UserContext

  constructor(params: ContextParams) {
    this.db = params.db
    this.logger = params.logger.child({ context: 'graphql' })
    this.system = params.system
    this.user = params.user
  }

  get userID(): string {
    return this.user.userID
  }

  async getUser(): Promise<UserDoc> {
    return await this.user.getUser()
  }

  async getDoc<K: CollectionKey>(
    collectionKey: K,
    id: string,
  ): Promise<$ElementType<$ElementType<Collections, K>, '_docType'> | null> {
    const collection = this.db[collectionKey]
    if (collection == null) {
      throw new Error(`Invalid collection: ${collectionKey}`)
    }
    return await collection.findOne(id).exec()
  }
}
