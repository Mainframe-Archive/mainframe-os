import App from './App'
import React from 'react'
import { AppRegistry } from 'react-native-web'

// register the app
AppRegistry.registerComponent('App', () => App)

AppRegistry.runApplication('App', {
  initialProps: {},
  rootTag: document.getElementById('root'),
})
