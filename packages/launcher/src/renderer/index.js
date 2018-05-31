// @flow

import React, { Component } from 'react'
import { AppRegistry } from 'react-native-web'
import { parse } from 'query-string'
import './styles.css'

import Launcher from './launcher/Launcher.js'
import AppContainer from './apps/AppContainer.js'

const params = parse(document.location.search)

class App extends Component {
  render() {
    const app =
      params.type === 'launcher' ? (
        <Launcher />
      ) : (
        <AppContainer appId={params.appId} />
      )
    return app
  }
}

AppRegistry.registerComponent('App', () => App)
AppRegistry.runApplication('App', { rootTag: document.getElementById('app') })
