//@flow

import React, { Component } from 'react'
import { ThemeProvider as MFThemeProvider } from '@morpheus-ui/core'
import styled from 'styled-components/native'

import AlertToast from '../UIComponents/AlertToast'

import Loader from '../UIComponents/Loader'

import THEME from '../theme'

import type { VaultsData } from '../../types'

import rpc from './rpc'
import { EnvironmentContext } from './RelayEnvironment'
import OnboardView from './onboarding/OnboardView'
import UnlockVaultView from './UnlockVaultView'
import CreateVaultView from './CreateVaultView'
import Launcher from './Launcher'

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`

const Container = styled.View`
  flex: 1;
`

const TitleBar = styled.View`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 20px;
  background-color: transparent;
`
type State = {
  vaultsData?: VaultsData,
  message?: ?string,
}

export default class App extends Component<{}, State> {
  static contextType = EnvironmentContext
  _messageTimer: ?TimeoutID

  state = {}

  componentDidMount() {
    this.getVaultsData()
  }

  // HANDLERS

  getVaultsData = async () => {
    try {
      const vaultsData = await rpc.getVaultsData()
      this.setState({
        vaultsData,
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err)
    }
  }

  onOpenedVault = () => {
    this.getVaultsData()
  }

  // RENDER

  renderOnboarding() {
    return <OnboardView onboardComplete={this.getVaultsData} />
  }

  renderContent() {
    if (!this.state.vaultsData) {
      return (
        <LoadingContainer>
          <Loader />
        </LoadingContainer>
      )
    }

    if (!this.state.vaultsData.defaultVault) {
      return <CreateVaultView onVaultCreated={this.onOpenedVault} />
    }

    if (!this.state.vaultsData.vaultOpen) {
      return (
        <UnlockVaultView
          vaultsData={this.state.vaultsData || {}}
          onUnlockVault={this.onOpenedVault}
        />
      )
    }

    return <Launcher showAlert={this.showAlert} />
  }

  showAlert = (message: string, timeout: number = 3000) => {
    this.setState(
      {
        message,
      },
      () => this.dismissAlert(timeout),
    )
  }

  dismissAlert = (timeout: number = 3000) => {
    if (this._messageTimer) {
      clearTimeout(this._messageTimer)
      this._messageTimer = null
    }

    this._messageTimer = setTimeout(() => {
      this.setState({
        message: null,
      })
      clearTimeout(this._messageTimer)
      this._messageTimer = null
    }, timeout)
  }

  render() {
    return (
      <MFThemeProvider theme={THEME}>
        <>
          <Container>
            <TitleBar className="draggable" />
            {this.renderContent()}
          </Container>
          <AlertToast
            message={this.state.message}
            onRequestClose={this.dismissAlert}
          />
        </>
      </MFThemeProvider>
    )
  }
}
