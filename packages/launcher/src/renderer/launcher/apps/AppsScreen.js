// @flow

import { Text, Button } from '@morpheus-ui/core'
import { findIndex } from 'lodash'
import memoize from 'memoize-one'
import React, { Component } from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import styled from 'styled-components/native'

import PlusIcon from '../../UIComponents/Icons/PlusIcon'
import OSLogo from '../../UIComponents/MainframeOSLogo'
import EditIcon from '../../UIComponents/Icons/EditIcon'
import rpc from '../rpc'
import RelayRenderer from '../RelayRenderer'
import PermissionsView from '../PermissionsView'

import AppInstallModal from './AppInstallModal'
import AppPreviewModal from './AppPreviewModal'
import AppUpdateModal from './AppUpdateModal'
import { InstalledAppItem } from './AppItem'
import CompleteOnboardSession from './CompleteOnboardSession'
import NewAppButton from './NewAppButton'
import SuggestedAppItem, { type SuggestedAppData } from './SuggestedItem'
import type { AppsScreen_user as User } from './__generated__/AppsScreen_user.graphql'

type Apps = $PropertyType<User, 'apps'>
type AppData = $Call<<T>($ReadOnlyArray<T>) => T, Apps>

const SUGGESTED_APPS_URL = `https://mainframehq.github.io/suggested-apps/apps.json?timestamp=${new Date().toString()}`

const Container = styled.View`
  padding: 0 0 20px 50px;
  flex: 1;
`

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 20px 20px 0 0;
`

const LogoContainer = styled.View`
  padding-top: 10px;
  padding-bottom: 20px;
`

const ButtonsContainer = styled.View`
  flex-direction: row;
`

export const AppsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: -8px;
  margin-top: 5px;
  margin-bottom: 15px;
`

const Bottom = styled.View`
  height: 5px;
  bottom: -20px;
`

const ScrollView = styled.ScrollView`
  padding-right: 40px;
  padding-bottom: 20px;
`

type Props = {
  user: User,
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
  showOnboarding: boolean,
  suggestedApps: Array<SuggestedAppData>,
  editing: boolean,
  deleting: ?string,
}

class AppsView extends Component<Props, State> {
  state = {
    showModal: null,
    showOnboarding: false,
    suggestedApps: [],
    editing: false,
    deleting: undefined,
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

  toggleEditing = () => {
    this.setState({
      editing: !this.state.editing,
      deleting: null,
    })
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
    const app = this.props.user.apps.find(app => app.localID === appID)
    if (app != null) {
      this.setState({
        showModal: { type: 'app_update', appID },
      })
    }
  }

  onStartDeleting = (appID: string) => {
    this.setState({
      deleting: appID,
    })
  }

  onStartDeleting = (appID: string) => {
    this.setState({
      deleting: appID,
    })
  }

  onCancelDelete = () => {
    this.setState({
      deleting: null,
    })
  }

  onPressDelete = () => {
    // to be Implemented --- Temporarily just cancel
    this.onCancelDelete()
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
    const { user } = this.props
    const app = user.apps.find(app => app.localID === appID)
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
    const { apps } = this.props.user
    const installed = apps.map(userAppVersion => {
      const { appVersion } = userAppVersion
      return (
        // $FlowFixMe: injected fragment type
        <InstalledAppItem
          appVersion={appVersion}
          icon={this.getIcon(appVersion.app.publicID, this.state.suggestedApps)}
          editing={this.state.editing}
          deleting={this.state.deleting === appVersion.app.publicID}
          key={userAppVersion.localID}
          installedApp={appVersion}
          onOpenApp={this.onOpenApp}
          onPressUpdate={this.onPressUpdate}
          onStartDeleting={this.onStartDeleting}
          onCancelDelete={this.onCancelDelete}
          onPressDelete={this.onPressDelete}
        />
      )
    })
    const suggested = this.getSuggestedList(apps, this.state.suggestedApps)

    return (
      <ScrollView>
        <Text variant={['appsTitle', 'blue', 'bold']}>Installed</Text>
        <AppsGrid>
          {installed}
          {apps.length ? null : (
            <NewAppButton
              title="ADD"
              onPress={this.onPressInstall}
              testID="launcher-install-app-button"
            />
          )}
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
          const app = this.props.user.apps.find(
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

    const editButtonVariants = ['xSmallIconOnly', 'noTitle', 'marginRight10']
    if (this.state.editing) {
      editButtonVariants.push('editRedButton')
    }

    return (
      <Container>
        <Header>
          <LogoContainer>
            <OSLogo />
          </LogoContainer>
          {this.props.user.apps.length ? (
            <ButtonsContainer>
              <Button
                onPress={this.toggleEditing}
                variant={editButtonVariants}
                Icon={EditIcon}
              />
              <Button
                variant={['xSmallIconOnly', 'noTitle']}
                Icon={PlusIcon}
                onPress={this.onPressInstall}
                testID="launcher-install-app-button"
              />
            </ButtonsContainer>
          ) : null}
        </Header>
        {this.state.showOnboarding && (
          <CompleteOnboardSession
            onSelectItem={() => {}}
            onSkip={this.onSkipOnboarding}
          />
        )}
        {this.renderApps()}
        {modal}
        <Bottom className="white-shadow" />
      </Container>
    )
  }
}

export const RelayContainer = createFragmentContainer(AppsView, {
  // ...AppUpdateModal_app
  user: graphql`
    fragment AppsScreen_user on User {
      id
      apps {
        localID
        appVersion {
          ...AppItem_appVersion
          app {
            publicID
          }
          installationState
          manifest {
            profile {
              name
            }
            webDomains {
              domain
              internal
              external
            }
          }
        }
        update {
          toVersion {
            installationState
            manifest {
              version
            }
          }
          permissionsChanged
        }
        settings {
          permissionsChecked
          webDomains {
            domain
            internal
            external
          }
        }
      }
    }
  `,
})

export default function AppsScreen() {
  return (
    <RelayRenderer
      render={({ props }) => (props ? <RelayContainer {...props} /> : null)}
      query={graphql`
        query AppsScreenQuery {
          user: viewer {
            ...AppsScreen_user
          }
        }
      `}
    />
  )
}
