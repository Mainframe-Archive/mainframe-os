// @flow

import { Button, Row, Text } from '@morpheus-ui/core'
import LedgerIcon from '@morpheus-ui/icons/Ledger'
import PlusSymbolMdIcon from '@morpheus-ui/icons/PlusSymbolMd'
import DownloadMdIcon from '@morpheus-ui/icons/DownloadMd'
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components/native'

import { ROUTES } from '../constants'

import WalletCreateModal from '../wallets/WalletCreateModal'
import WalletImportView from '../wallets/WalletImportView'
import WalletAddLedgerModal from '../wallets/WalletAddLedgerModal'
import FlowContainer from './FlowContainer'

type State = {
  view: 'start' | 'create' | 'import' | 'ledger' | 'redirect',
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

export default class OnboardingCreateWallet extends Component<{}, State> {
  state = {
    view: 'start',
  }

  closeModal = () => {
    this.setState({ view: 'start' })
  }

  onPressCreate = () => {
    this.setState({ view: 'create' })
  }

  onPressImport = () => {
    this.setState({ view: 'import' })
  }

  onPressLedger = () => {
    this.setState({ view: 'ledger' })
  }

  onSetupWallet = () => {
    this.setState({ view: 'redirect' })
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
            onPress={this.onPressImport}
            title="Import"
            Icon={DownloadMdIcon}
          />
        </ButtonWrapper>
        <ButtonWrapper>
          <Button
            variant={['completeOnboarding', 'walletOnboarding']}
            onPress={this.onPressLedger}
            title="Ledger"
            Icon={LedgerIcon}
          />
        </ButtonWrapper>
      </Row>
    )
  }

  renderCreate() {
    return (
      <WalletCreateModal
        onClose={this.closeModal}
        onSetupWallet={this.onSetupWallet}
        full
      />
    )
  }

  renderLedger() {
    return (
      <WalletAddLedgerModal
        full
        wallets={[]}
        onSuccess={this.onSetupWallet}
        onClose={this.closeModal}
      />
    )
  }

  renderImport() {
    return (
      <WalletImportView
        full
        onSuccess={this.onSetupWallet}
        onClose={this.closeModal}
      />
    )
  }

  renderContent() {
    switch (this.state.view) {
      case 'redirect':
        return <Redirect to={ROUTES.HOME} />
      case 'import':
        return this.renderImport()
      case 'ledger':
        return this.renderLedger()
      case 'create':
        return this.renderCreate()
      case 'start':
      default:
        return this.renderStart()
    }
  }

  render() {
    return (
      <FlowContainer
        title="Wallet"
        description="Create or import your Ethereum wallet."
        step={3}
        tooltipContent={ToolTipContent}
        wallet>
        {this.renderContent()}
      </FlowContainer>
    )
  }
}
