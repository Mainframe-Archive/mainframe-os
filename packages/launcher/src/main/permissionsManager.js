// @flow
import url from 'url'
import { session, BrowserWindow, webContents } from 'electron'
import type Client from '@mainframe/client'
import { checkPermission } from '@mainframe/app-permissions'
import type { PermissionKey } from '@mainframe/app-permissions'

import type { ClientResponse, RequestContext } from '../types'
import request, { notifyApp } from './mainToAppRequest'
import { type AppSessions } from './index'

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
      const whitelistedDomains = ['localhost', 'devtools']
      if (
        whitelistedDomains.includes(requestUrl.hostname) ||
        requestUrl.protocol === 'file:'
      ) {
        callback({ cancel: false })
        return
      }
      if (!requestUrl.host) {
        callback({ cancel: true })
        return
      }
      const domain = sanitizeDomain(requestUrl.host)
      const reqWebContents = webContents.fromId(request.webContentsId)
      const window = BrowserWindow.fromWebContents(
        reqWebContents.hostWebContents,
      )
      const appSession = appSessions[window]
      const permissions = appSession.session.permissions.session
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
              await client.setAppPermission(
                appSession.session.id,
                key,
                urlSessionGrants,
              )
            }
            shouldCancel = !res.granted
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(err)
      }
      // Alert user
      notifyApp(window.webContents, {
        type: 'permission-denied',
        data: {
          key,
          input: domain,
        },
      })
      callback({ cancel: shouldCancel })
    },
  )
}

export const withPermission = async (
  key: PermissionKey,
  ctx: RequestContext,
  handler: () => Promise<any>,
): Promise<ClientResponse> => {
  const permissions = ctx.appSession.session.permissions.session
  let granted = checkPermission(permissions, key)
  if (granted === 'not_set') {
    const res = await askPermission(ctx.window, key)
    if (key !== 'WEB_REQUEST') {
      // To satisfy flow, will never be a WEB_REQUEST permission, they are handled separately
      ctx.appSession.session.permissions.session[key] = res.granted
    }
    if (res.persist) {
      ctx.client.setAppPermission(ctx.appSession.session.id, key, res.granted)
    }
    granted = res.granted ? 'granted' : 'denied'
  }
  switch (granted) {
    case 'granted':
      return await handler()
    case 'denied':
      throw new Error(`User denied permission: ${key}`)
    case 'unknown':
    default:
      throw new Error(`Unknown permission: ${key}`)
  }
}

const askPermission = async (
  appWindow: BrowserWindow,
  key: string,
  input?: any,
): Promise<{
  granted: boolean,
  persist?: boolean,
}> => {
  return await request(appWindow.webContents, 'permissions-ask', [key, input])
}
