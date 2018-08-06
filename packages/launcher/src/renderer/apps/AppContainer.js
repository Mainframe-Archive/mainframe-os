// @flow

import path from 'path'
import url from 'url'
import type { ID } from '@mainframe/utils-id'
import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native-web'

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
            <Text>App: {appSession.app.manifest.name}</Text>
          </View>
          <View style={styles.identity}>
            <Text>User: {appSession.user.data.name}</Text>
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
    padding: 10,
    height: 50,
    flexDirection: 'row',
    backgroundColor: COLOR_GREY,
  },
  appInfo: {
    paddingTop: 5,
    flex: 1,
  },
  identity: {
    borderRadius: 16,
    height: 30,
    paddingHorizontal: 20,
    backgroundColor: COLOR_WHITE,
    justifyContent: 'center',
  },
})
