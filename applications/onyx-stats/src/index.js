import { AppRegistry } from 'react-native-web'
import './index.css'
import App from './Components/App'

// register the app
AppRegistry.registerComponent('App', () => App)

AppRegistry.runApplication('App', {
  initialProps: {},
  rootTag: document.getElementById('root'),
})
