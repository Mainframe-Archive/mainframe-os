// @flow

import { app, BrowserWindow, ipcMain } from 'electron'
import querystring from 'querystring'
import path from 'path'
import url from 'url'

import Client from '@mainframe/client'
import { Environment } from '@mainframe/config'
import { getDaemonSocketPath } from '@mainframe/config'

let mainWindow
let client
let env

const appWindows = {}
const requestChannel = 'ipc-request-channel'
const responseChannel = 'ipc-response-channel'
const isDevelopment = process.env.NODE_ENV !== 'production'

const newWindow = params => {
  const window = new BrowserWindow({ width: 800, height: 600 })
  if (isDevelopment) {
    window.webContents.openDevTools()
  }
  const stringParams = querystring.stringify(params)

  if (isDevelopment) {
    window.loadURL(
      `http://localhost:${
        process.env.ELECTRON_WEBPACK_WDS_PORT
      }?${stringParams}`,
    )
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

const setupClient = async () => {
  const envName = isDevelopment ? 'development' : 'production'
  const vaultKey =
    'yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy'

  env = new Environment(envName)
  const socketPath = getDaemonSocketPath(env)
  const vaultPath = path.join(env.paths.config, 'defaultVault')
  client = new Client(socketPath)

  try {
    const createRes = await client.newVault(vaultPath, vaultKey)
  } catch (err) {
    if (err.message === 'Vault already exists') {
      await client.openVault(vaultPath, vaultKey)
    }
  }
}

const createLauncherWindow = async () => {
  mainWindow = newWindow({
    type: 'launcher',
  })

  setupClient()

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
  appWindows[appId] = appWindow
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

const simpleClient = {
  getBalance: () => 1000,
  getPublicKey: () => 'myKey',
}

const handleRequest = request => {
  if (request.data && request.data.method && client[request.data.method]) {
    const args = request.data.args || []
    try {
      const res = client[request.data.method](...args)
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

ipcMain.on(requestChannel, async (event, request) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  const send = (channel, response) => {
    if (!(window && window.isDestroyed())) {
      event.sender.send(channel, response)
    }
  }
  const res = handleRequest(request, window)
  send(responseChannel, res)
})
