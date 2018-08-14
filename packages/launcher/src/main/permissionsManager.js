// @flow
import url from 'url'
import { session, BrowserWindow, webContents, ipcMain } from 'electron'
import type Client, { ClientSession } from '@mainframe/client'
import { checkPermission as checkAppPermission } from '@mainframe/app-permissions'

import request from '../ipcRequest'
import { type AppWindows } from './index'

const permissionsMapping = {
  blockchain_getContractEvents: 'WEB3_SEND', // TODO revert to WEB3_CALL
}

export const interceptWebRequests = (appWindows: AppWindows) => {
  session.defaultSession.webRequest.onBeforeRequest([], (request, callback) => {
    const requestUrl = url.parse(request.url, true)
    const whitelistedDomains = ['localhost', 'devtools']
    // console.log(requestUrl)
    if (whitelistedDomains.includes(requestUrl.hostname)) {
      callback({ cancel: false })
      return
    }
    if (request.webContentsId) {
      const reqWebContents = webContents.fromId(request.webContentsId)
      const window = BrowserWindow.fromWebContents(
        reqWebContents.hostWebContents,
      )
      const appWindow = appWindows[window]
      callback({ cancel: false })
    }
  })
}

export const checkPermission = async (
  request: Object,
  appSession: ClientSession,
  appWindow: BrowserWindow,
  client: Client,
): Promise<boolean> => {
  if (permissionsMapping[request.data.method]) {
    const key = permissionsMapping[request.data.method]
    const permissions = appSession.session.permissions.session
    const granted = checkAppPermission(permissions, key)
    switch (granted) {
      case 'granted':
        return true
      case 'denied':
        return false
      case 'not_set': {
        const res = await askPermission(appWindow, key)
        appSession.session.permissions.session[key] = res.granted
        if (res.persist) {
          client.setAppPermission(appSession.session.id, key, res.granted)
        }
        return res.granted
      }
      case 'unknown':
      default:
        throw new Error('Unknown permission')
    }
  } else {
    return true
  }
}

const askPermission = async (
  appWindow: BrowserWindow,
  key: string,
  inputs?: Array<any>,
): Promise<{
  granted: boolean,
  persist?: boolean,
}> => {
  // TODO: timeout?
  return await request(
    appWindow.webContents,
    ipcMain,
    'mainToApp',
    'permissions-ask',
    [key, inputs],
  )
}
