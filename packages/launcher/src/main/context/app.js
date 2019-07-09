// @flow

import { join } from 'path'
import { format } from 'url'
import StreamRPC from '@mainframe/rpc-stream'
import type { BrowserWindow, WebContents } from 'electron'
import fileURL from 'file-url'
import type { Subscription } from 'rxjs'

import {
  APP_SANDBOXED_CHANNEL,
  APP_TRUSTED_CHANNEL,
  APP_TRUSTED_REQUEST_CHANNEL,
} from '../../constants'
import type { AppData, AppWindowSession } from '../../types'

import type { UserAppSettingsDoc } from '../db/collections/userAppSettings'
import type { UserDoc } from '../db/collections/users'
import type { WebDomainsDefinitions } from '../db/schemas/appManifest'
import type { Logger } from '../logger'
import { ElectronTransport } from '../rpc/ElectronTransport'

import type { SystemContext } from './system'

const PERMISSION_DENIED_METHOD = 'permission_denied'

export type AppSessionParams = {
  app: AppData,
  isDevelopment: boolean,
  settings: UserAppSettingsDoc,
  user: UserDoc,
}

export class AppSession {
  static async fromUserAppVersion(
    system: SystemContext,
    userAppVersionID: string,
  ): Promise<AppSession> {
    if (system.db == null) {
      throw new Error('Database must be opened')
    }

    const userAppVersion = await system.db.user_app_versions
      .findOne(userAppVersionID)
      .exec()
    if (userAppVersion == null) {
      throw new Error('UserAppVersion not found')
    }

    const [app, settings, user] = await Promise.all([
      userAppVersion.getAppData(),
      userAppVersion.populate('settings'),
      userAppVersion.populate('user'),
    ])

    return new AppSession({
      app,
      isDevelopment: false,
      settings,
      user,
    })
  }

  static async fromUserOwnApp(
    system: SystemContext,
    userOwnAppID: string,
  ): Promise<AppSession> {
    if (system.db == null) {
      throw new Error('Database must be opened')
    }

    const userOwnApp = await system.db.user_own_apps
      .findOne(userOwnAppID)
      .exec()
    if (userOwnApp == null) {
      throw new Error('UserOwnApp not found')
    }

    const [app, settings, user] = await Promise.all([
      userOwnApp.getAppData(),
      userOwnApp.populate('settings'),
      userOwnApp.populate('user'),
    ])

    return new AppSession({
      app,
      isDevelopment: true,
      settings,
      user,
    })
  }

  app: AppData
  contentsURL: string
  isDevelopment: boolean
  publicID: string
  settings: UserAppSettingsDoc
  user: UserDoc

  constructor(params: AppSessionParams) {
    this.app = params.app
    this.contentsURL = fileURL(params.app.contentsPath)
    this.settings = params.settings
    this.user = params.user
  }

  toAppWindowSession(): AppWindowSession {
    return {
      app: {
        contentsURL: format({
          pathname: join(this.app.contentsPath, 'index.html'),
          protocol: 'file:',
          slashes: true,
        }),
        profile: this.app.profile,
        publicID: this.app.publicID,
      },
      isDevelopment: this.isDevelopment,
      partition: `persist:${this.app.publicID}/${this.user.localID}`,
      user: {
        id: this.user.localID,
        profile: this.user.profile,
      },
      webDomains: this.settings.webDomains,
    }
  }
}

export type ContextParams = {
  session: AppSession,
  system: SystemContext,
  window: BrowserWindow,
}

export class AppContext {
  _permissionDeniedID: ?string
  _subscriptions: { [id: string]: Subscription }
  logger: Logger
  sandbox: ?WebContents
  session: AppSession
  system: SystemContext
  trustedRPC: StreamRPC
  window: BrowserWindow

  constructor(params: ContextParams) {
    this.logger = params.system.logger.child({
      context: 'app',
      userID: params.session.user.localID,
    })
    this.session = params.session
    this.system = params.system
    this.trustedRPC = new StreamRPC(
      new ElectronTransport(params.window, APP_TRUSTED_REQUEST_CHANNEL),
    )
    this.window = params.window
    this.logger.debug('App context created')
  }

  handleSandboxWebRequest = async (request, callback) => {
    try {
      const url = new URL(request.url)

      // Allowing devtools requests
      if (url.protocol === 'chrome-devtools:') {
        callback({ cancel: false })
        return
      }

      // Allowing files loaded from apps contents
      if (url.protocol === 'file:') {
        const isValidPath =
          url.href != null && url.href.startsWith(this.session.contentsURL)
        callback({ cancel: !isValidPath })
        return
      }

      // Check domain validity
      const domain = url.host
      if (domain == null || domain.length === 0) {
        this.notifyPermissionDenied({ key: 'WEB_REQUEST', domain })
        callback({ cancel: true })
        return
      }

      // Check if already granted or denied
      const grant = this.session.settings.webDomains.find(
        w => w.domain === domain,
      )
      if (grant == null || grant.internal === false) {
        // Unknown domain or grant defied
        this.notifyPermissionDenied({ key: 'WEB_REQUEST', domain })
        callback({ cancel: true })
        return
      }

      if (grant.internal === true) {
        // Granted
        callback({ cancel: false })
        return
      }

      // Ask user for grant
      const res = await this.trustedRPC.request('user_request', {
        key: 'WEB_REQUEST',
        domain,
      })
      if (res.persist && grant == null) {
        // Grant for session
        this.session.settings.webDomains.push({ domain, internal: res.granted })
        if (res.persist === 'always') {
          // Grant for future sessions
          await this.session.settings.setWebDomainGrant({
            domain,
            internal: res.granted,
          })
        }
      }

      if (res.granted) {
        callback({ cancel: false })
      } else {
        this.notifyPermissionDenied({ key: 'WEB_REQUEST', domain })
        callback({ cancel: true })
      }
    } catch (err) {
      this.logger.log({
        level: 'error',
        message: 'Failed to handle sandbox Web request',
        error: err.toString(),
        request,
      })
      callback({ cancel: true })
    }
  }

  attachSandbox(sandbox: WebContents) {
    this.sandbox = sandbox
    sandbox.session.webRequest.onBeforeRequest([], this.handleSandboxWebRequest)
  }

  showWindow() {
    if (this.window.isMinimized()) {
      this.window.restore()
    }
    this.window.show()
  }

  notifyTrusted(method: string, id: string, result?: Object = {}) {
    this.logger.log({
      level: 'debug',
      message: 'Notify trusted channel',
      method,
      id,
      result,
    })
    this.window.send(APP_TRUSTED_CHANNEL, {
      jsonrpc: '2.0',
      method,
      params: { subscription: id, result },
    })
  }

  notifyPermissionDenied(permission: { key: string, domain?: string }) {
    const id = this._permissionDeniedID
    if (id == null) {
      this.logger.log({
        level: 'warn',
        message: 'Could not notify of permission denied: no subscription set',
        permission,
      })
    } else {
      this.notifyTrusted(PERMISSION_DENIED_METHOD, id, permission)
    }
  }

  notifySandboxed(method: string, id: string, result?: Object = {}) {
    const sandbox = this.sandbox
    if (sandbox == null) {
      this.logger.log({
        level: 'warn',
        message: 'No sandbox to notify',
        method,
        id,
        result,
      })
    } else {
      this.logger.log({
        level: 'debug',
        message: 'Notify sandbox channel',
        method,
        id,
        result,
      })
      sandbox.send(APP_SANDBOXED_CHANNEL, {
        jsonrpc: '2.0',
        method,
        params: { subscription: id, result },
      })
    }
  }

  addSubscription(id: string, subscription: Subscription): void {
    this._subscriptions[id] = subscription
  }

  setPermissionDeniedSubscription(
    id: string,
    subscription: Subscription,
  ): void {
    this.addSubscription(id, subscription)
    this._permissionDeniedID = id
  }

  removeSubscription(id: string): void {
    const sub = this._subscriptions[id]
    if (sub != null) {
      sub.unsubscribe()
      delete this._subscriptions[id]
    }
  }

  clear() {
    // $FlowFixMe: Object.values() losing type
    Object.values(this._subscriptions).forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this._subscriptions = {}
  }
}
