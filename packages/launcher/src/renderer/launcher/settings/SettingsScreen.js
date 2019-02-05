// @flow
import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Text } from '@morpheus-ui/core'

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

const navLabelStyle = `margin-right: 20px;`

export type MenuKey = 'menu' | 'developer' | 'docs' | 'help' | 'feedback'

type State = {
  openView: MenuKey,
}

export default class SettingsScreen extends Component<{}, State> {
  state = {
    openView: 'menu',
  }

  onSelectMenuItem = (key: MenuKey) => {
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
