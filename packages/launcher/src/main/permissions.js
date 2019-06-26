// @flow

import url from 'url'
import { type Session } from 'electron'
// TODO: replace this usage
import { checkPermission } from '@mainframe/app-permissions'
import type { PermissionKey } from '@mainframe/app-permissions'
import fileUrl from 'file-url'

import type { AppContext } from './context/app'

export const userDeniedError = (key: PermissionKey) => {
  return new Error(`User denied permission: ${key}`)
}

export const interceptWebRequests = (
  context: AppContext,
  webviewSession: Session,
) => {
  const appUrl = fileUrl(context.appSession.app.contentsPath)
  const appPath = url.parse(appUrl).path
  webviewSession.webRequest.onBeforeRequest([], async (request, callback) => {
    const urlParts = url.parse(request.url)

    // Allowing devtools requests

    if (urlParts.protocol === 'chrome-devtools:') {
      callback({ cancel: false })
      return
    }

    // Allowing files loaded from apps contents

    if (urlParts.protocol === 'file:') {
      if (urlParts.path && appPath && urlParts.path.startsWith(appPath)) {
        // Loading app contents
        callback({ cancel: false })
        return
      } else {
        // silently cancel all other file type requests
        callback({ cancel: true })
        return
      }
    }

    const key = 'WEB_REQUEST'
    const permissions = context.appSession.session.permissions.session

    const notifyCancelled = (domain: string) => {
      context.notifyPermissionDenied({ key, domain: domain })
    }

    const domain = urlParts.host
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
          const res = await context.trustedRPC.request('user_request', {
            key,
            domain,
          })
          granted = res.granted ? 'granted' : 'denied'
          if (res.persist && !permissions[key][granted].includes(domain)) {
            // Grant for session
            permissions[key][granted].push(domain)
            if (res.persist === 'always') {
              // Grant for future sessions
              await context.client.app.setPermission({
                sessID: context.appSession.session.sessID,
                key,
                value: permissions[key],
              })
            }
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
  })
}

export const isGranted = async (
  key: PermissionKey,
  ctx: AppContext,
  params?: string | Object,
) => {
  const permissions = ctx.appSession.session.permissions.session
  let granted = checkPermission(permissions, key)
  // Always request permission for transaction signing
  if (
    granted === 'not_set' ||
    key === 'BLOCKCHAIN_SEND' ||
    key === 'BLOCKCHAIN_SIGN'
  ) {
    const askParams = { [key]: params }
    const res = await ctx.trustedRPC.request('user_request', {
      key,
      params: askParams,
    })

    if (res.persist) {
      // Grant for session
      permissions[key] = res.granted
      if (res.persist === 'always') {
        // Grant for future sessions
        await ctx.client.app.setPermission({
          sessID: ctx.appSession.session.sessID,
          key,
          value: res.granted,
        })
      }
    }
    granted = res.granted ? 'granted' : 'denied'
  }
  return granted
}

export const withPermission = (
  key: PermissionKey,
  handler: (ctx: AppContext, params: Object) => Promise<any>,
) => {
  return async (ctx: AppContext, params: Object) => {
    const granted = await isGranted(key, ctx, params)
    switch (granted) {
      case 'granted':
        return await handler(ctx, params)
      case 'denied': {
        ctx.notifyPermissionDenied({ key })
        throw userDeniedError(key)
      }
      case 'unknown':
      default:
        throw new Error(`Unknown permission: ${key}`)
    }
  }
}
