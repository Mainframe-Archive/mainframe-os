// @flow

import type { BrowserWindow } from 'electron'

import type { Config } from '../config'
import type { DB } from '../db'
import type { Logger } from '../logger'
import type { SystemContext } from './system'

export type ContextParams = {
  system: SystemContext,
  userID: ?string,
  window: BrowserWindow,
}

export class LauncherContext {
  logger: Logger
  system: SystemContext
  userID: ?string
  window: BrowserWindow

  constructor(params: ContextParams) {
    // $FlowFixMe: type def
    this.logger = params.system.logger.child({
      context: `launcher-${params.window.id}`,
    })
    this.system = params.system
    this.userID = params.userID
    this.window = params.window
  }

  get config(): Config {
    return this.system.config
  }

  get db(): ?DB {
    return this.system.db
  }
}
