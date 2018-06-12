//@flow

import { ipcRenderer as ipc, remote } from 'electron'
import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native-web'
import { client } from '../electronIpc.js'

import AppInstallModal from './AppInstallModal'
import Button from '../Button'

const fs = remote.require('fs-extra')
const path = remote.require('path')

type State = {
  showAppInstallModal: boolean,
  installedApps: Array<Object>,
}

export default class App extends Component<{}, State> {
  state = {
    showAppInstallModal: false,
    installedApps: [],
  }

  async componentDidMount() {
    const res = await client.getInstalledApps()
    this.setState({
      installedApps: res.apps,
    })
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
    const appRows = this.state.installedApps.map(app => {
      const manifest = app.manifest

      const onClick = () => {
        ipc.send('launchApp', app.appID)
      }

      return (
        <TouchableOpacity
          onPress={onClick}
          style={styles.appRow}
          key={app.appID}>
          <Text>{app.manifest.name}</Text>
        </TouchableOpacity>
      )
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
