// @flow
import React, { Component } from 'react'
import { Text, Button, DropDown } from '@morpheus-ui/core'
import styled from 'styled-components/native'

import SettingsItem from './SettingsItem'

import { type MenuKey } from './SettingsScreen'

type Props = {
  onSelectMenuItem: (key: MenuKey) => void,
}

const Container = styled.View`
  flex: 1;
  padding: 0 5px;
`
const ScrollView = styled.ScrollView``

const List = styled.View`
  margin-bottom: 50px;
`

export default class SettingsMenuView extends Component<Props> {
  render() {
    return (
      <ScrollView>
        <Container>
          <Text variant={['smallTitle', 'blue', 'bold']}>Developers</Text>
          <List>
            <SettingsItem
              onPress={() => this.props.onSelectMenuItem('developer')}
              first
              title="App develoment tool"
            />
            <SettingsItem
              onPress={() => this.props.onSelectMenuItem('docs')}
              title="API documentation"
            />
            <SettingsItem
              onPress={() => this.props.onSelectMenuItem('help')}
              title="Community/Help"
            />
            <SettingsItem
              title="Ethereum Network"
              RightElement={() => (
                <DropDown
                  theme={{ minWidth: 150 }}
                  label="Select"
                  options={['TestNet (Ropsten)', 'MainNet']}
                  defaultValue={'TestNet (Ropsten)'}
                />
              )}
            />
          </List>
          <Text variant={['smallTitle', 'blue', 'bold']}>About</Text>
          <List>
            <SettingsItem
              firsr
              onPress={() => this.props.onSelectMenuItem('feedback')}
              title="Feedback"
            />
            <SettingsItem
              title="Version"
              RightElement={() => (
                <Button
                  title="UPDATE AVAILABLE"
                  variant={['completeOnboarding', 'small']}
                />
              )}
            />
          </List>
        </Container>
      </ScrollView>
    )
  }
}
