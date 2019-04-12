// @flow

import React, { Component } from 'react'
import { Button, Row, Text } from '@morpheus-ui/core'
import { graphql, commitMutation } from 'react-relay'
import styled from 'styled-components/native'

import LedgerIcon from '@morpheus-ui/icons/Ledger'
import PlusSymbolMdIcon from '@morpheus-ui/icons/PlusSymbolMd'
import DownloadMdIcon from '@morpheus-ui/icons/DownloadMd'
import WalletCreateModal from '../wallets/WalletCreateModal'
import WalletImportView from '../wallets/WalletImportView'
import WalletAddLedgerModal from '../wallets/WalletAddLedgerModal'
import { EnvironmentContext } from '../RelayEnvironment'
import Loader from '../../UIComponents/Loader'
import OnboardContainer from './OnboardContainer'

type Props = {
  onSetupWallet: () => void,
  userID: string,
}

type State = {
  view: 'start' | 'create' | 'import' | 'ledger' | 'saving',
  error?: string,
}

const ButtonWrapper = styled.View`
  margin-right: 20px;
`

const updateProfileMutation = graphql`
  mutation OnboardWalletViewUpdateProfileMutation($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      viewer {
        identities {
          ...Launcher_identities
        }
      }
    }
  }
`

const ToolTipContent = (
  <>
    <Text variant="tooltipTitle">Why do I need a wallet?</Text>
    <Text variant="tooltipText">
      Interacting with the blockchain requires a wallet. Mainframe OS uses your wallet address for signing transactions, encryption, and to hold and transfer cryptocurrency.
    </Text>
    <Text variant="tooltipTitle">Can I connect my ledger or add another wallet?</Text>
    <Text variant="tooltipText">
      Yes, you can import an existing software wallet from a seed phrase, connect a ledger hardware wallet, or create a new wallet.
    </Text>
  </>
)

export default class OnboardWalletView extends Component<Props, State> {
  static contextType = EnvironmentContext

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

  onSetupWallet = (address: string) => {
    const input = {
      userID: this.props.userID,
      profile: {
        ethAddress: address,
      },
    }

    this.setState({
      view: 'saving',
    })

    commitMutation(this.context, {
      mutation: updateProfileMutation,
      variables: { input },
      onCompleted: (res, errors) => {
        if (errors && errors.length) {
          this.setState({
            error: errors[0].message,
          })
        } else {
          this.props.onSetupWallet()
        }
      },
      onError: err => {
        this.setState({
          error: err.message,
        })
      },
    })
  }

  renderStart() {
    return this.state.view === 'start' ? (
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
    ) : (
      <Loader />
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
      case 'saving':
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
        step={3}
        tooltipContent={ToolTipContent}
        wallet>
        {this.renderContent()}
      </OnboardContainer>
    )
  }
}
