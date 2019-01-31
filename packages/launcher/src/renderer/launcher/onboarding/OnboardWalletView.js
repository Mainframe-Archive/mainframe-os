// @flow

import React, { Component } from 'react'
import { Button, Row } from '@morpheus-ui/core'

import styled from 'styled-components/native'

import LedgerIcon from '@morpheus-ui/icons/Ledger'
import PlusSymbolMdIcon from '@morpheus-ui/icons/PlusSymbolMd'
import DownloadMdIcon from '@morpheus-ui/icons/DownloadMd'
import WalletCreateModal from '../wallets/WalletCreateModal'
import WalletImportView from '../wallets/WalletImportView'
import WalletAddLedgerModal from '../wallets/WalletAddLedgerModal'
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

  onPressImport = () => {
    this.setState({
      view: 'import',
    })
  }

  onPressLedger = () => {
    this.setState({
      view: 'ledger',
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

  renderLedger() {
    return (
      <WalletAddLedgerModal
        full
        wallets={[]}
        onSuccess={this.onSetupWallet}
        onClose={this.closeModal}
        userID={this.props.userID}
      />
    )
  }

  renderImport() {
    return (
      <WalletImportView
        full
        onSuccess={this.onSetupWallet}
        onClose={this.closeModal}
        userID={this.props.userID}
      />
    )
  }

  renderContent() {
    switch (this.state.view) {
      case 'start':
        return this.renderStart()
      case 'import':
        return this.renderImport()
      case 'ledger':
        return this.renderLedger()
      case 'create':
        return this.renderCreate()
      default:
        return null
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
