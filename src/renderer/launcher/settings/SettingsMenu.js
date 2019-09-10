// @flow

import { shell } from 'electron'
import { Text } from '@morpheus-ui/core'
import SettingsToolIcon from '@morpheus-ui/icons/SettingsToolSm'
import DocumentIcon from '@morpheus-ui/icons/DocumentSm'
import CommunityIcon from '@morpheus-ui/icons/CommunitySm'
import FeedbackIcon from '@morpheus-ui/icons/Feedback'
import GreaterIcon from '@morpheus-ui/icons/GreaterSm'
import ExportIcon from '@morpheus-ui/icons/ExportSm'
import React from 'react'
import type { RouterHistory } from 'react-router'
import styled from 'styled-components/native'

import { ROUTES } from '../constants'

import EthereumNetworkSelector from './EthereumNetworkSelector'
import SettingsItem from './SettingsItem'
import SystemUpdateItem from './SystemUpdateItem'

const EXTERNAL_URLS = {
  docs: 'https://mainframe.com/developers/',
  help: 'https://community.mainframe.com/',
  feedback: 'https://mainframe.com/contact/',
}

const openExternal = (key: $Keys<typeof EXTERNAL_URLS>) => {
  const url = EXTERNAL_URLS[key]
  if (url != null) {
    shell.openExternal(url)
  }
}

const Container = styled.View`
  flex: 1;
  padding: 40px 50px;
`
const ScrollView = styled.ScrollView``

const List = styled.View`
  margin-bottom: 50px;
`

type Props = {
  history: RouterHistory,
}

export default function SettingsMenu(props: Props) {
  return (
    <ScrollView>
      <Container>
        <Text variant={['smallTitle', 'blue', 'bold']}>Developers</Text>
        <List>
          <SettingsItem
            onPress={() => props.history.push(ROUTES.DEVTOOLS)}
            first
            title="App development tool"
            Icon={SettingsToolIcon}
            RightElement={GreaterIcon}
          />
          <SettingsItem
            onPress={() => openExternal('docs')}
            title="API documentation"
            Icon={DocumentIcon}
            RightElement={ExportIcon}
          />
          <SettingsItem
            onPress={() => openExternal('help')}
            title="Community / Help"
            Icon={CommunityIcon}
            RightElement={ExportIcon}
          />
          <EthereumNetworkSelector />
        </List>
        <Text variant={['smallTitle', 'blue', 'bold']}>About</Text>
        <List>
          <SettingsItem
            first
            onPress={() => openExternal('feedback')}
            title="Feedback"
            Icon={FeedbackIcon}
            RightElement={ExportIcon}
          />
          <SystemUpdateItem />
        </List>
      </Container>
    </ScrollView>
  )
}
