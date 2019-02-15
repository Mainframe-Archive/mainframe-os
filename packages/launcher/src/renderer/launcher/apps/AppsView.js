// @flow

import React, { Component } from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import {
  havePermissionsToGrant,
  type StrictPermissionsGrants,
} from '@mainframe/app-permissions'
import type { AppInstalledData } from '@mainframe/client'
import styled from 'styled-components/native'
import { Text } from '@morpheus-ui/core'
import PlusIcon from '@morpheus-ui/icons/PlusSymbolCircled'
import { findIndex } from 'lodash'
import memoize from 'memoize-one'

import rpc from '../rpc'
import PermissionsView from '../PermissionsView'
import OSLogo from '../../UIComponents/MainframeOSLogo'
import applyContext, { type CurrentUser } from '../LauncherContext'
import CompleteOnboardSession from './CompleteOnboardSession'

import AppInstallModal from './AppInstallModal'
import { InstalledAppItem, SuggestedAppItem } from './AppItem'

const SUGGESTED_APPS = [
  {
    hash: '3dda9f3c3ba97551e66d7704cbc9c06b32689b3f2e9e4927dcf343f4431aed61',
    mfid:
      'mf:0/app:pub-key:ed25519/base64:OpJx6d2IskYgWJwc65yC+HzWHnXHt++ikWz8ZFpX9Es=',
    name: 'Test app 1',
  },
  {
    hash: 'c4405a27e0f700e6796d42e78710e96cf4e06008f49a989ba4bf68a9b35c51fb',
    mfid:
      'mf:0/app:pub-key:ed25519/base64:8940Tpo5zGSgV0MMYG3ApvjVFD6UAcOBb+KGPLR31jw=',
    name: 'Test app 2',
  },
]

const Header = styled.View`
  height: 50px;
`

export const AppsGrid = styled.View`
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
  ${props => props.hover && 'border: 1px solid #DA1157;'}
`

const ScrollView = styled.ScrollView``

export const NewAppButton = (props: {
  title: string,
  onPress: () => void,
  testID: string,
}) => {
  return (
    <AppInstallContainer onPress={props.onPress} testID={props.testID}>
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
        {props.title}
      </Text>
    </AppInstallContainer>
  )
}

type AppData = AppInstalledData

export type Apps = {
  installed: Array<AppData>,
}

type Props = {
  apps: Apps,
  user: CurrentUser,
}

type State = {
  showModal: ?{
    type: 'accept_permissions' | 'app_install',
    appID?: ?string,
    data?: ?{
      app: AppData,
    },
  },
  hover: ?string,
  showOnboarding: boolean,
}

class AppsView extends Component<Props, State> {
  state = {
    hover: null,
    showModal: null,
    showOnboarding: false,
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

  installSuggested = (appID: string) => {
    this.setState({
      showModal: {
        type: 'app_install',
        appID,
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
      const { user } = this.props
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

  onOpenApp = async (app: AppData) => {
    const { user } = this.props
    const appUser = app.users.find(u => u.localID === user.localID)
    if (
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

  getSuggestedList = memoize((apps: Array<AppData>) => {
    return SUGGESTED_APPS.filter(
      item => findIndex(apps, { mfid: item.mfid }) < 0,
    )
  })

  // RENDER

  renderApp(app: AppData) {
    return (
      <InstalledAppItem
        key={app.localID}
        installedApp={app}
        onOpenApp={this.onOpenApp}
      />
    )
  }

  renderApps(apps: Array<AppData>) {
    const suggested = this.getSuggestedList(apps)
    return (
      <ScrollView>
        <Text variant={['smallTitle', 'blue', 'bold']}>
          Installed Applications
        </Text>
        <AppsGrid>
          {apps.map(app => this.renderApp(app))}
          <NewAppButton
            title="Install"
            onPress={this.onPressInstall}
            testID="launcher-install-app-button"
          />
        </AppsGrid>
        {suggested.length ? (
          <>
            <Text variant={['smallTitle', 'blue', 'bold']}>
              Suggested Applications
            </Text>
            <AppsGrid>
              {suggested.map(app => (
                <SuggestedAppItem
                  key={app.hash}
                  appID={app.hash}
                  mfid={app.mfid}
                  appName={app.name}
                  devName="Mainframe"
                  onOpen={this.installSuggested}
                />
              ))}
            </AppsGrid>
          </>
        ) : null}
      </ScrollView>
    )
  }

  renderInstalled() {
    return this.renderApps(this.props.apps.installed)
  }

  renderButton(title: string, onPress: () => void, testID: string) {
    const hover = this.state.hover === title
    return (
      <AppInstallContainer
        onMouseOver={() => this.setState({ hover: title })}
        onMouseOut={() => this.setState({ hover: '' })}
        onPress={onPress}
        testID={testID}>
        <InstallIcon hover={hover}>
          <PlusIcon color={hover ? '#DA1157' : '#808080'} />
        </InstallIcon>
        <Text
          theme={{
            width: '72px',
            fontSize: '11px',
            padding: '5px 0',
            color: hover ? '#DA1157' : '#808080',
            border: hover ? '1px solid #DA1157' : '1px solid #a9a9a9',
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
              appID={this.state.showModal.appID}
              onRequestClose={this.onCloseModal}
              onInstallComplete={this.onInstallComplete}
            />
          )
          break
        case 'accept_permissions': {
          // $FlowFixMe ignore undefined warning
          const { app } = this.state.showModal.data
          modal = (
            <PermissionsView
              name={app.manifest.name}
              permissions={app.manifest.permissions}
              onCancel={this.onCloseModal}
              onSubmit={this.onSubmitPermissions}
            />
          )
          break
        }
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
        {modal}
      </>
    )
  }
}

const AppsViewFragmentContainer = createFragmentContainer(AppsView, {
  apps: graphql`
    fragment AppsView_apps on Apps {
      installed {
        localID
        mfid
        ...AppItem_installedApp
      }
    }
  `,
})

export default applyContext(AppsViewFragmentContainer)
