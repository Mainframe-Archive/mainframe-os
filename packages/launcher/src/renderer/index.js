// @flow

import { parse } from 'querystring'
import React from 'react'
import Modal from 'react-modal'
import { AppRegistry } from 'react-native-web'
import './styles.css'

import Launcher from './launcher/Launcher.js'
import AppContainer from './apps/AppContainer.js'

const params = parse(document.location.search.substr(1)) // Remove leading '?'
const rootTag = document.getElementById('app')

Modal.setAppElement(rootTag)

if (params.type === 'launcher') {
  AppRegistry.registerComponent('Launcher', () => Launcher)
  AppRegistry.runApplication('Launcher', { rootTag })
} else {
  const App = () => <AppContainer windowId={params.windowId} />
  AppRegistry.registerComponent('App', () => App)
  AppRegistry.runApplication('App', { rootTag })
}
