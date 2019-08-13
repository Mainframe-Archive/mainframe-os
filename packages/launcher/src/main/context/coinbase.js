// @flow

import type { BrowserWindow } from 'electron'

import type { Logger } from '../logger'

export type ContextParams = {
  logger: Logger,
  window: BrowserWindow,
}

export class CoinbaseContext {
  logger: Logger
  window: BrowserWindow

  constructor(params: ContextParams) {
    this.logger = params.logger.child({ context: 'coinbase' })
    this.window = params.window
  }

  showWindow() {
    if (this.window.isMinimized()) {
      this.window.restore()
    }
    this.window.show()
  }
}
