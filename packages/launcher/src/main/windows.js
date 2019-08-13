// @flow

import path from 'path'
import url from 'url'
import { BrowserWindow } from 'electron'
import { is } from 'electron-util'

const PORT = process.env.ELECTRON_WEBPACK_WDS_PORT || ''

const createWindow = (params: Object = {}, coinbase): BrowserWindow => {
  const window = new BrowserWindow({
    minWidth: 1020,
    minHeight: 702,
    width: 1020,
    height: 702,
    show: false,
    titleBarStyle: 'hidden',
    ...params,
  })

  if (is.development && !coinbase) {
    window.loadURL(`http://localhost:${PORT}`)
  } else if (coinbase) {
    window.loadURL(`http://localhost:3000/authorize`)
  } else {
    const formattedUrl = url.format({
      pathname: path.join(__dirname, `index.html`),
      protocol: 'file:',
      slashes: true,
    })
    window.loadURL(formattedUrl)
  }

  // hide the menu (Win and Linux)
  window.setAutoHideMenuBar(true)

  return window
}

export const createAppWindow = (): BrowserWindow => {
  return createWindow({
    width: 900,
    height: 600,
    minWidth: 900,
    minHeight: 600,
  })
}

export const createCoinbaseWindow = (): BrowserWindow => {
  return createWindow(
    {
      width: 900,
      height: 600,
      minWidth: 900,
      minHeight: 600,
      show: true,
    },
    true,
  )
}

export const createWyreWindow = (): BrowserWindow => {
  return createWindow({
    width: 400,
    height: 600,
    minWidth: 350,
    minHeight: 600,
  })
}

export const createLauncherWindow = (): BrowserWindow => {
  return createWindow({
    width: 900,
    height: 600,
    minWidth: 900,
    minHeight: 600,
  })
}
