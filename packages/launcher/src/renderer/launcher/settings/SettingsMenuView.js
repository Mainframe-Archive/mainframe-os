// @flow
import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import { Text } from '@morpheus-ui/core'

import colors from '../../colors'

const Container = styled.View`
  padding: 20px;
`

const SectionContainer = styled.View`
  margin-bottom: 20px;
`

const SectionHeader = styled.View`
  border-bottom-width: 1px;
  border-color: ${colors.LIGHT_GREY_EE};
  padding-vertical: 15px;
`

const MenuItem = styled.View`
  padding-vertical: 15px;
  border-bottom-width: 1px;
  border-color: ${colors.LIGHT_GREY_EE};
`

export const MENU_SECTIONS = [
  {
    title: 'DEVELOPERS',
    items: [
      {
        key: 'developer',
        icon: 'icon',
        title: 'Development Tools',
      },
      {
        key: 'docs',
        icon: 'icon',
        title: 'API Documentation',
      },
      {
        key: 'help',
        icon: 'icon',
        title: 'Community / Help',
      },
      {
        key: 'eth_network',
        icon: 'icon',
        title: 'Ethereum Network',
      },
    ],
  },
  {
    title: 'ABOUT',
    items: [
      {
        key: 'feedback',
        icon: 'icon',
        title: 'Feedback',
      },
      {
        key: 'version',
        icon: 'icon',
        title: 'Version',
      },
    ],
  },
]

type Props = {
  onSelectMenuItem: (key: string) => void,
}

export default class SettingsMenuView extends Component<Props> {
  renderSections() {
    return MENU_SECTIONS.map(s => {
      const items = s.items.map(i => {
        const onPress = () => this.props.onSelectMenuItem(i.key)
        return (
          <TouchableOpacity onPress={onPress}>
            <MenuItem>
              <Text bold size={13} variant={'greyDark'}>
                {i.title}
              </Text>
            </MenuItem>
          </TouchableOpacity>
        )
      })
      return (
        <SectionContainer>
          <SectionHeader>
            <Text bold size={11} styles="letter-spacing: 2px;">
              {s.title}
            </Text>
          </SectionHeader>
          {items}
        </SectionContainer>
      )
    })
  }

  render() {
    return <Container>{this.renderSections()}</Container>
  }
}
