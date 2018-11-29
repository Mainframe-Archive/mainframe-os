//@flow

import type { AppOwnData, AppInstalledData, ID } from '@mainframe/client'
import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native-web'

import colors from '../colors'
import Text from '../UIComponents/Text'
import rpc from './rpc'

type AppData = AppOwnData | AppInstalledData

type Props = {
  ownApp?: boolean,
  app: AppData,
  onOpenApp: (app: AppData) => void,
  onAppRemoved: (appID: ID) => void,
}

type State = {
  isHovering?: boolean,
}

export default class CreateAppModal extends Component<Props, State> {
  state = {}
  // HANDLERS

  onToggleHover = () => {
    this.setState({
      isHovering: this.state.isHovering,
    })
  }

  deleteApp = async (ownApp: boolean, appID: ID) => {
    ownApp ? await rpc.removeOwnApp(appID) : await rpc.removeApp(appID)
    this.props.onAppRemoved(appID)
  }

  // RENDER

  render() {
    const { app, ownApp } = this.props
    const onClick = () => this.props.onOpenApp(app)

    const onClickDelete = async () => this.deleteApp(!!ownApp, app.appID)

    const nameStyles = [styles.appName]
    if (ownApp) {
      nameStyles.push(styles.lightText)
    }

    const deleteButton = this.state.isHovering ? (
      <TouchableOpacity
        onPress={onClickDelete}
        style={styles.deleteApp}
        key={app.appID}>
        <Text style={styles.deleteLabel}>-</Text>
      </TouchableOpacity>
    ) : null

    return (
      <TouchableOpacity
        key={app.appID}
        style={styles.appItem}
        onPress={onClick}
        onMouseEnter={() => this.setState({ isHovering: true })}
        onMouseLeave={() => this.setState({ isHovering: false })}
        testID={'launcher-open-app'}>
        <View style={styles.appItemInner}>
          <View style={styles.appIcon} />
          <View style={styles.appInfo}>
            <Text style={nameStyles}>
              {app.manifest ? app.manifest.name : app.appID}
            </Text>
            <Text style={styles.versionText}>{app.manifest.version}</Text>
          </View>
          {deleteButton}
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  appItem: {
    marginHorizontal: 20,
    alignItems: 'center',
  },
  appItemInner: {
    width: 190,
    height: 220,
    marginBottom: 10,
  },
  appIcon: {
    width: 190,
    height: 160,
    borderRadius: 4,
    backgroundColor: colors.LIGHT_GREY_E8,
  },
  deleteApp: {
    position: 'absolute',
    right: -10,
    top: -10,
    backgroundColor: colors.PRIMARY_RED,
    borderRadius: 11,
    height: 22,
    justifyContent: 'center',
    paddingRight: 8,
    paddingLeft: 10,
  },
  deleteLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.WHITE,
  },
  appInfo: {
    flexDirection: 'row',
    marginTop: 10,
    flex: 1,
  },
  appName: {
    flex: 1,
    fontSize: 13,
    fontWeight: 'bold',
  },
  versionText: {
    color: colors.LIGHT_GREY_AE,
    paddingLeft: 10,
    fontSize: 12,
  },
  lightText: {
    color: colors.LIGHT_GREY_DE,
  },
})
