//@flow

import React, { Component } from 'react'
import styled from 'styled-components/native'
import { graphql, QueryRenderer, createFragmentContainer } from 'react-relay'

import OnboardView from './onboarding/OnboardView'
import { EnvironmentContext } from './RelayEnvironment'
import { Provider } from './LauncherContext'
import RelayLoaderView from './RelayLoaderView'
import SideMenu, { type ScreenNames } from './SideMenu'
import AppsScreen from './apps/AppsScreen'
import IdentitiesScreen from './identities/IdentitiesScreen'
import WalletsScreen from './wallets/WalletsScreen'
import ContactsScreen from './contacts/ContactsScreen'
import SettingsScreen from './settings/SettingsScreen'

const Container = styled.View`
  flex-direction: row;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`

const ContentContainer = styled.View`
  padding: 40px 50px 20px 50px;
  min-width: 600px;
  flex: 1;
`

type Props = {
  identities: {
    ownUsers: Array<{
      localID: string,
      defaultEthAddress: ?string,
      wallets: {
        hd: Array<{ localID: string }>,
        ledger: Array<{ localID: string }>,
      },
    }>,
  },
}

type OnboardSteps = 'identity' | 'wallet'

type State = {
  openScreen: ScreenNames,
  onboardRequired?: ?OnboardSteps,
}

class Launcher extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const { ownUsers } = props.identities
    let onboardRequired
    if (!ownUsers || !ownUsers.length) {
      onboardRequired = 'identity'
    } else if (
      !ownUsers[0].wallets.hd.length &&
      !ownUsers[0].wallets.ledger.length
    ) {
      onboardRequired = 'wallet'
    }
    this.state = {
      onboardRequired,
      openScreen: 'apps',
    }
  }

  setOpenScreen = (name: ScreenNames) => {
    this.setState({
      openScreen: name,
    })
  }

  onboardComplete = () => {
    this.setState({
      onboardRequired: null,
    })
  }

  renderScreen() {
    switch (this.state.openScreen) {
      case 'apps':
        return <AppsScreen />
      case 'identities':
        return <IdentitiesScreen />
      case 'wallets':
        return <WalletsScreen />
      case 'contacts':
        return <ContactsScreen />
      case 'settings':
        return <SettingsScreen />
      default:
        return null
    }
  }

  render() {
    const { ownUsers } = this.props.identities
    const { onboardRequired } = this.state

    if (onboardRequired) {
      return (
        <OnboardView
          startState={onboardRequired}
          onboardComplete={this.onboardComplete}
          userID={ownUsers && ownUsers.length ? ownUsers[0].localID : null}
        />
      )
    }

    return (
      <Provider value={{ user: ownUsers[0] }}>
        <Container testID="launcher-view">
          <SideMenu
            selected={this.state.openScreen}
            onSelectMenuItem={this.setOpenScreen}
          />
          <ContentContainer>{this.renderScreen()}</ContentContainer>
        </Container>
      </Provider>
    )
  }
}

const LauncherRelayContainer = createFragmentContainer(Launcher, {
  identities: graphql`
    fragment Launcher_identities on Identities {
      ownUsers {
        defaultEthAddress
        localID
        wallets {
          hd {
            localID
          }
          ledger {
            localID
          }
        }
      }
    }
  `,
})

export default class LauncherQueryRenderer extends Component<{}> {
  static contextType = EnvironmentContext

  render() {
    return (
      <QueryRenderer
        environment={this.context}
        query={graphql`
          query LauncherQuery {
            viewer {
              identities {
                ...Launcher_identities
              }
            }
          }
        `}
        variables={{}}
        render={({ error, props }) => {
          if (error || !props) {
            return <RelayLoaderView error={error ? error.message : undefined} />
          } else {
            return <LauncherRelayContainer {...props.viewer} {...this.props} />
          }
        }}
      />
    )
  }
}
