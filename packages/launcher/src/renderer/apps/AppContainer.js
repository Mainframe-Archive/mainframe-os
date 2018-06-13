// @flow

import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native-web'
import path from 'path'
import url from 'url'
import type { ID } from '@mainframe/utils-id'

import { callMainProcess } from '../electronIpc'

declare var __static: string

type User = {
  id: ID,
  data: Object,
}

type App = {
  id: ID,
  manifest: Object,
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

type State = {
  sessionData?: AppSessionData,
}

export default class AppContainer extends Component<
  { windowId: string },
  State,
> {
  state: State = {}

  componentDidMount() {
    this.fetchSession()
  }

  async fetchSession() {
    const { windowId } = this.props
    try {
      const res = await callMainProcess('getAppSession', [windowId])
      this.setState({
        sessionData: res.appSession,
      })
    } catch (err) {
      console.warn(err)
      //TODO handle error
    }
  }

  render() {
    const { sessionData } = this.state
    if (!sessionData) {
      return <View />
    }
    // TODO Use path provided by dameon
    const appUrl = url.format({
      pathname: path.join(
        __static,
        'applications',
        'sandbox',
        'sandbox.asar',
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
            <Text>App: {sessionData.app.manifest.name}</Text>
          </View>
          <View style={styles.identity}>
            <Text>User: {sessionData.user.data.name}</Text>
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
const COLOR_RED = '#ff0000'

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
    backgroundColor: COLOR_RED,
    paddingHorizontal: 20,
    backgroundColor: COLOR_WHITE,
    justifyContent: 'center',
  },
})
