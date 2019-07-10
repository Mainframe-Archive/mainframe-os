// @flow

import path from 'path'
import url from 'url'
import { BrowserWindow } from 'electron'
import { is } from 'electron-util'

const PORT = process.env.ELECTRON_WEBPACK_WDS_PORT || ''

const createWindow = (params: Object = {}, amount?: number): BrowserWindow => {
  const window = new BrowserWindow({
    minWidth: 1020,
    minHeight: 702,
    width: 1020,
    height: 702,
    show: false,
    titleBarStyle: 'hidden',
    ...params,
  })

  if (amount) {
    const wyreURL = `https://verify.testwyre.com/widget/v1?env=test&operation=debitcard&accountId=AC_1234&authType=secretKey&destCurrency=ETH&sourceCurrency=USD&sourceAmount=${amount}&dest=ethereum:0x75bdf6a2ced3a0d0eff704555e3350b5010f5e00&redirectUrl=https://sendwyre.com`

    window.loadURL(`http://localhost:${PORT}`)
    // window.loadURL(wyreURL)
  } else if (is.development) {
    window.loadURL(`http://localhost:${PORT}`)
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
  console.log('createappwindow')
  return createWindow({
    width: 900,
    height: 600,
    minWidth: 900,
    minHeight: 600,
  })
}

export const createWyreWindow = (amount: number): BrowserWindow => {
  console.log('createwyrewindow')

  return createWindow(
    {
      width: 350,
      height: 600,
      minWidth: 350,
      minHeight: 600,
    },
    amount,
  )
}

export const createLauncherWindow = (): BrowserWindow => {
  return createWindow({
    width: 900,
    height: 600,
    minWidth: 900,
    minHeight: 600,
  })
}
