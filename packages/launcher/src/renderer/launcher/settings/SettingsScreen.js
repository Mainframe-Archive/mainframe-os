// @flow
import React, { Component } from 'react'
import styled from 'styled-components/native'
import { graphql, createFragmentContainer, QueryRenderer } from 'react-relay'

import { shell } from 'electron'

import { EnvironmentContext } from '../RelayEnvironment'
import RelayLoaderView from '../RelayLoaderView'
import OwnAppsView from './OwnAppsView'
import SettingsMenuView from './SettingsMenuView'
const Container = styled.View`
  flex: 1;
  padding: 5px;
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
        return <OwnAppsView onOpenMenu={this.goBack} />
      default:
        return null
    }
  }

  render() {
    return <Container>{this.renderView()}</Container>
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
