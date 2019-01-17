//@flow

import React, { Component } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'
import { graphql, QueryRenderer } from 'react-relay'

import { EnvironmentContext } from './RelayEnvironment'
import LauncherContext from './LauncherContext'
import RelayLoaderView from './RelayLoaderView'
import SideMenu, { type ScreenNames } from './SideMenu'
import AppsScreen from './apps/AppsScreen'
import IdentitiesScreen from './identities/IdentitiesScreen'
import WalletsScreen from './wallets/WalletsScreen'
import ContactsScreen from './contacts/ContactsScreen'

const Container = styled.View`
  flex-direction: row;
  height: '100vh';
  flex: 1;
`

const ContentContainer = styled.View`
  padding: 20px 50px;
  flex: 1;
`

type Props = {
  identities: {
    ownUsers: Array<{ localID: string }>,
  },
}

type State = {
  openScreen: ScreenNames,
}

class Launcher extends Component<Props, State> {
  state = {
    openScreen: 'apps',
  }

  setOpenScreen = (name: ScreenNames) => {
    this.setState({
      openScreen: name,
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
      default:
        return null
    }
  }

  render() {
    const { ownUsers } = this.props.identities
    if (!ownUsers || !ownUsers.length) {
      return <Container /> //TODO: error view
    }

    return (
      <LauncherContext.Provider value={{ userID: ownUsers[0].localID }}>
        <Container testID="launcher-view">
          <SideMenu
            selected={this.state.openScreen}
            onSelectMenuItem={this.setOpenScreen}
          />
          <ContentContainer>
            <ScrollView>{this.renderScreen()}</ScrollView>
          </ContentContainer>
        </Container>
      </LauncherContext.Provider>
    )
  }
}

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
                ownUsers {
                  localID
                }
              }
            }
          }
        `}
        variables={{}}
        render={({ error, props }) => {
          if (error || !props) {
            return <RelayLoaderView error={error ? error.message : undefined} />
          } else {
            return <Launcher {...props.viewer} {...this.props} />
          }
        }}
      />
    )
  }
}
