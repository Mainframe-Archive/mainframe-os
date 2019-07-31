// @flow

import path from 'path'
import url from 'url'
import { remote } from 'electron'
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

import type { AppWindowSession } from '../../types'

import WalletIcon from '../UIComponents/Icons/Wallet'
import THEME from '../theme'

import rpc, { getEthClient } from './rpc'
import UserAlertView from './UserAlertView'

declare var __static: string

const PRELOAD_URL = url.format({
  pathname: path.join(__static, 'preload.bundle.js'),
  protocol: 'file:',
  slashes: true,
})

type Props = {
  session: AppWindowSession,
}

type State = {
  urlInputValue: string,
  contentsPath: string,
  showUrlButtons?: ?boolean,
  ethNetwork: string,
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

export default class AppContainer extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const cachedData = store.get(props.session.app.publicID)
    const customUrl = cachedData ? cachedData.customUrl : null
    const ethClient = getEthClient()
    this.state = {
      urlInputValue: customUrl || props.session.app.contentsURL,
      contentsPath: customUrl || props.session.app.contentsURL,
      ethNetwork: ethClient.networkName,
    }
    ethClient.on('networkChanged', () => {
      this.setState({ ethNetwork: ethClient.networkName })
    })
  }

  onChangeUrl = (value: string) => {
    this.setState({ urlInputValue: value })
  }

  onFocusUrlInput = () => {
    this.setState({ showUrlButtons: true })
  }

  onBlurUrlInput = () => {
    this.setState({ showUrlButtons: false })
  }

  resetUrl = () => {
    this.setState({
      urlInputValue: this.props.session.app.contentsURL,
      contentsPath: this.props.session.app.contentsURL,
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
    store.set(this.props.session.app.publicID, {
      customUrl: url,
    })
  }

  onPressSelectWallet = async () => {
    await rpc.selectDefaultWallet()
  }

  // RENDER

  render() {
    const { session } = this.props
    const multipleWallets = session.user.walletAddresses.length > 1

    const urlBar = session.isDevelopment ? (
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
            {remote.process.platform === 'darwin' ? (
              <TitleBar className="draggable">
                <Text variant="TuiAppTitle">{session.app.profile.name}</Text>
              </TitleBar>
            ) : null}
            <ActionBar>
              <EthNetwork>
                <NetworkIcon color="#808080" width={14} height={14} />
                <Text color="#808080" bold size={11} variant="marginLeft5">
                  {this.state.ethNetwork}
                </Text>
              </EthNetwork>
              {urlBar}
              {multipleWallets ? (
                <HeaderButtons>
                  <Button
                    variant="TuiWalletsButton"
                    title="Wallets"
                    Icon={WalletIcon}
                    onPress={this.onPressSelectWallet}
                  />
                </HeaderButtons>
              ) : null}
            </ActionBar>
          </Header>
          <UserAlertView multipleWallets={multipleWallets} session={session} />
          <webview
            id="sandbox-webview"
            src={this.state.contentsPath || session.app.contentsURL}
            preload={PRELOAD_URL}
            style={{ flex: 1 }} // eslint-disable-line react-native/no-inline-styles
            sandboxed="true"
            partition={session.partition}
          />
        </OuterContainer>
      </MFThemeProvider>
    )
  }
}
