// @flow
import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import { Text } from '@morpheus-ui/core'

import colors from '../../colors'
import OwnAppsView from './OwnAppsView'
import SettingsMenuView, { MENU_SECTIONS } from './SettingsMenuView'

const Container = styled.View`
  padding: 20px;
`
const Nav = styled.View`
  padding-vertical: 10px;
  flex-direction: row;
`

const navLabelStyle = `margin-right: 20px;`

type State = {
  openView: 'menu' | 'developer',
}

export default class SettingsScreen extends Component<{}, State> {
  state = {
    openView: 'menu',
  }

  onSelectMenuItem = (key: string) => {
    this.setState({
      openView: key,
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
          <Text styles={navLabelStyle}>More</Text>
          <Text styles={navLabelStyle}>Developer Tools</Text>
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
