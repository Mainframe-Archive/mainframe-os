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
import { findIndex } from 'lodash'
import memoize from 'memoize-one'
import PlusIcon from '../../UIComponents/Icons/PlusIcon'

import rpc from '../rpc'
import PermissionsView from '../PermissionsView'
import OSLogo from '../../UIComponents/MainframeOSLogo'
import applyContext, { type CurrentUser } from '../LauncherContext'
import CompleteOnboardSession from './CompleteOnboardSession'

import AppInstallModal from './AppInstallModal'
import AppPreviewModal from './AppPreviewModal'
import { InstalledAppItem } from './AppItem'
import SuggestedAppItem, { type SuggestedAppData } from './SuggestedItem'

const SUGGESTED_APPS_URL =
  'https://s3-us-west-2.amazonaws.com/suggested-apps/suggested-apps.json'

const Header = styled.View`
  height: 50px;
`

export const AppsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: -8px;
  margin-top: 5px;
  margin-bottom: 15px;
`

const AppInstallContainer = styled.TouchableOpacity`
  padding: 20px;
  margin-left: 12px;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 110px;
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

type NewAppProps = {
  title: string,
  onPress: () => void,
  testID: string,
}

type NewAppState = {
  hover: boolean,
}

export class NewAppButton extends Component<NewAppProps, NewAppState> {
  state = {
    hover: false,
  }

  toggleHover = () => {
    this.setState({ hover: !this.state.hover })
  }

  render() {
    return (
      <AppInstallContainer
        onPress={this.props.onPress}
        testID={this.props.testID}
        onMouseOver={this.toggleHover}
        onMouseOut={this.toggleHover}>
        <InstallIcon hover={this.state.hover}>
          <PlusIcon color={this.state.hover ? '#DA1157' : '#808080'} />
        </InstallIcon>
        <Text
          className="transition"
          theme={{
            width: '72px',
            fontSize: '11px',
            padding: '5px 0',
            color: this.state.hover ? '#DA1157' : '#808080',
            border: this.state.hover
              ? '1px solid #DA1157'
              : '1px solid #a9a9a9',
            borderRadius: '3px',
            textAlign: 'center',
          }}>
          {this.props.title}
        </Text>
      </AppInstallContainer>
    )
  }
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
    type: 'accept_permissions' | 'app_install' | 'app_preview',
    appID?: ?string,
    suggestedApp?: ?Object,
    data?: ?{
      app: AppData,
    },
  },
  hover: ?string,
  showOnboarding: boolean,
  suggestedApps: Array<SuggestedAppData>,
}

class AppsView extends Component<Props, State> {
  state = {
    hover: null,
    showModal: null,
    showOnboarding: false,
    suggestedApps: [],
  }

  componentDidMount() {
    this.fetchSuggested()
  }

  fetchSuggested = async () => {
    try {
      const suggestedPromise = await fetch(SUGGESTED_APPS_URL)
      const suggestedApps = await suggestedPromise.json()
      this.setState({ suggestedApps })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    }
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

  previewSuggested = (app: Object) => {
    this.setState({
      showModal: { type: 'app_preview', suggestedApp: app, appID: app.hash },
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

  getSuggestedList = memoize(
    (apps: Array<AppData>, suggestedApps: Array<SuggestedAppData>) => {
      return suggestedApps.filter(
        item => findIndex(apps, { mfid: item.mfid }) < 0,
      )
    },
  )

  getIcon = memoize(
    (
      mfId?: ?string,
      suggestedApps: Array<SuggestedAppData> = this.state.suggestedApps,
    ) => {
      if (!mfId) return null
      const icon = suggestedApps.filter(app => app.mfid === mfId)
      return icon.length ? icon[0].icon : null
    },
  )

  // RENDER

  renderApp(app: AppData) {
    const icon = this.getIcon(app.mfid, this.state.suggestedApps)
    return (
      <InstalledAppItem
        icon={icon}
        key={app.localID}
        installedApp={app}
        onOpenApp={this.onOpenApp}
      />
    )
  }

  renderApps(apps: Array<AppData>) {
    const suggested = this.getSuggestedList(apps, this.state.suggestedApps)
    return (
      <ScrollView>
        <Text variant={['appsTitle', 'blue', 'bold']}>Installed</Text>
        <AppsGrid>
          {apps.map(app => this.renderApp(app))}
          <NewAppButton
            title="ADD"
            onPress={this.onPressInstall}
            testID="launcher-install-app-button"
          />
        </AppsGrid>
        {suggested.length ? (
          <>
            <Text variant={['appsTitle', 'blue', 'bold']}>Suggestions</Text>
            <AppsGrid>
              {suggested.map(app => (
                <SuggestedAppItem
                  key={app.hash}
                  appData={app}
                  onPressInstall={this.installSuggested}
                  onOpen={this.previewSuggested}
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
              getIcon={this.getIcon}
            />
          )
          break
        case 'app_preview':
          modal = this.state.showModal.suggestedApp ? (
            <AppPreviewModal
              appData={this.state.showModal.suggestedApp}
              onRequestClose={this.onCloseModal}
              onPressInstall={this.installSuggested}
            />
          ) : null
          break
        case 'accept_permissions': {
          // $FlowFixMe ignore undefined warning
          const { app } = this.state.showModal.data
          const icon = this.getIcon(app.mfid, this.state.suggestedApps)
          modal = (
            <PermissionsView
              mfid={app.mfid}
              icon={icon}
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
