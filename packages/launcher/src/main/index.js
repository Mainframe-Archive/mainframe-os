// @flow

import path from 'path'
import url from 'url'
import StreamRPC from '@mainframe/rpc-stream'
import { app, BrowserWindow, WebContents, ipcMain } from 'electron'
import { is } from 'electron-util'

import { APP_TRUSTED_REQUEST_CHANNEL } from '../constants'
import type { AppSession } from '../types'

import { AppContext } from './contexts'
import { interceptWebRequests } from './permissions'
import { registerStreamProtocol } from './storage'
import createElectronTransport from './createElectronTransport'
import { createChannels } from './rpc'

import { LauncherContext } from './context/launcher'
import { SystemContext } from './context/system'
import { Environment } from './environment'
import { createLogger } from './logger'

const PORT = process.env.ELECTRON_WEBPACK_WDS_PORT || ''
const { MAINFRAME_ENV, NODE_ENV } = process.env

const ENV_NAME = MAINFRAME_ENV || 'local-test'
let ENV_TYPE = is.development ? 'development' : 'production'
if (
  NODE_ENV === 'development' ||
  NODE_ENV === 'testing' ||
  NODE_ENV === 'production'
) {
  ENV_TYPE = NODE_ENV
}

const env = Environment.get(ENV_NAME, ENV_TYPE)
const logger = createLogger(env)
const systemContext = new SystemContext({ env, logger })

const launcherContexts: WeakMap<WebContents, LauncherContext> = new WeakMap()
createChannels({
  logger,
  getAppSanboxedContext: (_contents: WebContents) => {
    throw new Error('Must be implemented')
  },
  getAppTrustedContext: (_contents: WebContents) => {
    throw new Error('Must be implemented')
  },
  getLauncherContext: (contents: WebContents) => {
    const context = launcherContexts.get(contents)
    if (context == null) {
      throw new Error('Failed to retrieve launcher context')
    }
    return context
  },
})

let systemInitialized = false
const initSystem = async () => {
  logger.debug('Initialize system')

  if (systemContext.config.get('savePassword') === true) {
    try {
      const password = await systemContext.getPassword()
      if (password == null) {
        logger.warn('Context password not found even though it should be saved')
      } else {
        await systemContext.openDB(password)
        logger.debug('Database opened using saved password')
      }
    } catch (error) {
      logger.log({
        level: 'error',
        message: 'Failed to open database using saved password',
        error,
      })
    }
  } else {
    logger.debug('No saved password to open database')
  }

  systemInitialized = true
  logger.debug('System initialized')
}

// type AppContexts = { [appID: string]: { [userID: string]: AppContext } }
//
// const appContexts: AppContexts = {}
// const contextsBySandbox: WeakMap<WebContents, AppContext> = new WeakMap()
// const contextsByWindow: WeakMap<BrowserWindow, AppContext> = new WeakMap()

const newWindow = (params: Object = {}) => {
  const window = new BrowserWindow({
    minWidth: 1020,
    minHeight: 702,
    width: 1020,
    height: 702,
    show: false,
    titleBarStyle: 'hidden',
    ...params,
  })

  if (is.development) {
    window.loadURL(`http://localhost:${PORT}`)
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

// const launchApp = async (
//   appSession: AppSession,
//   // vaultSettings: VaultSettings,
// ) => {
//   const appID = appSession.app.appID
//   const userID = appSession.user.id
//   const appOpen = appContexts[appID] && appContexts[appID][userID]
//   if (appOpen) {
//     const appWindow = appContexts[appID][userID].window
//     if (appWindow.isMinimized()) {
//       appWindow.restore()
//     }
//     appWindow.show()
//     appWindow.focus()
//     return
//   }
//
//   const appWindow = newWindow()
//   if (appSession.isDev) {
//     appWindow.webContents.on('did-attach-webview', () => {
//       // Open a separate developer tools window for the app
//       appWindow.webContents.executeJavaScript(
//         `document.getElementById('sandbox-webview').openDevTools()`,
//       )
//     })
//   }
//   appWindow.on('closed', async () => {
//     // await client.app.close({ sessID: appSession.session.sessID })
//     const ctx = contextsByWindow.get(appWindow)
//     if (ctx != null) {
//       await ctx.clear()
//       contextsByWindow.delete(appWindow)
//     }
//     delete appContexts[appID][userID]
//   })
//
//   const appContext = new AppContext({
//     appSession,
//     trustedRPC: new StreamRPC(
//       createElectronTransport(appWindow, APP_TRUSTED_REQUEST_CHANNEL),
//     ),
//     window: appWindow,
//     // settings: vaultSettings,
//   })
//   contextsByWindow.set(appWindow, appContext)
//
//   appWindow.webContents.on('did-attach-webview', (event, webContents) => {
//     webContents.on('destroyed', () => {
//       contextsBySandbox.delete(webContents)
//       appContext.sandbox = null
//     })
//
//     contextsBySandbox.set(webContents, appContext)
//     appContext.sandbox = webContents
//
//     interceptWebRequests(appContext, webContents.session)
//   })
//
//   if (appContexts[appID]) {
//     appContexts[appID][userID] = appContext
//   } else {
//     // $FlowFixMe: can't assign ID type
//     appContexts[appID] = { [userID]: appContext }
//   }
//
//   appWindow.webContents.on('did-attach-webview', (event, webContents) => {
//     // Open a separate developer tools window for the app
//     appContext.sandbox = webContents
//     registerStreamProtocol(appContext)
//     if (is.development) {
//       appWindow.webContents.executeJavaScript(
//         `document.getElementById('sandbox-webview').openDevTools()`,
//       )
//     }
//   })
//
//   appWindow.on('closed', async () => {
//     // await client.app.close({ sessID: appSession.session.sessID })
//     const ctx = contextsByWindow.get(appWindow)
//     if (ctx != null) {
//       await ctx.clear()
//       contextsByWindow.delete(appWindow)
//     }
//     delete appContexts[appID][userID]
//   })
// }

const createLauncherWindow = async (userID?: string) => {
  if (systemInitialized === false) {
    await initSystem()
  }

  if (userID == null) {
    userID = systemContext.config.get('defaultUser', null)
  }

  const launcherWindow = newWindow({
    width: 900,
    height: 600,
    minWidth: 900,
    minHeight: 600,
  })
  const launcherContext = new LauncherContext({
    system: systemContext,
    userID,
    window: launcherWindow,
  })
  launcherContexts.set(launcherWindow.webContents, launcherContext)

  // Emitted when the window is closed.
  launcherWindow.on('closed', async () => {
    // launcherWindow = null
    // await launcherContext.clear()
  })
}

app.on('ready', () => {
  createLauncherWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  // TODO: focus on most relevant window
})

// Window lifecycle events

ipcMain.on('window-exception', (event, error) => {
  // TODO: use the right context logger for better trace
  logger.error(`Window exception: ${error.message}`)
})

ipcMain.on('window-opened', event => {
  const launcherContext = launcherContexts.get(event.sender)
  if (launcherContext != null) {
    let db = null
    if (launcherContext.system.db != null) {
      db = 'opened'
    } else if (launcherContext.config.get('dbCreated', false)) {
      db = 'created'
    }
    event.sender.send('window-start', {
      type: 'launcher',
      initialProps: {
        db,
        userID: launcherContext.userID,
      },
    })
  }

  // TODO: handle apps

  // const window = BrowserWindow.fromWebContents(event.sender)
  // if (window === launcherWindow) {
  //   window.webContents.send('start', { type: 'launcher' })
  // } else {
  //   const appContext = contextsByWindow.get(window)
  //   if (appContext != null) {
  //     window.webContents.send('start', {
  //       type: 'app',
  //       appSession: appContext.appSession,
  //       partition: `persist:${appContext.appSession.app.appID}/${
  //         appContext.appSession.user.id
  //       }`,
  //     })
  //   }
  // }
})

ipcMain.on('window-ready', event => {
  BrowserWindow.fromWebContents(event.sender).show()
})
