// @flow

import path from 'path'
import url from 'url'
import Store from 'electron-store'
import type { ID } from '@mainframe/utils-id'
import React, { Component } from 'react'
import { flattenDeep } from 'lodash'
import {
  ThemeProvider as MFThemeProvider,
  Button,
  Text,
  TextField,
} from '@morpheus-ui/core'
import { Form, type FormSubmitPayload } from '@morpheus-ui/forms'
import NetworkIcon from '@morpheus-ui/icons/NetworkSm'
import CloseIcon from '@morpheus-ui/icons/Close'

import styled from 'styled-components/native'
import { EthClient } from '@mainframe/eth'
import WalletIcon from '../UIComponents/Icons/Wallet'

import THEME from '../theme'
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
  multipleWallets?: ?boolean,
}

const store = new Store()

const OuterContainer = styled.View`
  flex: 1;
`
const Header = styled.View`
  background-color: #232323;
`

const ActionBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 42px;
  padding: 0 1px 2px 0;
`

const URLContainer = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  margin-left: 10px;
  margin-right: 10px;
  background-color: #303030;
  border-radius: 3px;
  height: 30px;
  overflow: hidden;
`

const FieldContainer = styled.View`
  flex: 1;
  margin-left: 10px;
  height: 22px;
`
const TitleBar = styled.View`
  align-items: center;
  justify-content: center;
`

const HeaderButtons = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  padding-right: 6px;
`

const EthNetwork = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
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

  componentDidMount() {
    this.fetchWallets()
  }

  async fetchWallets() {
    const wallets = await rpc.getUserEthWallets()
    const addresses = flattenDeep([
      ...wallets.hd.map(item => item.accounts),
      ...wallets.ledger.map(item => item.accounts),
    ])

    if (addresses.length > 1) {
      this.setState({ multipleWallets: true })
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

  resetUrl = () => {
    this.setState({
      urlInputValue: this.state.bundleUrl,
      contentsPath: this.state.bundleUrl,
    })
    this.persistCustomUrl(null)
  }

  reloadContents = (payload: FormSubmitPayload) => {
    if (payload.valid) {
      this.setState({ contentsPath: payload.fields.contentsPath })
      this.persistCustomUrl(payload.fields.contentsPath)
    }
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
      return <OuterContainer />
    }
    const preloadPath = url.format({
      pathname: path.join(__static, 'preload.js'),
      protocol: 'file:',
      slashes: true,
    })

    const appUrl = this.state.contentsPath || this.state.bundleUrl

    const urlBar = this.props.appSession.isDev ? (
      <URLContainer>
        <Form onSubmit={this.reloadContents}>
          <Text
            size={11}
            bold
            color="#808080"
            theme={{ padding: '10px', backgroundColor: '#010101' }}>
            Path
          </Text>
          <FieldContainer>
            <TextField
              name="contentsPath"
              variant="trustedUI"
              onBlur={this.onBlurUrlInput}
              onFocus={this.onFocusUrlInput}
              value={this.state.urlInputValue}
              onChange={this.onChangeUrl}
              placeholder="custom url e.g. http://localhost:3000"
            />
          </FieldContainer>
          <Button variant="TuiUrl" Icon={CloseIcon} onPress={this.resetUrl} />
        </Form>
      </URLContainer>
    ) : null

    return (
      <MFThemeProvider theme={THEME}>
        <OuterContainer>
          <Header>
            <TitleBar className="draggable">
              <Text variant="TuiAppTitle">{appSession.app.manifest.name}</Text>
            </TitleBar>
            <ActionBar>
              <EthNetwork>
                <NetworkIcon color="#808080" width={14} height={14} />
                <Text color="#808080" bold size={11} variant="marginLeft5">
                  {this.state.ethNetwork}
                </Text>
              </EthNetwork>
              {urlBar}
              {this.state.multipleWallets && (
                <HeaderButtons>
                  <Button
                    variant="TuiWalletsButton"
                    title="Wallets"
                    Icon={WalletIcon}
                    onPress={this.onPressSelectWallet}
                  />
                </HeaderButtons>
              )}
            </ActionBar>
          </Header>
          <UserAlertView
            multipleWallets={this.state.multipleWallets}
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
        </OuterContainer>
      </MFThemeProvider>
    )
  }
}
