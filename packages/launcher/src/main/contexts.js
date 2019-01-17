// @flow

import type Client, { AppOpenResult } from '@mainframe/client'
import type { VaultConfig } from '@mainframe/config'
import type StreamRPC from '@mainframe/rpc-stream'
import { uniqueID } from '@mainframe/utils-id'
import type { BrowserWindow, WebContents } from 'electron'

import type { AppSession } from '../types'

import {
  APP_SANDBOXED_CHANNEL,
  APP_TRUSTED_CHANNEL,
  LAUNCHER_CHANNEL,
} from '../constants'

export type LaunchAppFunc = (data: AppOpenResult) => Promise<void>

export class ContextSubscription<T = ?mixed> {
  _id: string
  _method: string
  data: ?T

  constructor(method: string, data?: T) {
    this._id = uniqueID()
    this._method = method
    this.data = data
  }

  get id(): string {
    return this._id
  }

  get method(): string {
    return this._method
  }

  async dispose() {}
}

export class Context {
  client: Client
  window: BrowserWindow
  _subscriptions: { [string]: ContextSubscription<any> } = {}

  async clear() {
    const disposeSubs = Object.values(this._subscriptions).map(sub => {
      // $FlowFixMe: Object.values() losing type
      return sub.dispose()
    })
    await Promise.all(disposeSubs)
  }

  setSubscription(sub: ContextSubscription<any>): void {
    this._subscriptions[sub.id] = sub
  }

  createSubscription<T: ?mixed>(
    method: string,
    data?: T,
  ): ContextSubscription<T> {
    const sub = new ContextSubscription(method, data)
    this.setSubscription(sub)
    return sub
  }

  removeSubscription(id: string) {
    const sub = this._subscriptions[id]
    if (sub != null) {
      sub.dispose()
      delete this._subscriptions[id]
    }
  }
}

export type AppContextParams = {
  appSession: AppSession,
  client: Client,
  trustedRPC: StreamRPC,
  window: BrowserWindow,
}

export class AppContext extends Context {
  appSession: AppSession
  sandbox: ?WebContents
  trustedRPC: StreamRPC
  _permissionDeniedID: ?string

  constructor(params: AppContextParams) {
    super()
    this.appSession = params.appSession
    this.client = params.client
    this.trustedRPC = params.trustedRPC
    this.window = params.window
  }

  notifyTrusted(id: string, result?: Object = {}) {
    const sub = this._subscriptions[id]
    if (sub != null) {
      this.window.send(APP_TRUSTED_CHANNEL, {
        jsonrpc: '2.0',
        method: sub.method,
        params: { subscription: id, result },
      })
    }
  }

  notifySandboxed(id: string, result?: Object = {}) {
    if (this.sandbox == null) {
      console.warn('No sandbox to notify') // eslint-disable-line no-console
    } else {
      const sub = this._subscriptions[id]
      if (sub != null) {
        this.sandbox.send(APP_SANDBOXED_CHANNEL, {
          jsonrpc: '2.0',
          method: sub.method,
          params: { subscription: id, result },
        })
      }
    }
  }

  createPermissionDeniedSubscription(): string {
    if (this._permissionDeniedID != null) {
      this.removeSubscription(this._permissionDeniedID)
    }
    const sub = this.createSubscription('permission_denied')
    this._permissionDeniedID = sub.id
    return sub.id
  }

  notifyPermissionDenied(result: Object) {
    if (this._permissionDeniedID != null) {
      this.notifyTrusted(this._permissionDeniedID, result)
    }
  }
}

export type LauncherContextParams = {
  client: Client,
  launchApp: LaunchAppFunc,
  vaultConfig: VaultConfig,
  window: BrowserWindow,
}

export class LauncherContext extends Context {
  launchApp: LaunchAppFunc
  vaultConfig: VaultConfig
  vaultOpen: ?string

  constructor(params: LauncherContextParams) {
    super()
    this.client = params.client
    this.launchApp = params.launchApp
    this.vaultConfig = params.vaultConfig
    this.window = params.window
  }

  notify(id: string, result?: Object = {}) {
    const sub = this._subscriptions[id]
    if (sub != null) {
      this.window.send(LAUNCHER_CHANNEL, {
        jsonrpc: '2.0',
        method: sub.method,
        params: { subscription: id, result },
      })
    }
  }
}
