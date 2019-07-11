// @flow

import type { BrowserWindow } from 'electron'

import type { UserDoc } from '../db/collections/users'
import type { DB } from '../db/types'
import type { Logger } from '../logger'

export type ContextParams = {
  db: DB,
  logger: Logger,
  window: BrowserWindow,
}

export class WyreContext {
  db: DB
  logger: Logger
  window: BrowserWindow

  constructor(params: ContextParams) {
    this.db = params.db
    this.logger = params.logger.child({ userID: params.userID })
    this.window = params.window
  }

  showWindow() {
    if (this.window.isMinimized()) {
      this.window.restore()
    }
    this.window.show()
  }

  getToken(): string {
    // console.log(this.db.wyre_device_token)
    // console.log(this.db.wyre_device_token.getToken())

    return this.db.wyre_device_token.getToken()
  }
}
