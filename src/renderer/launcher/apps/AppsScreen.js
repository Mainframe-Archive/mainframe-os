// @flow

import { Text, Button } from '@morpheus-ui/core'
import memoize from 'memoize-one'
import React, { Component } from 'react'
import {
  graphql,
  commitMutation,
  createFragmentContainer,
  type Environment,
} from 'react-relay'
import styled from 'styled-components/native'

import PlusIcon from '../../UIComponents/Icons/PlusIcon'
import OSLogo from '../../UIComponents/MainframeOSLogo'
import EditIcon from '../../UIComponents/Icons/EditIcon'
import rpc from '../rpc'
import RelayRenderer from '../RelayRenderer'

import AppInstallModal from './AppInstallModal'
import AppUpdateModal from './AppUpdateModal'
import { InstalledAppItem } from './AppItem'
import AppsGrid from './AppsGrid'
import CompleteOnboardSession from './CompleteOnboardSession'
import NewAppButton from './NewAppButton'
import SuggestedAppItem, { type SuggestedAppData } from './SuggestedItem'
import type { AppsScreen_user as User } from './__generated__/AppsScreen_user.graphql'

type UserApps = $PropertyType<User, 'apps'>
type UserAppData = $Call<<T>($ReadOnlyArray<T>) => T, UserApps>

// const SUGGESTED_APPS_URL = `https://mainframehq.github.io/suggested-apps/apps.json?timestamp=${new Date().toString()}`

const SUGGESTED_APPS = [
  {
    publicID: 'mafde4d014eb07e8164bbbc32f32930dc6c5eaceac',
    name: 'Noted',
    description: 'Create fast and secured notes',
  },
  {
    publicID: 'mad5412f300c0ffd168e8cb9a5cd9b3f1bcbd1979e',
    name: 'Payments',
    description: 'Transfer crypto money in no time',
  },
]

const appRemoveMutation = graphql`
  mutation AppsScreenRemoveUserAppVersionMutation(
    $input: RemoveUserAppVersionMutationInput!
  ) {
    removeUserAppVersion(input: $input) {
      viewer {
        ...AppsScreen_user
      }
    }
  }
`

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

const Bottom = styled.View`
  height: 5px;
  bottom: -20px;
`

const ScrollView = styled.ScrollView`
  padding-right: 40px;
  padding-bottom: 20px;
`

type Props = {
  relay: {
    environment: Environment,
  },
  user: User,
}

type State = {
  showModal: ?{
    type: 'app_install' | 'app_update',
    publicID?: ?string,
    userAppVersionID?: ?string,
    suggestedApp?: ?Object,
    data?: ?{
      app: UserAppData,
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
      showModal: { type: 'app_install' },
    })
  }

  installSuggested = (publicID: string) => {
    this.setState({
      showModal: { type: 'app_install', publicID },
    })
  }

  onPressUpdate = (fromVersionID: string) => {
    const found = this.props.user.apps.find(uav => {
      return (
        uav.update != null && uav.update.fromVersion.localID === fromVersionID
      )
    })
    if (found != null) {
      this.setState({
        showModal: { type: 'app_update', userAppVersionID: found.localID },
      })
    }
  }

  onStartDeleting = (publicID: string) => {
    const found = this.props.user.apps.find(uav => {
      return uav.appVersion.app.publicID === publicID
    })
    if (found != null) {
      this.setState({ deleting: found.localID })
    }
  }

  onCancelDelete = () => {
    this.setState({ deleting: null })
  }

  onPressDelete = () => {
    const { deleting } = this.state
    if (deleting == null) {
      return
    }

    commitMutation(this.props.relay.environment, {
      mutation: appRemoveMutation,
      variables: {
        input: { userAppVersionID: deleting },
      },
      onCompleted: () => {
        this.setState({ deleting: null })
      },
      onError: () => {
        this.setState({ deleting: null })
      },
    })
  }

  onInstallComplete = () => {
    this.onCloseModal()
  }

  onOpenApp = async (userAppVersionID: string) => {
    try {
      await rpc.openApp(userAppVersionID)
    } catch (err) {
      // TODO: - Error feedback
    }
  }

  onCloseModal = () => {
    this.setState({
      showModal: undefined,
    })
  }

  getSuggestedList = memoize((apps: UserApps): Array<SuggestedAppData> => {
    return SUGGESTED_APPS.filter((item: SuggestedAppData) => {
      return (
        apps.find(app => app.appVersion.app.publicID === item.publicID) == null
      )
    })
  })

  // RENDER

  renderApps() {
    const { apps } = this.props.user
    const installed = apps.map(userAppVersion => {
      const { appVersion, localID } = userAppVersion
      return (
        // $FlowFixMe: injected fragment type
        <InstalledAppItem
          appVersion={appVersion}
          editing={this.state.editing}
          deleting={this.state.deleting === localID}
          key={localID}
          installedApp={appVersion}
          onOpenApp={() => {
            this.onOpenApp(localID)
          }}
          onPressUpdate={this.onPressUpdate}
          onStartDeleting={this.onStartDeleting}
          onCancelDelete={this.onCancelDelete}
          onPressDelete={this.onPressDelete}
        />
      )
    })
    const suggested = this.getSuggestedList(apps)

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
        {suggested.length > 0 ? (
          <>
            <Text variant={['appsTitle', 'blue', 'bold']}>Suggestions</Text>
            <AppsGrid>
              {suggested.map(app => (
                <SuggestedAppItem
                  key={app.publicID}
                  appData={app}
                  onPressInstall={this.installSuggested}
                  onOpen={this.installSuggested}
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
              publicID={this.state.showModal.publicID}
              onRequestClose={this.onCloseModal}
              onInstallComplete={this.onInstallComplete}
            />
          )
          break
        case 'app_update': {
          const userAppVersion = this.props.user.apps.find(
            // $FlowFixMe ignore undefined warning
            uav => uav.localID === this.state.showModal.userAppVersionID,
          )
          modal = userAppVersion ? (
            // $FlowFixMe: injected fragment type
            <AppUpdateModal
              userAppVersion={userAppVersion}
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
  user: graphql`
    fragment AppsScreen_user on User {
      id
      apps {
        ...AppUpdateModal_userAppVersion
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
          fromVersion {
            localID
          }
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
