// @flow

// Needed to fix issue with Ledger: https://github.com/LedgerHQ/ledgerjs/issues/211
import '@babel/polyfill'

// import StreamRPC from '@mainframe/rpc-stream'
import { app, BrowserWindow, WebContents, ipcMain } from 'electron'
import { is } from 'electron-util'

// import { APP_TRUSTED_REQUEST_CHANNEL } from '../constants'
// import type { AppSession } from '../types'

import './menu'
// import { AppContext } from './contexts'
// import { interceptWebRequests } from './permissions'
// import { registerStreamProtocol } from './storage'
// import createElectronTransport from './createElectronTransport'
import { createChannels } from './rpc'
// import { createLauncherWindow } from './windows'

import { SystemContext } from './context/system'
import { Environment } from './environment'
import { createLogger } from './logger'

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

if (ENV_TYPE === 'production') {
  if (app.requestSingleInstanceLock()) {
    app.on('second-instance', () => {
      // Someone tried to run a second instance, we should focus our window.
      // TODO: update logic for new windows management system
      // if (launcherWindow) {
      //   if (launcherWindow.isMinimized()) launcherWindow.restore()
      //   launcherWindow.focus()
      // }
    })
  } else {
    app.exit()
  }
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

app.on('ready', async () => {
  try {
    await system.initialize()
    system.openLauncher(system.defaultUser)
  } catch (err) {
    logger.log({
      level: 'error',
      message: 'Could not start system',
      error: err.toString(),
    })
  }
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
  const ctx =
    system.getLauncherContext(event.sender) ||
    system.getAppContext(event.sender)
  const windowLogger = ctx ? ctx.logger : logger
  windowLogger.error(`Window exception: ${error.message}`)
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
    return
  }

  const appContext = system.getAppContext(event.sender)

  if (appContext != null) {
    event.sender.send('window-start', {
      type: 'app',
      initialProps: {
        session: appContext.session.toAppWindowSession(),
      },
    })
    return
  }

  const wyreContext = system.getWyreContext()
  if (wyreContext != null) {
    event.sender.send('window-start', {
      type: 'wyre',
    })
    return
  }

  const coinbaseContext = system.getCoinbaseContext()
  if (coinbaseContext != null) {
    event.sender.send('window-start', {
      type: 'coinbase',
    })
    return
  }

  logger.error('Context not found for Window opened')
})

ipcMain.on('window-ready', event => {
  BrowserWindow.fromWebContents(event.sender).show()
})
