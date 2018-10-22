// @flow
import url from 'url'
import { checkPermission } from '@mainframe/app-permissions'
import type { PermissionKey } from '@mainframe/app-permissions'
import type { EthTransactionParams } from '@mainframe/client'
import type { AppContext } from './contexts'

export const userDeniedError = (key: PermissionKey) => {
  return new Error(`User denied permission: ${key}`)
}

export const interceptWebRequests = (context: AppContext) => {
  context.window.webContents.session.webRequest.onBeforeRequest(
    [],
    async (request, callback) => {
      const urlParts = url.parse(request.url)

      // Allowing localhost and devtools requests

      if (
        urlParts.hostname === 'localhost' ||
        urlParts.protocol === 'chrome-devtools:'
      ) {
        callback({ cancel: false })
        return
      }

      // Allowing files loaded from apps contents

      if (urlParts.protocol === 'file:') {
        const appPath = encodeURI(context.appSession.app.contentsPath)
        if (urlParts.path && urlParts.path.startsWith(appPath)) {
          // Loading app contents
          callback({ cancel: false })
          return
        }
      }

      const key = 'WEB_REQUEST'
      const permissions = context.appSession.session.permissions.session

      const notifyCancelled = (domain: string) => {
        context.notifyPermissionDenied({ key, input: domain })
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
            const res = await context.trustedRPC.request('permission_ask', {
              key,
              input: domain,
            })
            granted = res.granted ? 'granted' : 'denied'
            permissions[key][granted].push(domain)
            if (res.persist) {
              await context.client.app.setPermission({
                sessID: context.appSession.session.sessID,
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

export const isGranted = async (key: PermissionKey, ctx: AppContext) => {
  const permissions = ctx.appSession.session.permissions.session
  let granted = checkPermission(permissions, key)
  if (granted === 'not_set') {
    const res = await ctx.trustedRPC.request('permission_ask', { key })
    if (key !== 'WEB_REQUEST') {
      // To satisfy flow, will never be a WEB_REQUEST permission, they are handled separately
      permissions[key] = res.granted
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
}

export const requestTransactionPermission = async (
  ctx: AppContext,
  params: EthTransactionParams,
): Promise<{
  granted: boolean,
}> => {
  return await ctx.trustedRPC.request('permission_ask', {
    key: 'BLOCKCHAIN_SEND',
    txParams: params.transactionData,
  })
}

export const withPermission = (
  key: PermissionKey,
  handler: (ctx: AppContext, params: Object) => Promise<any>,
) => {
  return async (ctx: AppContext, params: Object) => {
    const granted = isGranted(key, ctx)
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
