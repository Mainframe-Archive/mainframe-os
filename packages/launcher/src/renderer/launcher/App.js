//@flow

import React, { Component } from 'react'
import { ActivityIndicator } from 'react-native'
import { ThemeProvider as MFThemeProvider } from '@morpheus-ui/core'
import styled from 'styled-components/native'

import THEME from '../theme'

import type { VaultsData } from '../../types'

import rpc from './rpc'
import { EnvironmentContext } from './RelayEnvironment'
import OnboardView from './OnboardView'
import UnlockVaultView from './UnlockVaultView'
import Launcher from './Launcher'

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
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
}

export default class App extends Component<{}, State> {
  static contextType = EnvironmentContext

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
          <ActivityIndicator />
        </LoadingContainer>
      )
    }

    if (!this.state.vaultsData.defaultVault) {
      return this.renderOnboarding()
    }

    if (!this.state.vaultsData.vaultOpen) {
      return (
        <UnlockVaultView
          vaultsData={this.state.vaultsData || {}}
          onUnlockVault={this.onOpenedVault}
        />
      )
    }
    return <Launcher />
  }

  render() {
    return (
      <MFThemeProvider theme={THEME}>
        <Container>
          <TitleBar className="draggable" />
          {this.renderContent()}
        </Container>
      </MFThemeProvider>
    )
  }
}
