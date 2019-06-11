// @flow

import type Bzz from '@erebos/api-bzz-node'
import type { BrowserWindow } from 'electron'

import type { UserDoc } from '../db/collections/users'
import type { UserAppVersionDoc } from '../db/collections/userAppVersions'
import type { DB } from '../db/types'
import type { Logger } from '../logger'

import type { SystemContext } from './system'

export type ContextParams = {
  db: DB,
  logger: Logger,
  system: SystemContext,
  userAppVersion: UserAppVersionDoc,
  window: BrowserWindow,
}

export class AppContext {
  _bzz: ?Bzz
  db: DB
  logger: Logger
  system: SystemContext
  userAppVersion: UserAppVersionDoc
  window: BrowserWindow

  constructor(params: ContextParams) {
    this.db = params.db
    this.logger = params.logger.child({
      userAppVersionID: params.userAppVersion.localID,
      userID: params.userAppVersion.user,
    })
    this.system = params.system
    this.userAppVersion = params.userAppVersion
    this.window = params.window
  }

  async getUser(): Promise<UserDoc> {
    return await this.userAppVersion.populate('user').exec()
  }

  async getBzz(): Promise<Bzz> {
    if (this._bzz == null) {
      const user = await this.getUser()
      this._bzz = user.getBzz()
    }
    return this._bzz
  }
}
