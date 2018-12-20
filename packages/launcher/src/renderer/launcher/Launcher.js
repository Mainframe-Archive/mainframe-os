//@flow

import React, { Component } from 'react'
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'

import { ThemeProvider as MFThemeProvider } from '@morpheus-ui/core'

import THEME from '../theme'

import type { VaultsData } from '../../types'
import rpc from './rpc'
import { EnvironmentContext } from './RelayEnvironment'
import OnboardView from './OnboardView'
import UnlockVaultView from './UnlockVaultView'
import SideMenu, { type ScreenNames } from './SideMenu'
import AppsScreen from './apps/AppsScreen'
import IdentitiesScreen from './identities/IdentitiesScreen'
import WalletsScreen from './wallets/WalletsScreen'

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
    switch (this.state.openScreen) {
      case 'apps':
        return <AppsScreen />
      case 'identities':
        return <IdentitiesScreen />
      case 'wallets':
        return <WalletsScreen />
    }
  }

  renderInside() {
    if (!this.state.vaultsData) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
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
      <View style={styles.container} testID="launcher-view">
        <SideMenu
          selected={this.state.openScreen}
          onSelectMenuItem={this.setOpenScreen}
        />
        <View style={styles.contentContainer}>
          <ScrollView>{this.renderScreen()}</ScrollView>
        </View>
      </View>
    )
  }

  render() {
    return (
      <MFThemeProvider theme={THEME}>{this.renderInside()}</MFThemeProvider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: '100vh',
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
})
