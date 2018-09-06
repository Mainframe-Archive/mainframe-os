// @flow

import path from 'path'
import { stringify } from 'querystring'
import url from 'url'
// eslint-disable-next-line import/named
import Client from '@mainframe/client'
import { Environment, DaemonConfig, VaultConfig } from '@mainframe/config'
import StreamRPC from '@mainframe/rpc-stream'
import { startDaemon } from '@mainframe/toolbox'
// eslint-disable-next-line import/named
import { app, BrowserWindow, ipcMain } from 'electron'
import { is } from 'electron-util'

import { TRUSTED_CHANNEL } from '../constants'
import type { AppSession, AppSessions } from '../types'

import AppContext from './AppContext'
import { interceptWebRequests } from './permissions'
import createElectronTransport from './createElectronTransport'
import createRPCChannels from './rpc/createChannels'

const PORT = process.env.ELECTRON_WEBPACK_WDS_PORT || ''

const envType =
  process.env.NODE_ENV === 'production' ? 'production' : 'development'
const envName =
  process.env.MAINFRAME_ENV || Environment.getDefault() || `launcher-${envType}`
// Get existing env or create with specified type
const env = Environment.get(envName, envType)

// eslint-disable-next-line no-console
console.log(`using environment "${env.name}" (${env.type})`)

const daemonConfig = new DaemonConfig(env)
const vaultConfig = new VaultConfig(env)

let client
let launcherWindow

const appSessions: AppSessions = {}
const appContexts: WeakMap<BrowserWindow, AppContext> = new WeakMap()
createRPCChannels(appContexts)

const newWindow = (params: Object = {}) => {
  const window = new BrowserWindow({
    width: params.width || 800,
    height: 600,
    show: false,
  })
  const stringParams = stringify(params)

  if (is.development) {
    window.webContents.openDevTools()
    window.loadURL(`http://localhost:${PORT}?${stringParams}`)
  } else {
    const formattedUrl = url.format({
      pathname: path.join(__dirname, `index.html`),
      protocol: 'file:',
      slashes: true,
    })
    window.loadURL(formattedUrl)
  }
  return window
}

// App Lifecycle

const launchApp = async (appSession: AppSession) => {
  const appID = appSession.app.appID
  const userID = appSession.user.id
  const appOpen = appSessions[appID] && appSessions[appID][userID]
  if (appOpen) {
    // Already open
    return
  }

  const appWindow = newWindow()
  appWindow.on('closed', async () => {
    await client.app.close({ sessID: appSession.session.sessID })
    const ctx = appContexts.get(appWindow)
    if (ctx != null) {
      await ctx.clear()
      appContexts.delete(appWindow)
    }
    delete appSessions[appID][userID]
  })

  const appContext = new AppContext({
    appSession,
    client,
    launchApp,
    trustedRPC: new StreamRPC(
      createElectronTransport(appWindow, TRUSTED_CHANNEL),
    ),
    vaultConfig,
    window: appWindow,
  })
  appContexts.set(appWindow, appContext)
  interceptWebRequests(appContext)

  if (appSessions[appID]) {
    appSessions[appID][userID] = appSession
  } else {
    // $FlowFixMe: can't assign ID type
    appSessions[appID] = { [userID]: appSession }
  }
}

// TODO: proper setup, this is just temporary logic to simplify development flow
const setupClient = async () => {
  // /!\ Temporary only, should be handled by toolbox with installation flow
  if (daemonConfig.binPath == null) {
    daemonConfig.binPath = path.resolve(__dirname, '../../../daemon/bin/run')
  }
  if (daemonConfig.runStatus !== 'running') {
    daemonConfig.runStatus = 'stopped'
  }

  await startDaemon(daemonConfig, true)
  daemonConfig.runStatus = 'running'
  client = new Client(daemonConfig.socketPath)

  // Simple check for API call, not proper versioning logic
  const version = await client.apiVersion()
  if (version !== 0.1) {
    throw new Error('Unexpected API version')
  }
}

const createLauncherWindow = async () => {
  await setupClient()

  launcherWindow = newWindow({ width: 480 })

  // Emitted when the window is closed.
  launcherWindow.on('closed', () => {
    // TODO: fix below to not error on close
    // const keys = Object.keys(appWindows)
    // Object.keys(appWindows).forEach(w => {
    //   appWindows[w].close()
    // })
    launcherWindow = null
  })
}

app.on('ready', createLauncherWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (launcherWindow === null) {
    createLauncherWindow()
  }
})

// Window lifecycle events

ipcMain.on('init-window', event => {
  const window = BrowserWindow.fromWebContents(event.sender)
  if (window === launcherWindow) {
    window.webContents.send('start', { type: 'launcher' })
  } else {
    const appContext = appContexts.get(window)
    if (appContext != null) {
      window.webContents.send('start', {
        type: 'app',
        appSession: appContext.appSession,
      })
    }
  }
})

ipcMain.on('ready-window', event => {
  BrowserWindow.fromWebContents(event.sender).show()
})
