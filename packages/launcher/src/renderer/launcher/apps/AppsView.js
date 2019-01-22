// @flow

import React, { Component } from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import {
  havePermissionsToGrant,
  type StrictPermissionsGrants,
} from '@mainframe/app-permissions'
import type { AppOwnData, AppInstalledData } from '@mainframe/client'
import styled from 'styled-components/native'
import { Text } from '@morpheus-ui/core'
import PlusIcon from '@morpheus-ui/icons/PlusSymbolCircled'

import rpc from '../rpc'
import globalStyles from '../../styles'
import ModalView from '../../UIComponents/ModalView'
import CreateAppModal from '../developer/CreateAppModal'
import PermissionsView from '../PermissionsView'
import OSLogo from '../../UIComponents/MainframeOSLogo'
import LauncherContext from '../LauncherContext'
import CompleteOnboardSession from './CompleteOnboardSession'

import AppInstallModal from './AppInstallModal'
import { OwnAppItem, InstalledAppItem } from './AppItem'

const Header = styled.View`
  height: 50px;
`

const AppsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`

const AppInstallContainer = styled.TouchableOpacity`
  padding: 15px 10px;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 110px;
  height: 150px;
`

const InstallIcon = styled.View`
  width: 72px;
  height: 72px;
  border-radius: 5px;
  margin-bottom: 10px;
  align-items: center;
  justify-content: center;
  border: 1px solid #a9a9a9;
`

type AppData = AppOwnData | AppInstalledData

export type Apps = {
  installed: Array<AppData>,
  own: Array<AppData>,
}

type Props = {
  apps: Apps,
}

type State = {
  showModal: ?{
    type: 'accept_permissions' | 'app_install' | 'app_create',
    data?: ?{
      app: AppData,
      own: boolean,
    },
  },
  showOnboarding: boolean,
}

class AppsView extends Component<Props, State> {
  static contextType = LauncherContext
  state = {
    showModal: null,
    showOnboarding: true,
  }

  onSkipOnboarding = () => {
    this.setState({
      showOnboarding: false,
    })
  }

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
      this.state.showModal.data
    ) {
      const { app } = this.state.showModal.data
      const { user } = this.context
      try {
        await rpc.setAppUserPermissionsSettings(app.localID, user.localID, {
          grants: permissionSettings,
          permissionsChecked: true,
        })
        await rpc.launchApp(app.localID, user.localID)
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

  onOpenApp = async (app: AppData, own: boolean) => {
    const { user } = this.context
    const appUser = app.users.find(u => u.localID === user.localID)
    if (
      !own &&
      havePermissionsToGrant(app.manifest.permissions) &&
      (!appUser || !appUser.settings.permissionsSettings.permissionsChecked)
    ) {
      // If this user hasn't used the app before
      // we need to ask to accept permissions
      this.setState({
        showModal: {
          type: 'accept_permissions',
          data: {
            app,
            own,
          },
        },
      })
    } else {
      try {
        await rpc.launchApp(app.localID, user.localID)
      } catch (err) {
        // TODO: - Error feedback
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
      <OwnAppItem key={app.localID} ownApp={app} onOpenApp={this.onOpenApp} />
    ) : (
      <InstalledAppItem
        key={app.localID}
        installedApp={app}
        onOpenApp={this.onOpenApp}
      />
    )
  }

  renderApps(apps: Array<AppData>, own: boolean) {
    return (
      <>
        <Text variant="smallTitle">
          {own ? 'Own Applications' : 'Installed Applications'}
        </Text>
        <AppsGrid>
          {apps.map(app => this.renderApp(app, own))}
          {own
            ? this.renderButton(
                'Create new',
                this.onPressCreateApp,
                'launcher-create-app-button',
              )
            : this.renderButton(
                'Install',
                this.onPressInstall,
                'launcher-install-app-button',
              )}
        </AppsGrid>
      </>
    )
  }

  renderInstalled() {
    return this.renderApps(this.props.apps.installed, false)
  }

  renderOwn() {
    return this.renderApps(this.props.apps.own, true)
  }

  renderButton(title: string, onPress: () => void, testID: string) {
    return (
      <AppInstallContainer onPress={onPress} testID={testID}>
        <InstallIcon>
          <PlusIcon color="#808080" />
        </InstallIcon>
        <Text
          theme={{
            width: '72px',
            fontSize: '11px',
            padding: '5px 0',
            color: '#808080',
            border: '1px solid #a9a9a9',
            borderRadius: '3px',
            textAlign: 'center',
          }}>
          {title}
        </Text>
      </AppInstallContainer>
    )
  }

  render() {
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
      <>
        <Header>
          <OSLogo />
        </Header>
        {this.state.showOnboarding && (
          <CompleteOnboardSession
            onSelectItem={() => {}}
            onSkip={this.onSkipOnboarding}
          />
        )}
        {this.renderInstalled()}
        {this.renderOwn()}
        {modal}
      </>
    )
  }
}

export default createFragmentContainer(AppsView, {
  apps: graphql`
    fragment AppsView_apps on AppsQuery {
      installed {
        localID
        ...AppItem_installedApp
      }
      own {
        localID
        ...AppItem_ownApp
      }
    }
  `,
})
