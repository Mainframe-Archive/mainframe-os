// @flow
import React, { Component } from 'react'
import { Text, Button, DropDown } from '@morpheus-ui/core'
import styled from 'styled-components/native'

import SettingsToolIcon from '@morpheus-ui/icons/SettingsToolSm'
import DocumentIcon from '@morpheus-ui/icons/DocumentSm'
import CommunityIcon from '@morpheus-ui/icons/CommunitySm'
import NetworkIcon from '@morpheus-ui/icons/NetworkSm'
import FeedbackIcon from '@morpheus-ui/icons/Feedback'
import MainframeLogoIcon from '@morpheus-ui/icons/MainframeLogoSm'
import GreaterIcon from '@morpheus-ui/icons/GreaterSm'
import ExportIcon from '@morpheus-ui/icons/ExportSm'

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
              Icon={SettingsToolIcon}
              RightElement={GreaterIcon}
            />
            <SettingsItem
              onPress={() => this.props.onSelectMenuItem('docs')}
              title="API documentation"
              Icon={DocumentIcon}
              RightElement={ExportIcon}
            />
            <SettingsItem
              onPress={() => this.props.onSelectMenuItem('help')}
              title="Community / Help"
              Icon={CommunityIcon}
              RightElement={ExportIcon}
            />
            <SettingsItem
              title="Ethereum Network"
              Icon={NetworkIcon}
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
              first
              onPress={() => this.props.onSelectMenuItem('feedback')}
              title="Feedback"
              Icon={FeedbackIcon}
              RightElement={ExportIcon}
            />
            <SettingsItem
              title="Alpha version 0.2.3"
              Icon={MainframeLogoIcon}
              RightElement={() => (
                <Button
                  onPress={() => this.props.onSelectMenuItem('update')}
                  title="CHECK FOR UPDATES"
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
