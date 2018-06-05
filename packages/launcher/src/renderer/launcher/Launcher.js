//@flow

import { ipcRenderer as ipc, remote } from 'electron'
import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native-web'

import AppInstallModal from './AppInstallModal'
import Button from '../Button'

const fs = remote.require('fs-extra')
const path = remote.require('path')

type State = {
  showAppInstallModal: boolean,
}

export default class App extends Component<{}, State> {
  state = {
    showAppInstallModal: false,
  }

  // HANDLERS

  onPressInstall = () => {
    this.setState({
      showAppInstallModal: true,
    })
  }

  onCloseInstallModal = () => {
    this.setState({
      showAppInstallModal: false,
    })
  }

  // RENDER

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
            <TouchableOpacity
              onPress={onClick}
              style={styles.appRow}
              key={manifest.id}>
              <Text>{manifest.name}</Text>
            </TouchableOpacity>,
          )
        }
      }
    })

    const installModal = this.state.showAppInstallModal ? (
      <AppInstallModal onRequestClose={this.onCloseInstallModal} />
    ) : null

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Mainframe Launcher</Text>
        <View style={styles.apps}>{appRows}</View>
        <Button title="Install New App" onPress={this.onPressInstall} />
        {installModal}
      </View>
    )
  }
}

const COLOR_GREY = '#f5f5f5'

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
    backgroundColor: COLOR_GREY,
  },
})
