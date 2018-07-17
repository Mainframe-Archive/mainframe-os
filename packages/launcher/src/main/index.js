// @flow

import path from 'path'
import { stringify } from 'querystring'
import url from 'url'
import Client from '@mainframe/client'
import { Environment, DaemonConfig, VaultConfig } from '@mainframe/config'
import { startDaemon } from '@mainframe/toolbox'
// eslint-disable-next-line import/named
import { idType, type ID } from '@mainframe/utils-id'
import { app, BrowserWindow, ipcMain } from 'electron'

import {
  launcherToDaemonRequestChannel,
  launcherFromDaemonResponseChannel,
  mainProcRequestChannel,
  mainProcResponseChannel,
} from '../renderer/electronIpc.js'

type User = {
  id: ID,
  data: Object,
}

type App = {
  id: ID,
  manifest: Object,
}

type Session = {
  id: ID,
  permission: Object,
}

type AppSessionData = {
  app: App,
  user: User,
  session: Session,
}

type AppWindows = {
  [windowID: string]: {
    window: BrowserWindow,
    appSession: AppSessionData,
  },
}

type ClientResponse = {
  id: string,
  error?: Object,
  result?: Object,
}

const sandboxToDaemonRequestChannel = 'ipc-sandbox-request-channel'
const sandboxFromDaemonResponseChannel = 'ipc-sandbox-response-channel'

const daemonRequestIpcChannels = [
  {
    req: launcherToDaemonRequestChannel,
    res: launcherFromDaemonResponseChannel,
  },
  {
    req: sandboxToDaemonRequestChannel,
    res: sandboxFromDaemonResponseChannel,
  },
]

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
const isDevelopment = env.isDev

let client
let mainWindow
let vaultOpen: ?string // currently open vault path

const appWindows: AppWindows = {}

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

const createLauncherWindow = async () => {
  await setupClient()

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

const getWindowId = (appID: ID, userID: ID) => {
  return `${appID}-${userID}`
}

const launchApp = async (appID: ID, userID: ID) => {
  const windowId = getWindowId(appID, userID)
  if (appWindows[windowId]) {
    return
  }
  // $FlowFixMe: ID incompatible with client package ID type
  const appSession = await client.openApp(appID, userID)
  const appWindow = newWindow({
    type: 'app',
    windowId,
  })
  appWindow.on('closed', async () => {
    await client.closeApp(appSession.session.id)
    delete appWindows[windowId]
  })
  // $FlowFixMe: ID incompatible with client package ID type
  appWindows[windowId] = {
    appSession,
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

// IPC COMMS

// Handle calls to main process

const IPC_ERRORS: Object = {
  invalidParams: {
    message: 'Invalid params',
    code: 32602,
  },
  internalError: {
    message: 'Internal error',
    code: 32603,
  },
  invalidRequest: {
    message: 'Invalid request',
    code: 32600,
  },
  methodNotFound: {
    message: 'Method not found',
    code: 32601,
  },
}

const ipcMainHandler = {
  launchApp: async (event, request) => {
    const [appID, userID] = request.data.args
    launchApp(idType(appID), idType(userID))
    return { id: request.id }
  },

  getAppSession: async (event, request) => {
    if (!request.data.args.length) {
      return {
        error: IPC_ERRORS.invalidParams,
        id: request.id,
      }
    }
    const res = appWindows[request.data.args[0]]
    if (res && res.appSession) {
      return {
        id: request.id,
        result: { appSession: res.appSession },
      }
    } else {
      return {
        error: IPC_ERRORS.internalError,
        id: request.id,
      }
    }
  },

  getVaultsData: async (event, request) => {
    const vaults = vaultConfig.vaults
    return {
      id: request.id,
      result: {
        vaults,
        defaultVault: vaultConfig.defaultVault,
        vaultOpen: vaultOpen,
      },
    }
  },

  createVault: async (event, request) => {
    if (request.data.args.length !== 2) {
      return {
        error: IPC_ERRORS.invalidParams,
        id: request.id,
      }
    }
    const path = vaultConfig.createVaultPath()
    try {
      await client.createVault(path, request.data.args[0])
      vaultConfig.setLabel(path, request.data.args[1])
      vaultConfig.defaultVault = path
      vaultOpen = path
      return {
        id: request.id,
        result: {
          path,
        },
      }
    } catch (err) {
      return {
        error: {
          message: err.message,
          code: IPC_ERRORS.invalidParams.code,
        },
        id: request.id,
      }
    }
  },

  openVault: async (event, request) => {
    if (request.data.args.length !== 2) {
      return {
        error: IPC_ERRORS.invalidParams,
        id: request.id,
      }
    }
    try {
      await client.openVault(...request.data.args)
      vaultOpen = request.data.args[0]
      return {
        id: request.id,
        result: {
          open: true,
        },
      }
    } catch (err) {
      return {
        error: {
          message: err.message,
          code: IPC_ERRORS.invalidParams.code,
        },
        id: request.id,
      }
    }
  },
}

ipcMain.on(mainProcRequestChannel, async (event, request) => {
  const res = await ipcMainHandler[request.data.method](event, request)
  sendIpcResponse(event.sender, mainProcResponseChannel, res)
})

// Handle calls to daemon client

daemonRequestIpcChannels.forEach(c => {
  ipcMain.on(c.req, async (event, request) => {
    const res = await handleRequestToDaemon(request)
    sendIpcResponse(event.sender, c.res, res)
  })
})

const handleRequestToDaemon = async (
  request: Object,
): Promise<ClientResponse> => {
  if (request == null || !request || !request.data) {
    return {
      error: IPC_ERRORS.invalidRequest,
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
    } catch (err) {
      return {
        error: {
          message: err.message,
        },
        id: request.id,
      }
    }
  }
  return {
    error: IPC_ERRORS.methodNotFound,
    id: request.id,
  }
}

// IPC Responder

const sendIpcResponse = (sender, channel, response) => {
  const window = BrowserWindow.fromWebContents(sender)
  const send = (channel, response) => {
    if (!(window && window.isDestroyed())) {
      sender.send(channel, response)
    }
  }
  send(channel, response)
}
