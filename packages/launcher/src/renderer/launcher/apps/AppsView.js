// @flow

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native-web'
import { createFragmentContainer, graphql } from 'react-relay'
import {
  havePermissionsToGrant,
  type StrictPermissionsGrants,
} from '@mainframe/app-permissions'
import type { AppOwnData, AppInstalledData, ID } from '@mainframe/client'

import colors from '../../colors'
import rpc from '../rpc'
import globalStyles from '../../styles'
import Text from '../../UIComponents/Text'
import ModalView from '../../UIComponents/ModalView'
import IdentitySelectorView from '../IdentitySelectorView'
import CreateAppModal from '../developer/CreateAppModal'
import PermissionsView from '../PermissionsView'
import AppInstallModal from './AppInstallModal'
import { OwnAppItem, InstalledAppItem } from './AppItem'

type AppData = AppOwnData | AppInstalledData

export type Apps = {
  installed: Array<AppData>,
  own: Array<AppData>,
}

type Props = {
  apps: Apps,
}

type State = {
  showModal?: ?{
    type: 'select_id' | 'accept_permissions' | 'app_install' | 'app_create',
    data?: ?{
      app: AppData,
      own: boolean,
      userID?: ID,
    },
  },
}

class AppsView extends Component<Props, State> {
  state = {}

  // App Install

  onPressInstall = () => {
    this.setState({
      showModal: {
        type: 'app_install',
      },
    })
  }

  onInstallComplete = () => {
    this.onCloseModal()
  }

  onSubmitPermissions = async (permissionSettings: StrictPermissionsGrants) => {
    if (
      this.state.showModal &&
      this.state.showModal.type === 'accept_permissions' &&
      this.state.showModal.data &&
      this.state.showModal.data.userID
    ) {
      const { app, userID } = this.state.showModal.data
      try {
        await rpc.setAppUserPermissionsSettings(app.localID, userID, {
          grants: permissionSettings,
          permissionsChecked: true,
        })
        await rpc.launchApp(app.localID, userID)
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

  // App Creation

  onPressCreateApp = () => {
    this.setState({
      showModal: {
        type: 'app_create',
      },
    })
  }

  onOpenApp = (app: AppData, own: boolean) => {
    this.setState({
      showModal: {
        type: 'select_id',
        data: {
          app,
          own,
        },
      },
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
      const { app, own } = showModal.data
      const user = app.users.find(u => u.localID === userID)
      if (
        !own &&
        havePermissionsToGrant(app.manifest.permissions) &&
        (!user || !user.settings.permissionsSettings.permissionsChecked)
      ) {
        // If this user hasn't used the app before
        // we need to ask to accept permissions
        const data = { ...showModal.data }
        data['userID'] = userID
        this.setState({
          showModal: {
            type: 'accept_permissions',
            data,
          },
        })
      } else {
        try {
          await rpc.launchApp(app.localID, userID)
        } catch (err) {
          // TODO: - Error feedback
        }
        this.setState({
          showModal: undefined,
        })
      }
    }
  }

  onCloseModal = () => {
    this.setState({
      showModal: undefined,
    })
  }

  onAppCreated = () => {
    this.onCloseModal()
  }

  // RENDER

  renderApp(app: AppData, own: boolean) {
    return own ? (
      <OwnAppItem ownApp={app} onOpenApp={this.onOpenApp} />
    ) : (
      <InstalledAppItem installedApp={app} onOpenApp={this.onOpenApp} />
    )
  }

  renderApps(apps: Array<AppData>, own: boolean) {
    return (
      <View>
        <Text>{own ? 'Own Apps' : 'Installed App'}</Text>
        {apps.map(app => this.renderApp(app, own))}
      </View>
    )
  }

  renderInstalled() {
    return this.renderApps(this.props.apps.installed, false)
  }

  renderOwn() {
    return this.renderApps(this.props.apps.own, true)
  }

  renderIdentitySelector() {
    return (
      <ModalView isOpen={true} onRequestClose={this.onCloseModal}>
        <IdentitySelectorView
          enableCreate
          type="user"
          onSelectId={this.onSelectAppUser}
          onCreatedId={this.onSelectAppUser}
        />
      </ModalView>
    )
  }

  renderButton(title: string, onPress: () => void, testID: string) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.createApp}
        testID={testID}>
        <Text style={styles.createAppLabel}>{title}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    let modal
    if (this.state.showModal) {
      switch (this.state.showModal.type) {
        case 'select_id':
          modal = this.renderIdentitySelector()
          break
        case 'app_install':
          modal = (
            <AppInstallModal
              onRequestClose={this.onCloseModal}
              onInstallComplete={this.onInstallComplete}
            />
          )
          break
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
    return (
      <ScrollView style={styles.container}>
        {this.renderInstalled()}
        {this.renderButton(
          'Install App',
          this.onPressInstall,
          'launcher-install-app-button',
        )}
        {this.renderOwn()}
        {this.renderButton(
          'Create new App',
          this.onPressCreateApp,
          'launcher-create-app-button',
        )}
        {modal}
      </ScrollView>
    )
  }
}

export default createFragmentContainer(AppsView, {
  apps: graphql`
    fragment AppsView_apps on AppsQuery {
      installed {
        ...AppItem_installedApp
      }
      own {
        ...AppItem_ownApp
      }
    }
  `,
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  createApp: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: colors.BRIGHT_BLUE,
  },
  createAppLabel: {
    color: colors.WHITE,
  },
})
