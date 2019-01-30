// @flow

import React, { Component } from 'react'
import { Button, Row } from '@morpheus-ui/core'

import styled from 'styled-components/native'

import LedgerIcon from '@morpheus-ui/icons/Ledger'
import PlusSymbolMdIcon from '@morpheus-ui/icons/PlusSymbolMd'
import DownloadMdIcon from '@morpheus-ui/icons/DownloadMd'
import WalletCreateModal from '../wallets/WalletCreateModal'
import OnboardContainer from './OnboardContainer'

type Props = {
  onSetupWallet: () => void,
  userID: string,
}

type State = {
  view: 'start' | 'create' | 'import' | 'ledger',
}

const ButtonWrapper = styled.View`
  margin-right: 20px;
`

export default class OnboardWalletView extends Component<Props, State> {
  state = {
    view: 'start',
  }

  onPressCreate = () => {
    this.setState({
      view: 'create',
    })
  }

  onSetupWallet = () => {
    this.props.onSetupWallet()
  }

  renderStart() {
    return (
      <Row inner>
        <ButtonWrapper>
          <Button
            variant={['completeOnboarding', 'walletOnboarding']}
            title="Create"
            onPress={this.onPressCreate}
            testID="onboard-create-wallet-button"
            Icon={PlusSymbolMdIcon}
          />
        </ButtonWrapper>
        <ButtonWrapper>
          <Button
            variant={['completeOnboarding', 'walletOnboarding']}
            title="Import"
            Icon={DownloadMdIcon}
          />
        </ButtonWrapper>
        <ButtonWrapper>
          <Button
            variant={['completeOnboarding', 'walletOnboarding']}
            title="Ledger"
            Icon={LedgerIcon}
          />
        </ButtonWrapper>
      </Row>
    )
  }

  closeModal = () => {
    this.setState({
      view: 'start',
    })
  }

  renderCreate() {
    return (
      <WalletCreateModal
        onClose={this.closeModal}
        onSetupWallet={this.onSetupWallet}
        userID={this.props.userID}
        full
      />
    )
  }

  renderContent() {
    switch (this.state.view) {
      case 'start':
        return this.renderStart()
      case 'create':
      default:
        return this.renderCreate()
    }
  }

  render() {
    return (
      <OnboardContainer
        title="Wallet"
        description="Create or import your Ethereum wallet."
        step={3}>
        {this.renderContent()}
      </OnboardContainer>
    )
  }
}
