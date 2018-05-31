// @flow

import { app, BrowserWindow, ipcMain } from 'electron'
import betterIpc from 'electron-better-ipc'
import querystring from 'querystring'
import path from 'path'
import url from 'url'

import Client from '@mainframe/client'
import { Environment, getDaemonSocketPath } from '@mainframe/config'

const testVaultKey = 'testKey'

let mainWindow
let client
let env

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
  env = new Environment(envName)
  const socketPath = getDaemonSocketPath(env)
  const vaultPath = path.join(env.paths.config, 'defaultVault')
  client = new Client(socketPath)

  // TODO: Implement proper vault handling

  try {
    const res = await client.openVault(vaultPath, testVaultKey)
  } catch (err) {
    const createRes = await client.createVault(vaultPath, testVaultKey)
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

betterIpc.answerRenderer('client-request', async request => {
  const res = handleRequest(request)
  return res
})

const handleRequest = (request: Object): ClientResponse => {
  if (request == null || !request || !request.data) {
    return {
      error: {
        message: 'Invalid request',
        code: 32600,
      },
      id: request.id,
    }
  }
  if (request.data.method && client[request.data.method]) {
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
