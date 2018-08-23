// @flow
import url from 'url'
import { session, BrowserWindow, webContents } from 'electron'
import type Client from '@mainframe/client'
import { checkPermission } from '@mainframe/app-permissions'
import type { PermissionKey } from '@mainframe/app-permissions'

import type { AppSessions } from '../types'
import type { SandboxedContext } from './rpc/sandboxed'
import request, { notifyApp } from './mainToAppRequest'

const sanitizeDomain = (domain: string) => {
  // Removes www.
  if (domain && domain.startsWith('www.')) {
    domain = domain.slice(4, domain.length)
  }
  return domain
}

export const interceptWebRequests = (
  client: Client,
  appSessions: AppSessions,
) => {
  session.defaultSession.webRequest.onBeforeRequest(
    [],
    async (request, callback) => {
      const requestUrl = url.parse(request.url, true)
      if (
        requestUrl.hostname === 'localhost' ||
        requestUrl.protocol === 'chrome-devtools:'
      ) {
        callback({ cancel: false })
        return
      }
      const domain = sanitizeDomain(requestUrl.host)
      const reqWebContents = webContents.fromId(request.webContentsId)
      const window = BrowserWindow.fromWebContents(
        reqWebContents.hostWebContents,
      )
      const appSession = appSessions[window]
      const permissions = appSession.session.permissions.session

      if (requestUrl.protocol === 'file:' && appSession) {
        const appPath = encodeURI(appSession.app.contentsPath)
        if (requestUrl.path && requestUrl.path.startsWith(appPath)) {
          // Loading app contents
          callback({ cancel: false })
          return
        }
      }
      const key = 'WEB_REQUEST'
      let shouldCancel = true
      try {
        let granted = checkPermission(permissions, key, domain)
        switch (granted) {
          case 'denied':
            break
          case 'granted':
            shouldCancel = false
            break
          case 'not_set':
          default: {
            const res = await askPermission(window, key, domain)
            const urlSessionGrants = appSession.session.permissions.session[key]
            granted = res.granted ? 'granted' : 'denied'
            urlSessionGrants[granted].push(domain)
            if (res.persist) {
              await client.app.setPermission({
                sessID: appSession.session.sessID,
                key,
                value: urlSessionGrants,
              })
            }
            shouldCancel = !res.granted
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(err)
      }
      // Alert user
      if (shouldCancel) {
        notifyApp(window.webContents, {
          type: 'permission-denied',
          data: {
            key,
            input: domain,
          },
        })
      }
      callback({ cancel: shouldCancel })
    },
  )
}

export const withPermission = (
  key: PermissionKey,
  handler: (ctx: SandboxedContext, params: any) => Promise<any>,
) => {
  return async (ctx: Object, params: Object) => {
    const permissions = ctx.appSession.session.permissions.session
    let granted = checkPermission(permissions, key)
    if (granted === 'not_set') {
      // Sender is the Webview, need to send request to containing window
      const window = ctx.sender.getOwnerBrowserWindow()
      const res = await askPermission(window, key)
      if (key !== 'WEB_REQUEST') {
        // To satisfy flow, will never be a WEB_REQUEST permission, they are handled separately
        ctx.appSession.session.permissions.session[key] = res.granted
      }
      if (res.persist) {
        await ctx.client.app.setPermission({
          sessID: ctx.appSession.session.sessID,
          key,
          value: res.granted,
        })
      }
      granted = res.granted ? 'granted' : 'denied'
    }
    switch (granted) {
      case 'granted':
        return await handler(ctx, params)
      case 'denied':
        throw new Error(`User denied permission: ${key}`)
      case 'unknown':
      default:
        throw new Error(`Unknown permission: ${key}`)
    }
  }
}

const askPermission = async (
  webContents: BrowserWindow,
  key: string,
  input?: any,
): Promise<{
  granted: boolean,
  persist?: boolean,
}> => {
  return await request(webContents, 'permissions-ask', [key, input])
}
