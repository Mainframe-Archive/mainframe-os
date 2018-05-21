// @flow
import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native-web'
import path from 'path'
import url from 'url'

type Props = {
  appId: string,
}

export default class App extends Component<Props> {
  render() {
    const { appId } = this.props
    const appUrl = url.format({
      pathname: path.join(
        __static,
        'applications',
        appId,
        `${appId}.asar`,
        `index.html`,
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
            <Text>App: {appId}</Text>
          </View>
          <View style={styles.identity}>
            <Text>id: James Smith</Text>
          </View>
        </View>
        <webview
          id="foo"
          src={appUrl}
          preload={preloadPath}
          style={{ flex: 1 }}
          sandboxed="true"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  header: {
    padding: 10,
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#f7f7f7',
  },
  appInfo: {
    paddingTop: 5,
    flex: 1,
  },
  identity: {
    borderRadius: 16,
    height: 30,
    backgroundColor: 'red',
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },
})
