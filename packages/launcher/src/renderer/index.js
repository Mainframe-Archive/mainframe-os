// @flow

import { parse } from 'query-string'
import React from 'react'
import { AppRegistry } from 'react-native-web'
import './styles.css'

import Launcher from './launcher/Launcher.js'
import AppContainer from './apps/AppContainer.js'

const params = parse(document.location.search)
const rootTag = document.getElementById('app')

if (params.type === 'launcher') {
  AppRegistry.registerComponent('Launcher', () => Launcher)
  AppRegistry.runApplication('Launcher', { rootTag })
} else {
  const App = () => <AppContainer appId={params.appId} />
  AppRegistry.registerComponent('App', () => App)
  AppRegistry.runApplication('App', { rootTag })
}
