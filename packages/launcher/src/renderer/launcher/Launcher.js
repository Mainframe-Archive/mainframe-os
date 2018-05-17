import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native'
const electron = window.require('electron')
const fs = window.require('fs-extra')
const path = window.require('path')
const ipc = electron.ipcRenderer

export default class App extends Component {

  render() {
    // TODO: Temporary applications directory for dev
    const appsPath = path.join(__dirname, '../../../static/', 'applications')
    const files = fs.readdirSync(appsPath)
    const appRows = []

    files.forEach(file => {
      const appPath = path.join(appsPath, file)
      const isDir = fs.lstatSync(appPath).isDirectory()
      if (isDir) {
        const manifestPath = path.join(appPath, 'manifest.json')
        if (fs.existsSync(manifestPath)) {
          const manifest = JSON.parse(fs.readFileSync(manifestPath))

          const onClick = () => {
            ipc.send('launchApp', manifest.id)
          }

          appRows.push(
            <TouchableOpacity onPress={onClick} style={styles.appRow} key={manifest.id}>
              <Text>{manifest.name}</Text>
            </TouchableOpacity>
          )
        }
      }
    })

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Mainframe Launcher</Text>
        <View style={styles.apps}>
          {appRows}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  title: {
    fontSize: 20,
  },
  apps: {
    marginTop: 20,
    flex: 1,
  },
  appRow: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
  }
})
