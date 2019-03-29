// @flow

import path from 'path'
import url from 'url'
import Store from 'electron-store'
import type { ID } from '@mainframe/utils-id'
import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native-web'
import { ThemeProvider as MFThemeProvider, Button } from '@morpheus-ui/core'
import WalletsFilledIcon from '@morpheus-ui/icons/WalletsFilledMd'
import styled from 'styled-components/native'
import { EthClient } from '@mainframe/eth'

import THEME from '../theme'
import colors from '../colors'
import Text from '../UIComponents/Text'
import TextInput from '../UIComponents/TextInput'
import rpc from './rpc'
import UserAlertView from './UserAlertView'

declare var __static: string

type User = {
  id: ID,
  profile: Object,
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
  ethNetwork: string,
}

const store = new Store()

const TitleBar = styled.View`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 20px;
  background-color: transparent;
  align-items: center;
  justify-content: center;
`

const HeaderButtons = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  padding-right: 6px;
  flex: 1;
`

const EthNetwork = styled.View`
  height: 28px;
  margin-right: 10px;
  background-color: #171717;
  border-radius: 3px;
  padding-horizontal: 10px;
  justify-content: center;
`

// TODO: Refactor various web3 providers
const ethClientProvider = {
  sendPayload: async payload => {
    const res = await rpc.ethSend(payload)
    const jsonResponse = {
      jsonrpc: '2.0',
      id: payload.id,
      result: res,
    }
    return jsonResponse
  },
}

const subscriptions = {
  networkChanged: rpc.ethNetworkChangedSubscription,
  accountsChanged: rpc.ethAccountsChangedSubscription,
}

export default class AppContainer extends Component<Props, State> {
  eth: EthClient

  constructor(props: Props) {
    super(props)
    const bundleUrl = url.format({
      pathname: path.join(props.appSession.app.contentsPath, 'index.html'),
      protocol: 'file:',
      slashes: true,
    })
    const cachedData = store.get(props.appSession.app.appID)
    const customUrl = cachedData ? cachedData.customUrl : null
    this.eth = new EthClient(ethClientProvider, null, subscriptions)
    this.state = {
      bundleUrl,
      urlInputValue: customUrl || bundleUrl,
      contentsPath: customUrl || bundleUrl,
      ethNetwork: this.eth.networkName,
    }
    this.eth.on('networkChanged', () => {
      this.setState({
        ethNetwork: this.eth.networkName,
      })
    })
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

  onPressSelectWallet = async () => {
    await rpc.selectDefaultWallet()
  }

  // RENDER

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
      <MFThemeProvider theme={THEME}>
        <View style={styles.outerContainer}>
          <View style={styles.header}>
            <TitleBar className="draggable">
              <View style={styles.appInfo}>
                <Text style={styles.headerLabel}>
                  <Text style={styles.boldLabel}>
                    {appSession.app.manifest.name}
                  </Text>
                </Text>
              </View>
            </TitleBar>
            {urlBar}
            <HeaderButtons>
              <EthNetwork>
                <Text style={styles.headerLabel}>{this.state.ethNetwork}</Text>
              </EthNetwork>
              <Button
                variant={['appHeader']}
                Icon={WalletsFilledIcon}
                onPress={this.onPressSelectWallet}
              />
            </HeaderButtons>
          </View>
          <UserAlertView
            ethClient={this.eth}
            appSession={this.props.appSession}
          />
          <webview
            id="sandbox-webview"
            src={appUrl}
            preload={preloadPath}
            style={{ flex: 1 }} // eslint-disable-line react-native/no-inline-styles
            sandboxed="true"
            partition={this.props.partition}
          />
        </View>
      </MFThemeProvider>
    )
  }
}

const styles = StyleSheet.create({
  appInfo: {
    flex: 1,
    paddingLeft: 10,
  },
  boldLabel: {
    fontWeight: 'bold',
  },
  buttonTextStyle: {
    color: colors.GREY_DARK_54,
    fontSize: 12,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.GREY_DARK_23,
    flexDirection: 'row',
    height: 60,
    paddingTop: 20,
  },
  headerLabel: {
    color: colors.LIGHT_GREY_CC,
    fontSize: 12,
    textAlign: 'left',
  },
  outerContainer: {
    flex: 1,
  },
  reloadButton: {
    height: 30,
    justifyContent: 'center',
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 0,
  },
  resetButton: {
    backgroundColor: colors.LIGHT_GREY_F7,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  urlContainer: {
    alignItems: 'center',
    marginLeft: 10,
  },
  urlInput: {
    backgroundColor: colors.GREY_DARK_38,
    borderColor: colors.GREY_DARK_48,
    color: colors.LIGHT_GREY_F7,
    fontSize: 12,
    height: 28,
    marginHorizontal: 8,
    minWidth: 250,
  },
})
