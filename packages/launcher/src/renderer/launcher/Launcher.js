//@flow

import { ipcRenderer as ipc, remote } from 'electron'
import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native-web'
import { client, callMainProcess } from '../electronIpc.js'
import type { ID } from '@mainframe/utils-id'

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

  componentDidMount() {
    this.getInstalledApps()
  }

  async getInstalledApps() {
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

  onInstallComplete = (appID: ID) => {
    this.onCloseInstallModal()
    this.getInstalledApps()
  }

  // RENDER

  render() {
    const appRows = this.state.installedApps.map(app => {
      const manifest = app.manifest

      const onClick = async () => {
        // TODO User selection
        await callMainProcess('launchApp', [app.appID, app.users[0].id])
      }

      const onClickDelete = () => {
        client.removeApp(app.appID)
        this.getInstalledApps()
      }

      return (
        <View key={app.appID} style={styles.appRow}>
          <View style={styles.appIcon} />
          <View style={styles.appInfo}>
            <TouchableOpacity onPress={onClick} style={styles.openApp}>
              <Text style={styles.appName}>{app.manifest.name}</Text>
              <Text style={styles.appUsers}>
                {`Identities: ${app.users.map(u => u.data.name).join(', ')}`}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={onClickDelete}
            style={styles.deleteApp}
            key={app.appID}>
            <Text style={styles.deleteLabel}>Delete</Text>
          </TouchableOpacity>
        </View>
      )
    })

    const installModal = this.state.showAppInstallModal ? (
      <AppInstallModal
        onRequestClose={this.onCloseInstallModal}
        onInstallComplete={this.onInstallComplete}
      />
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

const COLOR_LIGHT_GREY = '#e8e8e8'
const COLOR_GREY_MED = '#818181'
const COLOR_WHITE = '#ffffff'

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
    borderColor: COLOR_LIGHT_GREY,
    borderWidth: 1,
    flexDirection: 'row',
    borderRadius: 3,
  },
  appIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLOR_LIGHT_GREY,
  },
  openApp: {
    flex: 1,
  },
  deleteApp: {
    backgroundColor: COLOR_GREY_MED,
    color: COLOR_WHITE,
    borderRadius: 2,
    height: 22,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  deleteLabel: {
    fontSize: 10,
  },
  appInfo: {
    marginLeft: 10,
    flex: 1,
  },
  appName: {
    fontWeight: 'bold',
  },
  appUsers: {
    marginTop: 5,
    fontSize: 12,
    color: COLOR_GREY_MED,
  },
})
