//@flow

import React, { Component } from 'react'
import { StyleSheet, ActivityIndicator } from 'react-native-web'
import { uniqueID } from '@mainframe/utils-id'

import Button from '../UIComponents/Button'
import MFTextInput from '../UIComponents/TextInput'
import Text from '../UIComponents/Text'
import OnboardContainer from '../UIComponents/OnboardContainer'
import colors from '../colors'

import rpc from './rpc'

type Props = {
  onVaultCreated: () => void,
}

type State = {
  error?: ?string,
  password: string,
  confirmPassword: string,
  awaitingResponse?: boolean,
}

export default class CreateVaultView extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      password: '',
      confirmPassword: '',
    }
  }

  onPressCreateVault = () => {
    const { password, confirmPassword } = this.state
    if (password.length < 8) {
      this.setState({
        error: 'Password must be at least 8 characters',
      })
      return
    } else if (password !== confirmPassword) {
      this.setState({
        error: 'Passwords do not match',
      })
      return
    }
    this.setState({
      error: null,
      awaitingResponse: true,
    })
    const label = uniqueID()
    this.createVault(password, label)
  }

  async createVault(password: string, label: string) {
    try {
      await rpc.createVault(password, label)
      this.props.onVaultCreated()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err)
      this.setState({
        error: 'Error creating vault',
        awaitingResponse: false,
      })
    }
  }

  onChangePassword = (value: string) => {
    this.setState({
      password: value,
    })
  }

  onChangeConfirmPassword = (value: string) => {
    this.setState({
      confirmPassword: value,
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
        title="Create Vault"
        testID="create-vault-button-submit"
        onPress={this.onPressCreateVault}
      />
    )
    return (
      <OnboardContainer
        title="Welcome"
        description="This is where we securely store your files, wallets and identities.">
        <MFTextInput
          secureTextEntry
          style={styles.input}
          onChangeText={this.onChangePassword}
          value={this.state.password}
          placeholder="Password"
          testID="create-vault-input-password"
        />
        <MFTextInput
          secureTextEntry
          style={styles.input}
          onChangeText={this.onChangeConfirmPassword}
          value={this.state.confirmPassword}
          placeholder="Confirm Password"
          testID="create-vault-input-confirm-password"
        />
        {errorMsg}
        {action}
      </OnboardContainer>
    )
  }
}

const PADDING = 10

const styles = StyleSheet.create({
  input: {
    marginBottom: PADDING * 2,
    maxWidth: 300,
  },
  errorLabel: {
    fontSize: 14,
    paddingBottom: PADDING,
    color: colors.PRIMARY_RED,
  },
})
