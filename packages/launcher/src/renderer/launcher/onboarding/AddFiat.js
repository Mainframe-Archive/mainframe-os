// @flow

import { Button, Row, Text } from '@morpheus-ui/core'
import LedgerIcon from '@morpheus-ui/icons/Ledger'
import PlusSymbolMdIcon from '@morpheus-ui/icons/PlusSymbolMd'
import CircleArrowRight from '@morpheus-ui/icons/CircleArrowRight'

import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import {
  commitMutation,
  createFragmentContainer,
  graphql,
  type Environment,
} from 'react-relay'
import styled from 'styled-components/native'

import RelayRenderer from '../RelayRenderer'
import { ROUTES } from '../constants'

import WyreModal from '../wallets/WyreModal'
import FlowContainer from './FlowContainer'

type State = {
  view: 'start' | 'wyre',
  error?: string,
}

const ButtonWrapper = styled.View`
  margin-right: 20px;
`

const ToolTipContent = (
  <>
    <Text variant="tooltipTitle">Why do I need a wallet?</Text>
    <Text variant="tooltipText">
      Interacting with the blockchain requires a wallet. Mainframe OS uses your
      wallet address for signing transactions, encryption, and to hold and
      transfer cryptocurrency.
    </Text>
    <Text variant="tooltipTitle">
      Can I connect my ledger or add another wallet?
    </Text>
    <Text variant="tooltipText">
      Yes, you can import an existing software wallet from a seed phrase,
      connect a ledger hardware wallet, or create a new wallet.
    </Text>
  </>
)

class OnboardingCreateWallet extends Component<{}, State> {
  state = {
    view: 'start',
  }

  closeModal = () => {
    this.setState({ view: 'start' })
  }

  onPressWyre = () => {
    this.setState({ view: 'wyre' })
  }

  renderStart() {
    return (
      <Row inner>
        <ButtonWrapper>
          <Button
            variant={['completeOnboarding', 'walletOnboarding']}
            title="Continue with Wyre"
            onPress={this.onPressWyre}
            testID="onboard-create-wallet-button"
            Icon={PlusSymbolMdIcon}
          />
        </ButtonWrapper>
        <ButtonWrapper>
          <Button
            variant={['completeOnboarding', 'walletOnboarding']}
            onPress={this.onComplete}
            title="Finish onboarding"
            Icon={CircleArrowRight}
          />
        </ButtonWrapper>
      </Row>
    )
  }

  renderWyre() {
    return (
      <WyreModal
        service="wyre"
        address={this.props.address}
        onClose={this.onClose}
        completeOnboarding={this.props.onboardComplete}
      />
    )
  }

  renderContent() {
    switch (this.state.view) {
      case 'wyre':
        return this.renderWyre()
      default:
        return this.renderStart()
    }
  }

  render() {
    console.log(this.props)
    return (
      <FlowContainer
        title="Wallet"
        description="Add fiat to your wallet."
        step={4}
        tooltipContent={ToolTipContent}
        wallet>
        {this.renderContent()}
      </FlowContainer>
    )
  }
}

const RelayContainer = createFragmentContainer(AddFiat, {
  user: graphql`
    fragment AddFiat_user on User {
      profile {
        ethAddress
      }
    }
  `,
})

export default function WalletsScreen() {
  return (
    <RelayRenderer
      render={({ props }) => (props ? <RelayContainer {...props} /> : null)}
      query={graphql`
        query AddFiatQuery {
          user: viewer {
            ...AddFiat_user
          }
        }
      `}
    />
  )
}
