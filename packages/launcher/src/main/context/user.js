// @flow

import type Bzz from '@erebos/api-bzz-node'

import type { DB } from '../db/types'
import type { Logger } from '../logger'

export type ContextParams = {
  db: DB,
  logger: Logger,
  userID: string,
}

export class UserContext {
  _bzz: ?Bzz
  db: DB
  logger: Logger
  userID: string

  constructor(params: ContextParams) {
    this.db = params.db
    this.logger = params.logger.child({ userID: params.userID })
    this.userID = params.userID
    // TODO: handle subscriptions to Swarm / creation of the first contact feed as needed
  }

  async getUser(): Promise<Object> {
    return await this.db.users.findOne(this.userID).exec()
  }

  async getBzz(): Promise<Bzz> {
    if (this._bzz == null) {
      const user = await this.getUser()
      this._bzz = user.getBzz()
    }
    return this._bzz
  }
}
