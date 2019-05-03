// @flow

import path from 'path'
import url from 'url'
import StreamRPC from '@mainframe/rpc-stream'
import { app, BrowserWindow, WebContents, ipcMain } from 'electron'
import { is } from 'electron-util'

import { APP_TRUSTED_REQUEST_CHANNEL } from '../constants'
import type { AppSession } from '../types'

import './menu'
import { AppContext } from './contexts'
import { interceptWebRequests } from './permissions'
import { registerStreamProtocol } from './storage'
import createElectronTransport from './createElectronTransport'
import { createChannels } from './rpc'

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
const system = new SystemContext({ env, logger })

createChannels({
  logger,
  getAppSanboxedContext: (_contents: WebContents) => {
    throw new Error('Must be implemented')
  },
  getAppTrustedContext: (_contents: WebContents) => {
    throw new Error('Must be implemented')
  },
  getLauncherContext: (contents: WebContents) => {
    const context = system.getLauncherContext(contents)
    if (context == null) {
      throw new Error('Failed to retrieve launcher context')
    }
    return context
  },
})

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

const createLauncherWindow = async (userID?: ?string) => {
  if (!system.initialized) {
    await system.initialize()
  }

  const launcherWindow = newWindow({
    width: 900,
    height: 600,
    minWidth: 900,
    minHeight: 600,
  })

  const launcherContext = system.addLauncherContext({
    userID: userID || system.defaultUser,
    window: launcherWindow,
  })

  // Emitted when the window is closed.
  launcherWindow.on('closed', async () => {
    // launcherWindow = null
    await launcherContext.clear()
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

ipcMain.on('window-opened', async event => {
  const launcherContext = system.getLauncherContext(event.sender)
  if (launcherContext != null) {
    event.sender.send('window-start', {
      type: 'launcher',
      initialProps: {
        route: await launcherContext.getInitialRoute(),
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
