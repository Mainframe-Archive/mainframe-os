// @flow

import path from 'path'
import url from 'url'
import Store from 'electron-store'
import type { ID } from '@mainframe/utils-id'
import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native-web'

import colors from '../colors'
import Text from '../UIComponents/Text'
import Button from '../UIComponents/Button'
import TextInput from '../UIComponents/TextInput'
import PermissionRequestView from './PermissionRequestView'

declare var __static: string

type User = {
  id: ID,
  data: Object,
}

type App = {
  appID: ID,
  manifest: Object,
  contentsPath: string,
}

type Session = {
  id: ID,
  permission: Object,
}

export type AppSessionData = {
  app: App,
  user: User,
  session: Session,
  isDev?: boolean,
}

type Props = {
  appSession: AppSessionData,
  partition: string,
}

type State = {
  urlInputValue: string,
  contentsPath: string,
  bundleUrl: string,
  showUrlButtons?: ?boolean,
}

const store = new Store()

export default class AppContainer extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const bundleUrl = url.format({
      pathname: path.join(props.appSession.app.contentsPath, 'index.html'),
      protocol: 'file:',
      slashes: true,
    })
    const cachedData = store.get(props.appSession.app.appID)
    const customUrl = cachedData ? cachedData.customUrl : null
    this.state = {
      bundleUrl,
      urlInputValue: customUrl || bundleUrl,
      contentsPath: customUrl || bundleUrl,
    }
  }

  onChangeUrl = (value: string) => {
    this.setState({
      urlInputValue: value,
    })
  }

  onFocusUrlInput = () => {
    this.setState({
      showUrlButtons: true,
    })
  }

  onBlurUrlInput = () => {
    this.setState({
      showUrlButtons: false,
    })
  }

  onKeyPress = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      this.relaodContents()
    }
  }

  resetUrl = () => {
    this.setState({
      urlInputValue: this.state.bundleUrl,
      contentsPath: this.state.bundleUrl,
    })
    this.persistCustomUrl(null)
  }

  relaodContents = () => {
    this.setState({
      contentsPath: this.state.urlInputValue,
    })
    this.persistCustomUrl(this.state.urlInputValue)
  }

  persistCustomUrl(url: ?string) {
    store.set(this.props.appSession.app.appID, {
      customUrl: url,
    })
  }

  render() {
    const { appSession } = this.props
    if (!appSession) {
      return <View />
    }
    const preloadPath = url.format({
      pathname: path.join(__static, 'preload.js'),
      protocol: 'file:',
      slashes: true,
    })

    const appUrl = this.state.contentsPath || this.state.bundleUrl

    const buttons = this.state.showUrlButtons ? (
      <View style={styles.rowContainer}>
        <Button
          title="reload"
          onPress={this.relaodContents}
          style={styles.reloadButton}
          textStyle={styles.buttonTextStyle}
        />
        <Button
          title="reset"
          onPress={this.resetUrl}
          style={[styles.reloadButton, styles.resetButton]}
          textStyle={styles.buttonTextStyle}
        />
      </View>
    ) : null

    const urlBar = this.props.appSession.isDev ? (
      <View style={[styles.rowContainer, styles.urlContainer]}>
        <Text style={styles.headerLabel}>Contents path: </Text>
        <TextInput
          onBlur={this.onBlurUrlInput}
          onFocus={this.onFocusUrlInput}
          style={styles.urlInput}
          value={this.state.urlInputValue}
          placeholder="custom url e.g. http://localhost:3000"
          onChangeText={this.onChangeUrl}
          onKeyPress={this.onKeyPress}
        />
        {buttons}
      </View>
    ) : null

    return (
      <View style={styles.outerContainer}>
        <View style={styles.header}>
          <View style={styles.appInfo}>
            <Text style={styles.headerLabel}>
              App:
              <Text style={styles.boldLabel}>
                {` ${appSession.app.manifest.name}`}
              </Text>{' '}
            </Text>
          </View>
          {urlBar}
          <View style={styles.identity}>
            <Text style={styles.headerLabel}>
              User:{' '}
              <Text style={styles.boldLabel}> {appSession.user.data.name}</Text>
            </Text>
          </View>
        </View>
        <PermissionRequestView appSession={this.props.appSession} />
        <webview
          id="sandbox-webview"
          src={appUrl}
          preload={preloadPath}
          style={{ flex: 1 }} // eslint-disable-line react-native/no-inline-styles
          sandboxed="true"
          partition={this.props.partition}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  header: {
    height: 40,
    flexDirection: 'row',
    backgroundColor: colors.LIGHT_GREY_F7,
    alignItems: 'center',
  },
  appInfo: {
    paddingLeft: 10,
    flex: 1,
  },
  identity: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'right',
    textAlign: 'right',
    flex: 1,
  },
  headerLabel: {
    color: colors.GREY_DARK_54,
    fontSize: 12,
  },
  boldLabel: {
    fontWeight: 'bold',
  },
  urlInput: {
    height: 30,
    fontSize: 12,
    marginRight: 8,
    minWidth: 250,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  urlContainer: {
    alignItems: 'center',
  },
  reloadButton: {
    height: 30,
    paddingVertical: 0,
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginRight: 8,
  },
  resetButton: {
    backgroundColor: colors.GREY_DARK_54,
  },
  buttonTextStyle: {
    fontSize: 12,
  },
})
