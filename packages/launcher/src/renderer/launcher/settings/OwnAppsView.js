// @flow

import React, { Component } from 'react'
import { graphql, createFragmentContainer, QueryRenderer } from 'react-relay'
import { Text } from '@morpheus-ui/core'
import SettingsIcon from '@morpheus-ui/icons/SettingsXSm'
import GreaterIcon from '@morpheus-ui/icons/GreaterXSm'

import styled from 'styled-components/native'

import { EnvironmentContext } from '../RelayEnvironment'
import RelayLoaderView from '../RelayLoaderView'
import { AppsGrid, NewAppButton } from '../apps/AppsView'
import { OwnAppItem } from '../apps/AppItem'
import CreateAppModal from './CreateAppModal'
import CreateDevIdentityView from './CreateDevIdentityView'
import OwnAppDetailView from './OwnAppDetailView'

import type { OwnAppsView_apps as Apps } from './__generated__/OwnAppsView_apps.graphql'
import type { OwnAppsView_identities as Identities } from './__generated__/OwnAppsView_identities.graphql'

type Props = {
  identities: Identities,
  apps: Apps,
  onOpenMenu: () => void,
}

type State = {
  selectedAppID?: ?string,
  createModal?: boolean,
}

const Container = styled.View`
  flex: 1;
  padding-top: 36px;
`

const AppsContainer = styled.View`
  flex: 1;
  margin-top: 10px;
  padding: 0 48px 36px 48px;
`

const Nav = styled.View`
  padding-left: 48px;
  flex-direction: row;
`
const NavItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`

const ScrollView = styled.ScrollView`
  margin-top: -15px;
`

class OwnAppsView extends Component<Props, State> {
  state = {}

  onPressCreateApp = () => {
    this.setState({ createModal: true })
  }

  onCloseModal = () => {
    this.setState({ createModal: false })
  }

  onOpenApp = (appID: string) => {
    this.setState({ selectedAppID: appID })
  }

  onCloseAppDetail = () => {
    this.setState({ selectedAppID: undefined })
  }

  render() {
    const basicNav = (
      <Nav>
        <NavItem onPress={this.props.onOpenMenu}>
          <SettingsIcon color="#A9A9A9" width={10} height={10} />
          <Text size={10} color="#A9A9A9" variant="marginHorizontal5" bold>
            More
          </Text>
        </NavItem>
        <Text size={10} color="#A9A9A9" variant="marginHorizontal5">
          <GreaterIcon color="#A9A9A9" width={6} height={6} />
        </Text>
        <Text size={10} color="#A9A9A9" variant="marginHorizontal5" bold>
          App Development Tool
        </Text>
      </Nav>
    )

    if (!this.props.identities.ownDevelopers.length) {
      return (
        <Container>
          {basicNav}
          <CreateDevIdentityView />
        </Container>
      )
    }

    if (this.state.createModal) {
      return (
        <CreateAppModal
          onAppCreated={this.onCloseModal}
          onRequestClose={this.onCloseModal}
        />
      )
    }

    if (this.state.selectedAppID) {
      const app = this.props.apps.own.find(
        app => app.localID === this.state.selectedAppID,
      )
      if (app != null) {
        return (
          <Container>
            <Nav>
              <NavItem onPress={this.props.onOpenMenu}>
                <SettingsIcon color="#A9A9A9" width={10} height={10} />
                <Text
                  size={10}
                  color="#A9A9A9"
                  variant="marginHorizontal5"
                  bold>
                  More
                </Text>
              </NavItem>
              <Text size={10} color="#A9A9A9" variant="marginHorizontal5">
                <GreaterIcon color="#A9A9A9" width={6} height={6} />
              </Text>
              <NavItem onPress={this.onCloseAppDetail}>
                <Text
                  size={10}
                  color="#A9A9A9"
                  variant="marginHorizontal5"
                  bold>
                  App Development Tool
                </Text>
              </NavItem>
              <Text size={10} color="#A9A9A9" variant="marginHorizontal5">
                <GreaterIcon color="#A9A9A9" width={6} height={6} />
              </Text>
              <Text size={10} color="#A9A9A9" variant="marginHorizontal5" bold>
                My Apps
              </Text>
            </Nav>
            <OwnAppDetailView ownApp={app} onClose={this.onCloseAppDetail} />
          </Container>
        )
      }
    }

    const apps = this.props.apps.own.map(a => {
      const onOpen = () => this.onOpenApp(a.localID)
      // $FlowFixMe: injected fragment type
      return <OwnAppItem key={a.localID} ownApp={a} onOpenApp={onOpen} />
    })

    return (
      <Container>
        {basicNav}
        <AppsContainer>
          <Text variant={['smallTitle', 'blue', 'bold']}>My Apps</Text>
          <ScrollView>
            <AppsGrid>
              {apps}
              <NewAppButton
                title="ADD"
                onPress={this.onPressCreateApp}
                testID="launcher-create-app-button"
              />
            </AppsGrid>
          </ScrollView>
        </AppsContainer>
      </Container>
    )
  }
}

const OwnAppsViewRelayContainer = createFragmentContainer(OwnAppsView, {
  identities: graphql`
    fragment OwnAppsView_identities on Identities {
      ownDevelopers {
        localID
      }
    }
  `,
  apps: graphql`
    fragment OwnAppsView_apps on Apps {
      own {
        localID
        name
        ...AppItem_ownApp
        ...OwnAppDetailView_ownApp
      }
    }
  `,
})

export default class OwnAppsViewRenderer extends Component<{}> {
  static contextType = EnvironmentContext

  render() {
    return (
      <QueryRenderer
        environment={this.context}
        query={graphql`
          query OwnAppsViewQuery {
            viewer {
              identities {
                ...OwnAppsView_identities
              }
              apps {
                ...OwnAppsView_apps
              }
            }
          }
        `}
        variables={{}}
        render={({ error, props }) => {
          if (error || !props) {
            return <RelayLoaderView error={error ? error.message : undefined} />
          } else {
            return (
              <OwnAppsViewRelayContainer {...props.viewer} {...this.props} />
            )
          }
        }}
      />
    )
  }
}
