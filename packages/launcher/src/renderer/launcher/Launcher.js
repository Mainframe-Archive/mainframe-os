//@flow

import React, { Component } from 'react'
import { ScrollView, ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'
import { ThemeProvider as MFThemeProvider } from '@morpheus-ui/core'

import THEME from '../theme'

import type { VaultsData } from '../../types'
import OSLogo from '../UIComponents/MainframeOSLogo'
import rpc from './rpc'
import { EnvironmentContext } from './RelayEnvironment'

import OnboardView from './OnboardView'
import UnlockVaultView from './UnlockVaultView'
import CompleteOnboardSession from './CompleteOnboardSession'
import SideMenu, { type ScreenNames } from './SideMenu'
import AppsScreen from './apps/AppsScreen'

const Container = styled.View`
  flex-direction: 'row';
  height: '100vh';
  flex: 1;
`

const ContentContainer = styled.View`
  padding: 20px 50px;
  flex: 1;
`

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: 'center';
`

const Header = styled.View`
  height: 50px;
`

type State = {
  vaultsData?: VaultsData,
  openScreen: ScreenNames,
}

export default class App extends Component<{}, State> {
  static contextType = EnvironmentContext

  state = {
    vaultsData: undefined,
    openScreen: 'apps',
  }

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

  setOpenScreen = (name: ScreenNames) => {
    this.setState({
      openScreen: name,
    })
  }

  // RENDER

  renderOnboarding() {
    return <OnboardView onboardComplete={this.getVaultsData} />
  }

  renderScreen() {
    return <AppsScreen />
  }

  renderInside() {
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

    return (
      <Container testID="launcher-view">
        <SideMenu
          selected={this.state.openScreen}
          onSelectMenuItem={this.setOpenScreen}
        />
        <ContentContainer>
          <Header>
            <OSLogo />
          </Header>
          <CompleteOnboardSession onSelectItem={() => {}} onSkip={() => {}} />
          <ScrollView>{this.renderScreen()}</ScrollView>
        </ContentContainer>
      </Container>
    )
  }

  render() {
    return (
      <MFThemeProvider theme={THEME}>{this.renderInside()}</MFThemeProvider>
    )
  }
}
