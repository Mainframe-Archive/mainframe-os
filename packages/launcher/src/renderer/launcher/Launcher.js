//@flow

import type {
  ID,
  AppGetAllResult as Apps,
  IdentityGetOwnUsersResult as OwnIdentities,
  AppOwnData,
  AppInstalledData,
} from '@mainframe/client'
import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native-web'

import type { VaultsData } from '../../types'

import colors from '../colors'
import Text from '../UIComponents/Text'
import ModalView from '../UIComponents/ModalView'
import rpc from './rpc'
import AppInstallModal from './AppInstallModal'
import AppGridItem from './AppGridItem'
import CreateAppModal from './DeveloperMode/CreateAppModal'
import IdentitySelectorView from './IdentitySelectorView'
import VaultManagerModal from './VaultManagerModal'
import SideMenu from './SideMenu'

const GRID_ITEMS_PER_ROW = 3

type State = {
  apps: Apps,
  identities: OwnIdentities,
  devMode: boolean,
  showAppInstallModal?: boolean,
  showAppCreateModal?: boolean,
  showModal: ?{
    type: 'app_create' | 'app_install' | 'select_id',
    data?: Object,
  },
  vaultsData?: VaultsData,
  selectIdForApp?: Object,
  appHoverByID?: string,
}

type AppData = AppOwnData | AppInstalledData

export default class App extends Component<{}, State> {
  state = {
    showModal: undefined,
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

  async getVaultsData() {
    try {
      const vaultsData = await rpc.getVaultsData()
      this.setState({
        vaultsData,
      })
      if (vaultsData.vaultOpen) {
        this.getApps()
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err)
    }
  }

  async getApps() {
    try {
      const res = await rpc.getApps()
      const identities = await rpc.getOwnUserIdentities()
      this.setState({
        apps: res,
        identities,
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('error: ', err)
    }
  }

  onOpenedVault = () => {
    this.getVaultsData()
  }

  // HANDLERS

  onPressInstall = () => {
    this.setState({
      showModal: {
        type: 'app_install',
      },
    })
  }

  onInstallComplete = () => {
    this.onCloseModal()
    this.getApps()
  }

  onOpenApp = async (app: AppData) => {
    this.setState({
      showModal: {
        type: 'select_id',
        data: {
          type: this.state.devMode ? 'own' : 'installed',
          app,
        },
      },
    })
  }

  onCloseModal = () => {
    this.setState({
      showModal: undefined,
    })
  }

  onSelectAppUser = async (userID: ID) => {
    const { showModal } = this.state
    if (
      showModal &&
      showModal.data &&
      showModal.data.app &&
      showModal.type === 'select_id'
    ) {
      const { app } = showModal.data
      if (app.users.findIndex(u => u.id === userID) === -1) {
        try {
          await rpc.setAppUserSettings(app.appID, userID, {
            permissions: {
              WEB_REQUEST: { granted: [], denied: [] },
            },
            permissionsChecked: false,
          })
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn(err)
        }
      }
      await rpc.launchApp(app.appID, userID)
      this.setState({
        showModal: undefined,
      })
    }
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
    this.getApps()
  }

  onAppRemoved = () => {
    this.getApps()
  }

  // RENDER

  renderVaultManager() {
    if (this.state.vaultsData) {
      return (
        <VaultManagerModal
          vaultsData={this.state.vaultsData}
          onOpenedVault={this.onOpenedVault}
        />
      )
    }
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    )
  }

  renderAppsGrid = (apps: Array<AppData>) => {
    if (!apps) {
      return null
    }
    const appRows = apps.reduce((rows, app, i) => {
      const rowIndex = Math.floor(i / GRID_ITEMS_PER_ROW)
      if (!rows[rowIndex]) {
        rows[rowIndex] = []
      }
      rows[rowIndex].push(
        <AppGridItem
          app={app}
          ownApp={this.state.devMode}
          onAppRemoved={this.onAppRemoved}
          onOpenApp={this.onOpenApp}
        />,
      )
      return rows
    }, [])

    const btnTitle = this.state.devMode ? 'Create new App' : 'Install App'
    const btnStyles = [styles.installButtonText]
    const onPress = this.state.devMode
      ? this.onPressCreate
      : this.onPressInstall
    if (this.state.devMode) {
      btnStyles.push(styles.createButtonText)
    }
    const installButton = (
      <TouchableOpacity
        key="install"
        style={styles.newAppButton}
        onPress={onPress}>
        <View style={styles.installAppButton}>
          <Text style={btnStyles}>{btnTitle}</Text>
        </View>
      </TouchableOpacity>
    )

    const lastRow = appRows[appRows.length - 1]
    if (lastRow && lastRow.length < GRID_ITEMS_PER_ROW) {
      lastRow.push(installButton)
    } else {
      appRows.push([installButton])
    }

    return appRows.map((row, i) => (
      <View key={i} style={styles.gridRow}>
        {row}
      </View>
    ))
  }

  render() {
    if (!this.state.vaultsData || !this.state.vaultsData.vaultOpen) {
      return this.renderVaultManager()
    }

    const { apps, devMode } = this.state

    const appsGrid = this.renderAppsGrid(devMode ? apps.own : apps.installed)

    let modal
    if (this.state.showModal) {
      switch (this.state.showModal.type) {
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
        case 'select_id':
          modal = (
            <ModalView isOpen={true} onRequestClose={this.onCloseModal}>
              <IdentitySelectorView
                enableCreate
                type="user"
                identities={this.state.identities.users}
                onSelectId={this.onSelectAppUser}
              />
            </ModalView>
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
          onToggleDevMode={this.onToggleDevMode}
        />
        <View style={appsContainerStyles}>
          <View style={styles.appsGrid}>{appsGrid}</View>
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
  appsGrid: {
    flexDirection: 'column',
    alignItems: 'left',
    width: 700,
  },
  gridRow: {
    marginTop: 20,
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  newAppButton: {
    marginHorizontal: 20,
    alignItems: 'center',
  },
  installAppButton: {
    width: 190,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.GREY_MED_81,
  },
  installButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.GREY_DARK_54,
  },
  createButtonText: {
    color: colors.LIGHT_GREY_BLUE,
  },
})
