// @flow

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

let mainWindow
const appWindows = {}

const createWindow = () => {

  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.webContents.openDevTools()

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'ui', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

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

const launchApp = (appId) => {
  const appWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      sandbox: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  })
  appWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'applications', appId, `${appId}.asar`, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  appWindows[appId] = appWindow
}

app.on('ready', createWindow)

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
    createWindow()
  }
})

ipcMain.on('launchApp', (e, appId) => {
  launchApp(appId)
})

const simpleClient = {
  getBalance: () => 1000,
}

ipcMain.on('message', (e, msg) => {
  if (msg.method && simpleClient[msg.method]) {
    const res = simpleClient[msg.method](...msg.args)
    if (appWindows[msg.appId]) {
      appWindows[msg.appId].webContents.send(
        'message',
        {
          appId: msg.appId,
          body: res,
        },
      )
    }
  }
})
