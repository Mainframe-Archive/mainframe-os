// @flow

import React, { Component } from 'react'
import { Button, Row } from '@morpheus-ui/core'
import { graphql, commitMutation } from 'react-relay'
import styled from 'styled-components/native'

import LedgerIcon from '@morpheus-ui/icons/Ledger'
import PlusSymbolMdIcon from '@morpheus-ui/icons/PlusSymbolMd'
import DownloadMdIcon from '@morpheus-ui/icons/DownloadMd'
import WalletCreateModal from '../wallets/WalletCreateModal'
import { EnvironmentContext } from '../RelayEnvironment'
import OnboardContainer from './OnboardContainer'

type Wallet = {
  accounts: Array<{ address: string }>,
}

type Props = {
  onSetupWallet: (wallet: Wallet) => void,
  userID: string,
}

type State = {
  view: 'start' | 'create' | 'import' | 'ledger',
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

  onSetupWallet = (wallet: Wallet) => {
    const input = {
      userID: this.props.userID,
      profile: {
        ethAddress: wallet.accounts[0].address,
      },
    }

    commitMutation(this.context, {
      mutation: updateProfileMutation,
      variables: { input },
      onCompleted: (res, errors) => {
        if (errors && errors.length) {
          this.setState({
            error: errors[0].message,
          })
        } else {
          this.props.onSetupWallet(wallet)
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
