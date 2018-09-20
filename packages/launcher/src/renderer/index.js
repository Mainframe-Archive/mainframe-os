// @flow

import React from 'react'
import Modal from 'react-modal'
import { AppRegistry } from 'react-native-web'
import { ipcRenderer } from 'electron'
import './styles.css'

import Launcher from './launcher/Launcher.js'
import AppContainer from './app/AppContainer.js'

const callback = () => ipcRenderer.send('ready-window')
const rootTag = document.getElementById('app')

ipcRenderer.send('init-window')

Modal.setAppElement(rootTag)

ipcRenderer.on('start', (event, params) => {
  if (params.type === 'launcher') {
    AppRegistry.registerComponent('Launcher', () => Launcher)
    AppRegistry.runApplication('Launcher', { rootTag, callback })
  } else {
    const App = () => <AppContainer appSession={params.appSession} />
    AppRegistry.registerComponent('App', () => App)
    AppRegistry.runApplication('App', { rootTag, callback })
  }
})
