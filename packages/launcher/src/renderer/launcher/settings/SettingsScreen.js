// @flow
import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Text } from '@morpheus-ui/core'

import SettingsIcon from '@morpheus-ui/icons/SettingsXSm'
import GreaterIcon from '@morpheus-ui/icons/GreaterXSm'
import { shell } from 'electron'

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

type State = {
  openView: MenuKey,
}

export default class SettingsScreen extends Component<{}, State> {
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
        return <SettingsMenuView onSelectMenuItem={this.onSelectMenuItem} />
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
            <Text size={9} color="#A9A9A9" variant="marginHorizontal5" bold>
              More
            </Text>
          </NavItem>
          <Text size={9} color="#A9A9A9" variant="marginHorizontal5">
            <GreaterIcon color="#A9A9A9" width={6} height={6} />
          </Text>
          <Text size={9} color="#A9A9A9" variant="marginHorizontal5" bold>
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
