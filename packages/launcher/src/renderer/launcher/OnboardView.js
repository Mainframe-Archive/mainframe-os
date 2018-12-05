// @flow

import React, { Component } from 'react'

import CreateVaultView from './CreateVaultView'
import OnboardIdentityView from './OnboardIdentityView'

type OnboardSteps = 'vault' | 'identity'

type State = {
  onboardStep: OnboardSteps,
}

type Props = {
  startState?: OnboardSteps,
  onboardComplete: () => Promise<any>,
}

export default class OnboardView extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      onboardStep: this.props.startState || 'vault',
    }
  }

  onVaultCreated = () => {
    this.setState({
      onboardStep: 'identity',
    })
  }

  onIdentityCreated = () => {
    this.props.onboardComplete()
  }

  onSetupWallet = () => {
    this.props.onboardComplete()
  }

  render() {
    switch (this.state.onboardStep) {
      case 'identity':
        return (
          <OnboardIdentityView onIdentityCreated={this.onIdentityCreated} />
        )
      case 'vault':
      default:
        return <CreateVaultView onVaultCreated={this.onVaultCreated} />
    }
  }
}
