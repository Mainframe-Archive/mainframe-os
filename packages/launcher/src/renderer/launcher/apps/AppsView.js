// @flow

import React, { Component } from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import {
  havePermissionsToGrant,
  type StrictPermissionsGrants,
} from '@mainframe/app-permissions'
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
import AppUpdateModal from './AppUpdateModal'
import { InstalledAppItem } from './AppItem'
import SuggestedAppItem, { type SuggestedAppData } from './SuggestedItem'
import type { AppsView_apps as Apps } from './__generated__/AppsView_apps.graphql'

type InstalledApps = $PropertyType<Apps, 'installed'>
type AppData = $Call<<T>($ReadOnlyArray<T>) => T, InstalledApps>

const SUGGESTED_APPS_URL =
  'https://s3-us-west-2.amazonaws.com/suggested-apps/suggested-apps-v2.json'

const Container = styled.View`
  padding: 40px 50px 20px 50px;
`

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

type Props = {
  apps: Apps,
  user: CurrentUser,
}

type State = {
  showModal: ?{
    type: 'accept_permissions' | 'app_install' | 'app_preview' | 'app_update',
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

  // App install / update / open

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

  onPressUpdate = (appID: string) => {
    const app = this.props.apps.installed.find(app => app.localID === appID)
    if (app != null) {
      this.setState({
        showModal: { type: 'app_update', appID },
      })
    }
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

  onOpenApp = async (appID: string) => {
    const { apps, user } = this.props
    const app = apps.installed.find(app => app.localID === appID)
    if (app == null) {
      return
    }

    const appUser = app.users.find(u => u.localID === user.localID)
    if (
      // $FlowFixMe: difference between Relay-generated and library-defined types
      havePermissionsToGrant(app.manifest.permissions) &&
      (!appUser || !appUser.settings.permissionsSettings.permissionsChecked)
    ) {
      // If this user hasn't used the app before
      // we need to ask to accept permissions
      this.setState({
        showModal: { type: 'accept_permissions', appID },
      })
    } else {
      try {
        await rpc.launchApp(appID, user.localID)
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
    (apps: InstalledApps, suggestedApps: Array<SuggestedAppData>) => {
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

  renderApps() {
    const apps = this.props.apps.installed
    const installed = apps.map(app => (
      // $FlowFixMe: injected fragment type
      <InstalledAppItem
        icon={this.getIcon(app.mfid, this.state.suggestedApps)}
        key={app.localID}
        installedApp={app}
        onOpenApp={this.onOpenApp}
        onPressUpdate={this.onPressUpdate}
      />
    ))
    const suggested = this.getSuggestedList(apps, this.state.suggestedApps)

    return (
      <ScrollView>
        <Text variant={['appsTitle', 'blue', 'bold']}>Installed</Text>
        <AppsGrid>
          {installed}
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
              name={app.name}
              // $FlowFixMe: difference between Relay-generated and library-defined types
              permissions={app.manifest.permissions}
              onCancel={this.onCloseModal}
              onSubmit={this.onSubmitPermissions}
            />
          )
          break
        }
        case 'app_update': {
          const app = this.props.apps.installed.find(
            // $FlowFixMe ignore undefined warning
            app => app.localID === this.state.showModal.appID,
          )
          modal = app ? (
            // $FlowFixMe: injected fragment type
            <AppUpdateModal
              app={app}
              onRequestClose={this.onCloseModal}
              onUpdateComplete={this.onInstallComplete}
            />
          ) : null
          break
        }
        default:
          modal = null
      }
    }
    return (
      <Container>
        <Header>
          <OSLogo />
        </Header>
        {this.state.showOnboarding && (
          <CompleteOnboardSession
            onSelectItem={() => {}}
            onSkip={this.onSkipOnboarding}
          />
        )}
        {this.renderApps()}
        {modal}
      </Container>
    )
  }
}

const AppsViewFragmentContainer = createFragmentContainer(AppsView, {
  // ...AppItem_installedApp
  // ...AppUpdateModal_app
  viewer: graphql`
    fragment AppsView_viewer on Viewer {
      id
      # apps {
      #   localID
      #   mfid
      #   manifest {
      #     permissions {
      #       optional {
      #         WEB_REQUEST
      #         BLOCKCHAIN_SEND
      #       }
      #       required {
      #         WEB_REQUEST
      #         BLOCKCHAIN_SEND
      #       }
      #     }
      #   }
      #   name
      #   users {
      #     localID
      #     identity {
      #       profile {
      #         name
      #       }
      #     }
      #     settings {
      #       permissionsSettings {
      #         permissionsChecked
      #         grants {
      #           BLOCKCHAIN_SEND
      #           WEB_REQUEST {
      #             granted
      #             denied
      #           }
      #         }
      #       }
      #     }
      #   }
      # }
    }
  `,
})

export default applyContext(AppsViewFragmentContainer)
