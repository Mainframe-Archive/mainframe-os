// @flow

import React, { Component } from 'react'
import { Text } from '@morpheus-ui/core'

import OnboardIdentityView from './OnboardIdentityView'
import OnboardWalletView from './OnboardWalletView'

type OnboardSteps = 'identity' | 'wallet'

type State = {
  onboardStep: OnboardSteps,
}

type Props = {
  userID?: ?string,
  startState?: OnboardSteps,
  onboardComplete: () => any,
}

export default class OnboardView extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      onboardStep: this.props.startState || 'identity',
    }
  }

  onVaultCreated = () => {
    this.setState({
      onboardStep: 'identity',
    })
  }

  onIdentityCreated = () => {
    this.setState({
      onboardStep: 'wallet',
    })
  }

  onSetupWallet = () => {
    this.props.onboardComplete()
  }

  renderOnboardWallet() {
    if (this.props.userID) {
      return (
        <OnboardWalletView
          userID={this.props.userID}
          onSetupWallet={this.onSetupWallet}
        />
      )
    } else {
      return <Text variant="error">Error: No user found.</Text>
    }
  }

  render() {
    switch (this.state.onboardStep) {
      case 'wallet':
        return this.renderOnboardWallet()
      case 'identity':
      default:
        return (
          <OnboardIdentityView onIdentityCreated={this.onIdentityCreated} />
        )
    }
  }
}
