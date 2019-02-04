// @flow

import os from 'os'
import path from 'path'
import url from 'url'
import crypto from 'crypto'
import * as fs from 'fs-extra'
// eslint-disable-next-line import/named
import Client from '@mainframe/client'
import {
  Environment,
  DaemonConfig,
  VaultConfig,
  SwarmConfig,
} from '@mainframe/config'
import StreamRPC from '@mainframe/rpc-stream'
import { setupDaemon, startDaemon } from '@mainframe/toolbox'
import { createKeyStore, startSwarm } from '@mainframe/toolbox'
// eslint-disable-next-line import/named
import { app, BrowserWindow, ipcMain } from 'electron'
import { is } from 'electron-util'

import keytar from 'keytar'
import { APP_TRUSTED_REQUEST_CHANNEL } from '../constants'
import type { AppSession } from '../types'

import { AppContext, LauncherContext } from './contexts'
import { interceptWebRequests } from './permissions'
import createElectronTransport from './createElectronTransport'
import createRPCChannels from './rpc/createChannels'

const PORT = process.env.ELECTRON_WEBPACK_WDS_PORT || ''
const binPath = './packages/daemon/bin/run'
const homedir = os.homedir()
const datadir = `${homedir}${path.sep}.mainframe${path.sep}swarm`
const passwordFile = `${homedir}${path.sep}.mainframe${path.sep}swarm${
  path.sep
}password`
const service = 'com.mainframe.services.swarm'
const account = 'mainframe'

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
const swarmConfig = new SwarmConfig(env)

const platform = {
  darwin: 'mac',
  linux: 'linux',
  win32: 'win',
}[os.platform()]

console.log(`Platform: ${platform}`)
const getBinPath = async (): Promise<string> => {
  if (is.development) {
    return 'swarm'
  } else {
    return `${process.resourcesPath}/bin/swarm`
  }
}

let client
let launcherWindow

type AppContexts = { [appID: string]: { [userID: string]: AppContext } }

const appContexts: AppContexts = {}
const contextsByWindow: WeakMap<BrowserWindow, AppContext> = new WeakMap()

const newWindow = (params: Object = {}) => {
  const window = new BrowserWindow({
    width: params.width || 800,
    height: params.height || 600,
    show: false,
    titleBarStyle: 'hidden',
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

const launchApp = async (appSession: AppSession) => {
  const appID = appSession.app.appID
  const userID = appSession.user.id
  const appOpen = appContexts[appID] && appContexts[appID][userID]
  if (appOpen) {
    const appWindow = appContexts[appID][userID].window
    if (appWindow.isMinimized()) {
      appWindow.restore()
    }
    appWindow.show()
    appWindow.focus()
    return
  }

  const appWindow = newWindow()
  if (appSession.isDev) {
    appWindow.webContents.on('did-attach-webview', () => {
      // Open a separate developer tools window for the app
      appWindow.webContents.executeJavaScript(
        `document.getElementById('sandbox-webview').openDevTools()`,
      )
    })
  }
  appWindow.on('closed', async () => {
    await client.app.close({ sessID: appSession.session.sessID })
    const ctx = contextsByWindow.get(appWindow)
    if (ctx != null) {
      await ctx.clear()
      contextsByWindow.delete(appWindow)
    }
    delete appContexts[appID][userID]
  })

  const appContext = new AppContext({
    appSession,
    client,
    trustedRPC: new StreamRPC(
      createElectronTransport(appWindow, APP_TRUSTED_REQUEST_CHANNEL),
    ),
    window: appWindow,
  })
  contextsByWindow.set(appWindow, appContext)
  appWindow.webContents.on('did-attach-webview', (event, webContents) => {
    interceptWebRequests(appContext, webContents.session)
  })

  if (appContexts[appID]) {
    appContexts[appID][userID] = appContext
  } else {
    // $FlowFixMe: can't assign ID type
    appContexts[appID] = { [userID]: appContext }
  }
}

const getSwarmKeystorePassword = async (): Promise<string> => {
  let password = await keytar.getPassword(service, account)
  if (password == null) {
    const buffer = crypto.randomBytes(48)
    password = buffer.toString('hex')
    fs.ensureDir(datadir)
    await keytar.setPassword(service, account, password)
    await fs.writeFile(passwordFile, password, function(err) {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(err)
      }
    })
    return password
  } else {
    return password
  }
}

const envExists = async (): Promise<string> => {
  if (daemonConfig.binPath == null) {
    return false
  }
  return true
}

// TODO: proper setup, this is just temporary logic to simplify development flow
const setupClient = async () => {
  const firstLaunch = await envExists()
  if (!firstLaunch) {
    console.log('detected first launch')
    const password = await getSwarmKeystorePassword()
    await createKeyStore(password)
    swarmConfig.binPath = getBinPath
    swarmConfig.socketPath = 'ws://localhost:8546'
  }

  console.log(`couldn't find daemon socket path in the env config`)
  await setupDaemon(new DaemonConfig(env), {
    binPath: binPath,
    socketPath: await env.createSocketPath('mainframe.ipc'),
  })

  const swarmPath = await getBinPath()

  try {
    await startSwarm(swarmPath, swarmConfig)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
  }

  // /!\ Temporary only, should be handled by toolbox with installation flow
  if (daemonConfig.binPath == null) {
    console.log('no daemon config, setting binPath')
    daemonConfig.binPath = path.resolve(__dirname, '../../../daemon/bin/run')
  }
  if (daemonConfig.runStatus !== 'running') {
    daemonConfig.runStatus = 'stopped'
    console.log('set daemon status to stopped')
  }

  console.log('starting daemon')
  await startDaemon(daemonConfig, true)
  daemonConfig.runStatus = 'running'
  console.log('deamon started, connecting client to daemon')
  client = new Client(daemonConfig.socketPath)

  // Simple check for API call, not proper versioning logic
  const version = await client.apiVersion()
  if (version !== 0.1) {
    throw new Error('Unexpected API version')
  }
}

const createLauncherWindow = async () => {
  await setupClient()

  launcherWindow = newWindow({ width: 900, height: 600 })

  const launcherContext = new LauncherContext({
    client,
    launchApp,
    vaultConfig,
    window: launcherWindow,
  })
  createRPCChannels(launcherContext, contextsByWindow)

  // Emitted when the window is closed.
  launcherWindow.on('closed', async () => {
    // TODO: fix below to not error on close
    // const keys = Object.keys(appWindows)
    // Object.keys(appWindows).forEach(w => {
    //   appWindows[w].close()
    // })
    launcherWindow = null
    await launcherContext.clear()
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
    const appContext = contextsByWindow.get(window)
    if (appContext != null) {
      window.webContents.send('start', {
        type: 'app',
        appSession: appContext.appSession,
        partition: `persist:${appContext.appSession.app.appID}/${
          appContext.appSession.user.id
        }`,
      })
    }
  }
})

ipcMain.on('ready-window', event => {
  BrowserWindow.fromWebContents(event.sender).show()
})
