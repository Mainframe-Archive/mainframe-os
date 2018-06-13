// @flow

import Client from '@mainframe/client'
import { Environment, DaemonConfig, VaultConfig } from '@mainframe/config'
import { startDaemon } from '@mainframe/toolbox'
import { app, BrowserWindow, ipcMain } from 'electron'
import betterIpc from 'electron-better-ipc'
import path from 'path'
import { stringify } from 'querystring'
import url from 'url'

const PORT = process.env.ELECTRON_WEBPACK_WDS_PORT || ''

const envType =
  process.env.NODE_ENV === 'production' ? 'production' : 'development'
const envName =
  process.env.MAINFRAME_ENV || Environment.getDefault() || `launcher-${envType}`
// Get existing env or create with specified type
const env = Environment.get(envName, envType)

console.log(`using environment "${env.name}" (${env.type})`)

const daemonConfig = new DaemonConfig(env)
const vaultConfig = new VaultConfig(env)
const isDevelopment = env.isDev
// TODO: user input once launcher opens rather than hardcoded value
const testVaultKey = process.env.MAINFRAME_VAULT_KEY || 'testKey'

let client
let mainWindow

type AppWindows = {
  [appId: string]: {
    window: BrowserWindow,
    appId: string,
  },
}

type ClientResponse = {
  id: string,
  error?: Object,
  result?: Object,
}

const appWindows: AppWindows = {}
const sandboxRequestChannel = 'ipc-sandbox-request-channel'
const sandboxResponseChannel = 'ipc-sandbox-response-channel'
const launcherRequestChannel = 'ipc-launcher-client-request-channel'
const launcherResponseChannel = 'ipc-launcher-client-response-channel'

const newWindow = params => {
  const window = new BrowserWindow({ width: params.width || 800, height: 600 })
  const stringParams = stringify(params)

  if (isDevelopment) {
    window.webContents.openDevTools()
    window.loadURL(`http://localhost:${PORT}?${stringParams}`)
  } else {
    window.loadURL(
      url.format({
        pathname: path.join(__dirname, `index.html?${stringParams}`),
        protocol: 'file:',
        slashes: true,
      }),
    )
  }
  return window
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

// TODO: opening or creating a vault should be done as the result of user interaction in the launcher
const setupVault = async () => {
  const existing = process.env.MAINFRAME_VAULT_PATH || vaultConfig.defaultVault
  if (existing != null) {
    await client.openVault(existing, testVaultKey)
  } else {
    const vaultPath = vaultConfig.createVaultPath()
    await client.createVault(vaultPath, testVaultKey)
    vaultConfig.defaultVault = vaultPath
  }
}

const createLauncherWindow = async () => {
  await setupClient()
  await setupVault()

  mainWindow = newWindow({
    type: 'launcher',
    width: 480,
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // TODO: fix below to not error on close
    // const keys = Object.keys(appWindows)
    // Object.keys(appWindows).forEach(w => {
    //   appWindows[w].close()
    // })
    mainWindow = null
  })
}

const launchApp = appId => {
  const appWindow = newWindow({
    type: 'app',
    appId,
  })
  appWindows[appId] = {
    appId,
    window: appWindow,
  }
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
  if (mainWindow === null) {
    createLauncherWindow()
  }
})

ipcMain.on('launchApp', (e, appId) => {
  launchApp(appId)
})

// IPC COMMS

const sendIpcResponse = (sender, channel, response) => {
  const window = BrowserWindow.fromWebContents(sender)
  const send = (channel, response) => {
    if (!(window && window.isDestroyed())) {
      sender.send(channel, response)
    }
  }
  send(channel, response)
}

// Answer Launcher

ipcMain.on(launcherRequestChannel, async (event, request) => {
  const res = await handleRequest(request)
  sendIpcResponse(event.sender, launcherResponseChannel, res)
})

// Answer App

ipcMain.on(sandboxRequestChannel, async (event, request) => {
  const res = await handleRequest(request)
  sendIpcResponse(event.sender, sandboxResponseChannel, res)
})

// Client request handler

const handleRequest = async (request: Object): Promise<ClientResponse> => {
  console.log('request: ', request)
  if (request == null || !request || !request.data) {
    return {
      error: {
        message: 'Invalid request',
        code: 32600,
      },
      id: request.id,
    }
  }
  // $FlowFixMe: indexer property
  if (request.data.method && client[request.data.method]) {
    const args = request.data.args || []
    try {
      // $FlowFixMe: indexer property
      const res = await client[request.data.method](...args)
      return {
        id: request.id,
        result: res,
      }
    } catch (error) {
      return {
        error,
        id: request.id,
      }
    }
  }
  return {
    error: {
      message: 'Method not found',
      code: 32601,
    },
    id: request.id,
  }
}
