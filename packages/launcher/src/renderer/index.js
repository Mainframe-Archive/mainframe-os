// @flow

import React from 'react'
import Modal from 'react-modal'
import { AppRegistry } from 'react-native'
import { ipcRenderer } from 'electron'

import '@morpheus-ui/fonts'
import 'typeface-ibm-plex-mono'
import './styles.css'

import Launcher from './launcher/Root.js'
import AppContainer from './app/AppContainer.js'
import WyreWidget from './launcher/WyreWidget.js'
import CoinbaseWindow from './launcher/CoinbaseWindow.js'

const AppTypes = {
  app: AppContainer,
  launcher: Launcher,
  wyre: WyreWidget,
  coinbase: CoinbaseWindow,
}

const rootTag = document.getElementById('app')
Modal.setAppElement(rootTag)

ipcRenderer.on('window-start', (event, params) => {
  const App = AppTypes[params.type]
  if (App == null) {
    ipcRenderer.send('window-exception', {
      message: `Unknown app type: ${params.type}`,
    })
  } else {
    const props = params.initialProps || {}
    const Root = () => <App {...props} />
    AppRegistry.registerComponent('Root', () => Root)
    AppRegistry.runApplication('Root', {
      rootTag,
      callback: () => {
        ipcRenderer.send('window-ready')
      },
    })
  }
})

ipcRenderer.send('window-opened')
