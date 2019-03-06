// @flow
import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Text } from '@morpheus-ui/core'
import { graphql, createFragmentContainer, QueryRenderer } from 'react-relay'

import SettingsIcon from '@morpheus-ui/icons/SettingsXSm'
import GreaterIcon from '@morpheus-ui/icons/GreaterXSm'
import { shell } from 'electron'

import { EnvironmentContext } from '../RelayEnvironment'
import RelayLoaderView from '../RelayLoaderView'
import OwnAppsView from './OwnAppsView'
import SettingsMenuView from './SettingsMenuView'
const Container = styled.View`
  flex: 1;
  padding: 5px;
`
const Nav = styled.View`
  padding-vertical: 10px;
  flex-direction: row;
`
const NavItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`

export type MenuKey =
  | 'menu'
  | 'developer'
  | 'docs'
  | 'help'
  | 'feedback'
  | 'update'

type Props = {
  settings: {
    ethereumUrl: string,
  },
}

type State = {
  openView: MenuKey,
}

class SettingsScreen extends Component<Props, State> {
  state = {
    openView: 'menu',
  }

  onSelectMenuItem = (key: MenuKey) => {
    switch (key) {
      case 'docs':
        shell.openExternal('https://mainframe.com/developers/')
        break
      case 'help':
        shell.openExternal('https://community.mainframe.com/')
        break
      case 'feedback':
        shell.openExternal('https://mainframe.com/contact/')
        break
      case 'update':
        shell.openExternal(
          'https://github.com/MainframeHQ/mainframe-os/releases',
        )
        break
      default:
        this.setState({
          openView: key,
        })
    }
  }

  goBack = () => {
    this.setState({
      openView: 'menu',
    })
  }

  renderView() {
    switch (this.state.openView) {
      case 'menu':
        return (
          <SettingsMenuView
            onSelectMenuItem={this.onSelectMenuItem}
            ethereumUrl={this.props.settings.ethereumUrl}
          />
        )
      case 'developer':
        return <OwnAppsView />
      default:
        return null
    }
  }

  render() {
    const nav =
      this.state.openView !== 'menu' ? (
        <Nav>
          <NavItem onPress={this.goBack}>
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
      ) : null
    return (
      <Container>
        {nav}
        {this.renderView()}
      </Container>
    )
  }
}

const SettingsScreenRelayContainer = createFragmentContainer(SettingsScreen, {
  settings: graphql`
    fragment SettingsScreen_settings on Settings {
      ethereumUrl
    }
  `,
})

export default class SettingsScreenQueryRenderer extends Component<{}> {
  static contextType = EnvironmentContext

  render() {
    return (
      <QueryRenderer
        environment={this.context}
        query={graphql`
          query SettingsScreenQuery {
            viewer {
              settings {
                ...SettingsScreen_settings
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
              <SettingsScreenRelayContainer {...props.viewer} {...this.props} />
            )
          }
        }}
      />
    )
  }
}
