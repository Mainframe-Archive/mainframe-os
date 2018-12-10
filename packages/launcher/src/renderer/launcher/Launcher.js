//@flow

import type {
  AppGetAllResult as Apps,
  IdentityGetOwnUsersResult as OwnIdentities,
  WalletGetEthWalletsResult as Wallets,
} from '@mainframe/client'
import { type StrictPermissionsGrants } from '@mainframe/app-permissions'
import React, { Component } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native-web'
import { graphql, QueryRenderer } from 'react-relay'

import type { VaultsData } from '../../types'

import colors from '../colors'
import globalStyles from '../styles'
import Text from '../UIComponents/Text'
import ModalView from '../UIComponents/ModalView'

import rpc from './rpc'
import { EnvironmentContext } from './RelayEnvironment'
import AppInstallModal from './AppInstallModal'
import CreateAppModal from './developer/CreateAppModal'
import PermissionsView from './PermissionsView'
import OnboardView from './OnboardView'
import UnlockVaultView from './UnlockVaultView'
import SideMenu from './SideMenu'
import AppsView from './apps/AppsView'

type State = {
  apps: Apps,
  identities: OwnIdentities,
  wallets?: Wallets,
  devMode: boolean,
  showAppInstallModal?: boolean,
  showAppCreateModal?: boolean,
  showModal: ?{
    type: 'app_create' | 'app_install',
    data?: Object,
  },
  relayError?: ?Error,
  vaultsData?: VaultsData,
  selectIdForApp?: Object,
  appHoverByID?: string,
}

export default class App extends Component<{}, State> {
  static contextType = EnvironmentContext

  state = {
    showModal: undefined,
    wallets: undefined,
    vaultsData: undefined,
    devMode: false,
    showAppInstallModal: false,
    identities: {
      users: [],
    },
    apps: {
      installed: [],
      own: [],
    },
  }

  componentDidMount() {
    this.getVaultsData()
  }

  getVaultsData = async () => {
    try {
      const vaultsData = await rpc.getVaultsData()
      this.setState({
        vaultsData,
      })
      if (vaultsData.vaultOpen) {
        this.getAppsAndUsers()
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err)
    }
  }

  getAppsAndUsers = async () => {
    try {
      const apps = await rpc.getApps()
      const identities = await rpc.getOwnUserIdentities()
      const wallets = await rpc.getEthWallets()
      this.setState({
        apps,
        identities,
        wallets,
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('error: ', err)
    }
  }

  // HANDLERS

  onOpenedVault = () => {
    this.getVaultsData()
  }

  onPressInstall = () => {
    this.setState({
      showModal: {
        type: 'app_install',
      },
    })
  }

  onInstallComplete = () => {
    this.onCloseModal()
    this.getAppsAndUsers()
  }

  onCloseModal = () => {
    this.setState({
      showModal: undefined,
    })
  }

  onToggleDevMode = () => {
    this.setState({
      devMode: !this.state.devMode,
    })
  }

  onPressCreate = () => {
    this.setState({
      showModal: {
        type: 'app_create',
      },
    })
  }

  onAppCreated = () => {
    this.onCloseModal()
    this.getAppsAndUsers()
  }

  onAppRemoved = () => {
    this.getAppsAndUsers()
  }

  onSubmitPermissions = async (permissionSettings: StrictPermissionsGrants) => {
    if (
      this.state.showModal &&
      this.state.showModal.type === 'accept_permissions' &&
      this.state.showModal.data
    ) {
      const { app, userID } = this.state.showModal.data
      try {
        await rpc.setAppUserPermissionsSettings(app.appId, userID, {
          grants: permissionSettings,
          permissionsChecked: true,
        })
        await this.getAppsAndUsers()
        await rpc.launchApp(app.appId, userID)
      } catch (err) {
        // TODO: - Error feedback
        // eslint-disable-next-line no-console
        console.warn(err)
      }
      this.setState({
        showModal: undefined,
      })
    }
  }

  // RENDER

  renderOnboarding() {
    return <OnboardView onboardComplete={this.getVaultsData} />
  }

  renderApps() {
    return (
      <QueryRenderer
        environment={this.context}
        query={graphql`
          query LauncherQuery {
            apps {
              ...AppsView_apps
            }
          }
        `}
        variables={{}}
        render={({ error, props }) => {
          /* eslint-disable no-console */
          if (error) {
            console.log('GraphQL query error:', error)
            this.setState({
              relayError: error,
            })
          } else if (props) {
            console.log('GraphQL got apps data:', props)
            return (
              <View>
                <AppsView apps={props.apps} />
              </View>
            )
          } else {
            return (
              <View>
                <ActivityIndicator />
              </View>
            )
          }
          /* eslint-enable no-console */
          return null
        }}
      />
    )
  }

  render() {
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

    let modal
    if (this.state.showModal) {
      switch (this.state.showModal.type) {
        case 'accept_permissions': {
          // $FlowFixMe ignore undefined warning
          const { app } = this.state.showModal.data
          modal = (
            <ModalView isOpen={true} onRequestClose={this.onCloseModal}>
              <Text style={globalStyles.header}>
                Permission Requested by {app.manifest.name}
              </Text>
              <PermissionsView
                permissions={app.manifest.permissions}
                onSubmit={this.onSubmitPermissions}
              />
            </ModalView>
          )
          break
        }
        case 'app_install':
          modal = (
            <AppInstallModal
              onRequestClose={this.onCloseModal}
              onInstallComplete={this.onInstallComplete}
            />
          )
          break
        case 'app_create':
          modal = (
            <CreateAppModal
              onRequestClose={this.onCloseModal}
              onAppCreated={this.onAppCreated}
            />
          )
          break
        default:
      }
    }

    const sideBarStyles = [styles.sideBarView]
    const appsContainerStyles = [styles.appsView]
    if (this.state.devMode) {
      sideBarStyles.push(styles.sideBarDark)
      appsContainerStyles.push(styles.appsViewDev)
    }

    return (
      <View style={styles.container} testID="launcher-view">
        <SideMenu
          devMode={this.state.devMode}
          identities={this.state.identities}
          wallets={this.state.wallets}
          onToggleDevMode={this.onToggleDevMode}
        />
        <View style={appsContainerStyles}>
          <ScrollView contentContainerStyle={styles.appsGrid}>
            {this.renderApps()}
          </ScrollView>
        </View>
        {modal}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: '100vh',
  },
  appsView: {
    padding: 20,
    alignItems: 'center',
    flex: 1,
  },
  appsViewDev: {
    backgroundColor: colors.DARK_BLUE_GREY,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
})
