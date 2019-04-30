// @flow
import React, { Component } from 'react'
import { Text, Button, DropDown } from '@morpheus-ui/core'
import styled from 'styled-components/native'
import { ETH_RPC_URLS } from '@mainframe/eth'
import { commitMutation, graphql } from 'react-relay'

import SettingsToolIcon from '@morpheus-ui/icons/SettingsToolSm'
import DocumentIcon from '@morpheus-ui/icons/DocumentSm'
import CommunityIcon from '@morpheus-ui/icons/CommunitySm'
import NetworkIcon from '@morpheus-ui/icons/NetworkSm'
import FeedbackIcon from '@morpheus-ui/icons/Feedback'
import MainframeLogoIcon from '@morpheus-ui/icons/MainframeLogoSm'
import GreaterIcon from '@morpheus-ui/icons/GreaterSm'
import ExportIcon from '@morpheus-ui/icons/ExportSm'

import { EnvironmentContext } from '../RelayEnvironment'
import SettingsItem from './SettingsItem'
import { type MenuKey } from './SettingsScreen'

type Props = {
  onSelectMenuItem: (key: MenuKey) => void,
  ethereumUrl: string,
}

type State = {
  errorMsg?: ?string,
}

const Container = styled.View`
  flex: 1;
  padding: 40px 50px;
`
const ScrollView = styled.ScrollView``

const List = styled.View`
  margin-bottom: 50px;
`

const setEthNetworkMutation = graphql`
  mutation SettingsMenuViewSetEthNetworkMutation($input: SetEthNetworkInput!) {
    setEthNetwork(input: $input) {
      viewer {
        ethURL
      }
    }
  }
`

const NETWORK_NAMES = {
  mainnet: 'Mainnet',
  ropsten: 'Testnet (Ropsten)',
  ganache: 'Ganache (localhost:8545)',
  custom: 'Custom (MFT transfers disabled)',
}

export default class SettingsMenuView extends Component<Props, State> {
  static contextType = EnvironmentContext

  state = {}

  getNetworkName() {
    const networkKey = Object.keys(ETH_RPC_URLS.WS).find(
      key => ETH_RPC_URLS.WS[key] === this.props.ethereumUrl,
    )
    return networkKey ? NETWORK_NAMES[networkKey] : NETWORK_NAMES.custom
  }

  onChangeEthNetwork = (value: string) => {
    const networkKey = Object.keys(NETWORK_NAMES).find(
      key => NETWORK_NAMES[key] === value,
    )
    // $FlowFixMe computed property
    const url = ETH_RPC_URLS.WS[networkKey]

    const input = { url }

    commitMutation(this.context, {
      mutation: setEthNetworkMutation,
      variables: { input },
      onCompleted: (res, errors) => {
        if (errors) {
          this.setState({
            errorMsg: errors[0].message || 'Error updating eth network.',
          })
        }
      },
      onError: err => {
        this.setState({
          errorMsg: err.message,
        })
      },
    })
  }

  render() {
    const errorMessage = this.state.errorMsg && (
      <Text variant="error">{this.state.errorMsg}</Text>
    )
    return (
      <ScrollView>
        <Container>
          <Text variant={['smallTitle', 'blue', 'bold']}>Developers</Text>
          <List>
            <SettingsItem
              onPress={() => this.props.onSelectMenuItem('developer')}
              first
              title="App development tool"
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
                  onChange={this.onChangeEthNetwork}
                  options={[
                    NETWORK_NAMES.mainnet,
                    NETWORK_NAMES.ropsten,
                    NETWORK_NAMES.ganache,
                  ]}
                  defaultValue={this.getNetworkName()}
                />
              )}
            />
            {errorMessage}
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
              title="Alpha version 0.3"
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
