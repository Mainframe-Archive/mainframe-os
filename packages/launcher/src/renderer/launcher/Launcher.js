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

import colors from '../colors'
import type { VaultsData } from '../../types'
import rpc from '../rpc'
import Text from '../UIComponents/Text'
import ModalView from '../UIComponents/ModalView'
import AppInstallModal from './AppInstallModal'
import IdentitySelectorView from './IdentitySelectorView'
import VaultManagerModal from './VaultManagerModal'
import SideMenu from './SideMenu'

const GRID_ITEMS_PER_ROW = 3

type State = {
  devMode: boolean,
  showAppInstallModal: boolean,
  vaultsData?: VaultsData,
  selectIdForApp?: Object,
  apps: Apps,
  identities: OwnIdentities,
}

type AppData = AppOwnData | AppInstalledData

export default class App extends Component<{}, State> {
  state = {
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
      showAppInstallModal: true,
    })
  }

  onCloseInstallModal = () => {
    this.setState({
      showAppInstallModal: false,
    })
  }

  onInstallComplete = () => {
    this.onCloseInstallModal()
    this.getApps()
  }

  onOpenApp = async (app: AppData) => {
    this.setState({
      selectIdForApp: {
        type: this.state.devMode ? 'own' : 'installed',
        app,
      },
    })
  }

  onCloseIdSelector = () => {
    this.setState({
      selectIdForApp: undefined,
    })
  }

  onSelectAppUser = async (userID: ID) => {
    if (this.state.selectIdForApp) {
      const { selectIdForApp } = this.state
      if (selectIdForApp.app.users.findIndex(u => u.id === userID) === -1) {
        // TODO add to app
        try {
          await rpc.setAppUserSettings(selectIdForApp.app.appID, userID, {
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
      switch (selectIdForApp.type) {
        case 'own':
          this.openOwn(selectIdForApp.app.appID, userID)
          break
        case 'installed':
          this.openInstalled(selectIdForApp.app.appID, userID)
          break
        default:
          return
      }
    }
  }

  async openInstalled(appID: ID, userID: ID) {
    await rpc.launchApp(appID, userID)
    this.setState({
      selectIdForApp: undefined,
    })
  }

  async openOwn(appID: ID, userID: ID) {
    await rpc.launchApp(appID, userID)
    this.setState({
      selectIdForApp: undefined,
    })
  }

  onToggleDevMode = () => {
    this.setState({
      devMode: !this.state.devMode,
    })
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

  renderAppItem = (app: AppData) => {
    const onClick = () => this.onOpenApp(app)

    const onClickDelete = async () => {
      await rpc.removeApp(app.appID)
      this.getApps()
    }

    const nameStyles = [styles.appName]
    if (this.state.devMode) {
      nameStyles.push(styles.lightText)
    }

    const rightItem = !this.state.devMode ? (
      <TouchableOpacity
        onPress={onClickDelete}
        style={styles.deleteApp}
        key={app.appID}>
        <Text style={styles.deleteLabel}>Delete</Text>
      </TouchableOpacity>
    ) : (
      <Text style={styles.versionText}>{app.manifest.version}</Text>
    )

    return (
      <TouchableOpacity
        key={app.appID}
        style={styles.appItem}
        onPress={onClick}
        testID={'launcher-open-app'}>
        <View style={styles.appItemInner}>
          <View style={styles.appIcon} />
          <View style={styles.appInfo}>
            <Text style={nameStyles}>
              {app.manifest ? app.manifest.name : app.appID}
            </Text>
            {rightItem}
          </View>
        </View>
      </TouchableOpacity>
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
      rows[rowIndex].push(this.renderAppItem(app))
      return rows
    }, [])
    const installButton = (
      <TouchableOpacity
        key="install"
        style={styles.appItem}
        onPress={this.onPressInstall}>
        <View style={styles.installAppButton}>
          <Text style={styles.installButtonText}>Install App</Text>
        </View>
      </TouchableOpacity>
    )

    if (!this.state.devMode) {
      const lastRow = appRows[appRows.length - 1]
      if (lastRow && lastRow.length < GRID_ITEMS_PER_ROW) {
        lastRow.push(installButton)
      } else {
        appRows.push([installButton])
      }
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

    const installModal = this.state.showAppInstallModal ? (
      <AppInstallModal
        onRequestClose={this.onCloseInstallModal}
        onInstallComplete={this.onInstallComplete}
      />
    ) : null
    const appIdentitySelector = this.state.selectIdForApp ? (
      <ModalView isOpen={true} onRequestClose={this.onCloseIdSelector}>
        <IdentitySelectorView
          enableCreate
          users={this.state.identities.users}
          onSelectId={this.onSelectAppUser}
        />
      </ModalView>
    ) : null

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
        {installModal}
        {appIdentitySelector}
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
    padding: 10,
    alignItems: 'center',
    flex: 1,
  },
  appsViewDev: {
    backgroundColor: colors.GREY_DARK_54,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  appsGrid: {
    marginTop: 20,
    width: 800,
    flexDirection: 'column',
    alignItems: 'left',
  },
  gridRow: {
    marginTop: 20,
    height: 250,
    flexDirection: 'row',
  },
  appItem: {
    flex: 3,
    marginHorizontal: 25,
    alignItems: 'center',
  },
  appItemInner: {
    width: 210,
    height: 230,
    marginBottom: 10,
  },
  appIcon: {
    width: 210,
    height: 180,
    borderRadius: 4,
    backgroundColor: colors.LIGHT_GREY_E8,
  },
  deleteApp: {
    backgroundColor: colors.GREY_MED_81,
    color: colors.WHITE,
    borderRadius: 11,
    height: 22,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  deleteLabel: {
    fontSize: 10,
  },
  appInfo: {
    flexDirection: 'row',
    marginTop: 10,
    flex: 1,
  },
  appName: {
    flex: 1,
    fontSize: 13,
    fontWeight: 'bold',
  },
  versionText: {
    color: colors.LIGHT_GREY_AE,
    paddingLeft: 10,
    fontSize: 12,
  },
  lightText: {
    color: colors.LIGHT_GREY_DE,
  },
  installAppButton: {
    width: 210,
    height: 180,
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
})
