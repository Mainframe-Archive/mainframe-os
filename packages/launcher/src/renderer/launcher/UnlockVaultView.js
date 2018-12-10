//@flow

import React, { Component } from 'react'
import { StyleSheet, ActivityIndicator } from 'react-native-web'

import Button from '../UIComponents/Button'
import MFTextInput from '../UIComponents/TextInput'
import Text from '../UIComponents/Text'
import OnboardContainerView from '../UIComponents/OnboardContainer'
import colors from '../colors'

import type { VaultsData } from '../../types'
import rpc from './rpc'

type Props = {
  vaultsData: VaultsData,
  onUnlockVault: () => void,
}

type State = {
  error?: ?string,
  password: string,
  awaitingResponse?: boolean,
}

export default class UnlockVaultView extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      password: '',
    }
  }

  onUnlockVault = () => {
    this.unlockVault(this.state.password)
  }

  async unlockVault(password: string) {
    this.setState({
      awaitingResponse: true,
    })
    try {
      await rpc.openVault(this.props.vaultsData.defaultVault, password)
      this.props.onUnlockVault()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err)
      this.setState({
        awaitingResponse: false,
        error:
          'Failed to unlock vault, please check you entered the correct password.',
      })
    }
  }

  onChangePassword = (value: string) => {
    this.setState({
      password: value,
    })
  }

  render() {
    const errorMsg = this.state.error ? (
      <Text style={styles.errorLabel}>{this.state.error}</Text>
    ) : null
    const action = this.state.awaitingResponse ? (
      <ActivityIndicator />
    ) : (
      <Button
        title="Unlock Vault"
        testID="vault-manager-unlock-button"
        onPress={this.onUnlockVault}
      />
    )
    return (
      <OnboardContainerView
        title="Welcome"
        description="Enter your password to unlock your vault">
        <MFTextInput
          secureTextEntry
          testID="vault-manager-unlock-input"
          style={styles.input}
          onChangeText={this.onChangePassword}
          onSubmitEditing={this.onUnlockVault}
          value={this.state.password}
          placeholder="Password"
        />
        {errorMsg}
        {action}
      </OnboardContainerView>
    )
  }
}

const PADDING = 10

const styles = StyleSheet.create({
  input: {
    marginBottom: PADDING,
    maxWidth: 300,
  },
  errorLabel: {
    fontSize: 12,
    paddingBottom: PADDING,
    color: colors.PRIMARY_RED,
  },
})
