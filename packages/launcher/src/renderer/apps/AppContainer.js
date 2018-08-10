// @flow

import path from 'path'
import url from 'url'
import type { ID } from '@mainframe/utils-id'
import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native-web'

import colors from '../colors'
import Text from '../UIComponents/Text'

declare var __static: string

type User = {
  id: ID,
  data: Object,
}

type App = {
  id: ID,
  manifest: Object,
  contentsPath: string,
}

type Session = {
  id: ID,
  permission: Object,
}

type AppSessionData = {
  app: App,
  user: User,
  session: Session,
}

type Props = {
  appSession: AppSessionData,
}

export default class AppContainer extends Component<Props> {
  render() {
    const { appSession } = this.props
    if (!appSession) {
      return <View />
    }

    // TODO: Revert to provided path
    // const appUrl = url.format({
    //   pathname: path.join(appSession.app.contentsPath, 'index.html'),
    //   protocol: 'file:',
    //   slashes: true,
    // })

    const appUrl = url.format({
      pathname: path.join(
        __static,
        'applications',
        'onyx-stats',
        'dist',
        'index.html',
      ),
      protocol: 'file:',
      slashes: true,
    })
    const preloadPath = url.format({
      pathname: path.join(__static, 'preload.js'),
      protocol: 'file:',
      slashes: true,
    })
    return (
      <View style={styles.outerContainer}>
        <View style={styles.header}>
          <View style={styles.appInfo}>
            <Text style={styles.headerLabel}>
              <Text style={styles.boldLabel}>
                {appSession.app.manifest.name}
              </Text>{' '}
              (Trusted UI)
            </Text>
          </View>
          <View style={styles.identity}>
            <Text style={styles.headerLabel}>
              User:{' '}
              <Text style={styles.boldLabel}> {appSession.user.data.name}</Text>
            </Text>
          </View>
        </View>
        <webview
          id="foo"
          src={appUrl}
          preload={preloadPath}
          style={{ flex: 1 }} // eslint-disable-line react-native/no-inline-styles
          sandboxed="true"
        />
      </View>
    )
  }
}

const COLOR_WHITE = '#ffffff'
const COLOR_GREY = '#f7f7f7'

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  header: {
    height: 25,
    flexDirection: 'row',
    backgroundColor: COLOR_GREY,
  },
  appInfo: {
    paddingTop: 5,
    paddingLeft: 5,
    flex: 1,
  },
  identity: {
    height: 25,
    paddingHorizontal: 10,
    backgroundColor: COLOR_WHITE,
    justifyContent: 'center',
  },
  headerLabel: {
    color: colors.GREY_DARK_54,
    fontSize: 11,
  },
  boldLabel: {
    fontWeight: 'bold',
  },
})
