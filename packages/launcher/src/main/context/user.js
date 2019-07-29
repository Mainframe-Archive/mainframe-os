// @flow

import type Bzz from '@erebos/api-bzz-node'

import type { UserDoc } from '../db/collections/users'
import type { DB } from '../db/types'
import type { Logger } from '../logger'

import type { SystemContext } from './system'

export type ContextParams = {
  db: DB,
  system: SystemContext,
  userID: string,
}

export class UserContext {
  _bzz: ?Bzz
  db: DB
  logger: Logger
  system: SystemContext
  userID: string

  constructor(params: ContextParams) {
    this.db = params.db
    this.logger = params.system.logger.child({ userID: params.userID })
    this.system = params.system
    this.userID = params.userID
  }

  async getUser(): Promise<UserDoc> {
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
