// @flow
import url from 'url'
import { session, BrowserWindow, webContents } from 'electron'
import type Client from '@mainframe/client'
import { checkPermission } from '@mainframe/app-permissions'
import type { PermissionKey } from '@mainframe/app-permissions'

import type { ActiveApps } from '../types'
import type { SandboxedContext } from './rpc/sandboxed'
import { notifyApp } from './electronMainRPC'

const sanitizeDomain = (domain?: string) => {
  // Removes www.
  if (domain && domain.startsWith('www.')) {
    domain = domain.slice(4, domain.length)
  }
  return domain
}

export const interceptWebRequests = (
  client: Client,
  activeApps: ActiveApps,
) => {
  session.defaultSession.webRequest.onBeforeRequest(
    [],
    async (request, callback) => {
      const urlParts = url.parse(request.url, true)

      if (
        urlParts.hostname === 'localhost' ||
        urlParts.protocol === 'chrome-devtools:'
      ) {
        callback({ cancel: false })
        return
      }
      const key = 'WEB_REQUEST'
      const appWebContents = webContents.fromId(request.webContentsId)
      const appContainer = appWebContents.hostWebContents
      const window = BrowserWindow.fromWebContents(appContainer)
      const activeApp = activeApps[window]
      const permissions = activeApp.appSession.session.permissions.session

      if (urlParts.protocol === 'file:' && activeApp) {
        const appPath = encodeURI(activeApp.appSession.app.contentsPath)
        if (urlParts.path && urlParts.path.startsWith(appPath)) {
          // Loading app contents
          callback({ cancel: false })
          return
        }
      }

      const notifyCancelled = (domain: string) =>
        notifyApp(window, {
          type: 'permission-denied',
          data: {
            key,
            input: domain,
          },
        })

      const domain = sanitizeDomain(urlParts.host)
      if (!domain) {
        notifyCancelled(request.url)
        callback({ cancel: true })
        return
      }
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
            const res = await activeApp.rpc.request('permissionsAsk', {
              key,
              input: domain,
            })
            granted = res.granted ? 'granted' : 'denied'
            permissions[key][granted].push(domain)
            if (res.persist) {
              await client.app.setPermission({
                sessID: activeApp.appSession.session.sessID,
                key,
                value: permissions[key],
              })
            }
            shouldCancel = !res.granted
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(err)
      }
      if (shouldCancel) {
        notifyCancelled(domain)
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
    const permissions = ctx.app.appSession.session.permissions.session
    let granted = checkPermission(permissions, key)
    if (granted === 'not_set') {
      const res = await ctx.app.rpc.request('permissionsAsk', { key })
      if (key !== 'WEB_REQUEST') {
        // To satisfy flow, will never be a WEB_REQUEST permission, they are handled separately
        permissions[key] = res.granted
      }
      if (res.persist) {
        await ctx.client.app.setPermission({
          sessID: ctx.app.appSession.session.sessID,
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
