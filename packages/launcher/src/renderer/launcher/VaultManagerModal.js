//@flow

import React, { createRef, Component, type ElementRef } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native-web'
import type { ID } from '@mainframe/utils-id'

import { client, callMainProcess } from '../electronIpc.js'
import Button from '../Button'
import ModalView from '../ModalView'
import MFTextInput from '../UIComponents/TextInput'
import colors from '../colors'

type Props = {
  defaultVault?: string,
  vaultPaths?: Array<string>,
  onOpenedVault: () => void,
}

type State = {
  password: string,
  confirmPassword: string,
  unlockPassword: string,
  awaitingResponse?: boolean,
  error?: ?string,
}

export default class VaultCreateModal extends Component<Props, State> {
  state = {
    password: '',
    confirmPassword: '',
    unlockPassword: '',
  }

  // HANDLERS

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

  onChangeUnlockPassword = (value: string) => {
    this.setState({
      unlockPassword: value,
    })
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
    this.createVault(password)
  }

  async createVault(password: string) {
    try {
      const res = await callMainProcess('createVault', [password])
      this.props.onOpenedVault()
    } catch (err) {
      console.warn(err)
      this.setState({
        error: 'Error creating vault',
      })
    }
  }

  onPressUnlockVault = () => {
    this.unlockVault(this.state.unlockPassword)
  }

  async unlockVault(password: string) {
    this.setState({
      awaitingResponse: true,
    })
    try {
      await callMainProcess('openVault', [this.props.defaultVault, password])
      this.props.onOpenedVault()
    } catch (err) {
      console.warn(err)
      this.setState({
        awaitingResponse: false,
        error:
          'Failed to unlock vault, please check you entered the correct password.',
      })
    }
  }

  // RENDER

  renderCreateVault() {
    const errorMsg = this.state.error ? (
      <Text style={styles.errorLabel}>{this.state.error}</Text>
    ) : null
    const action = this.state.awaitingResponse ? (
      <ActivityIndicator />
    ) : (
      <Button title="Create Vault" onPress={this.onPressCreateVault} />
    )
    return (
      <View>
        <Text style={styles.title}>Create a Vault</Text>
        <Text style={styles.description}>
          This is where we securely store your files, wallets and identities.
        </Text>
        <MFTextInput
          secureTextEntry
          style={styles.input}
          onChangeText={this.onChangePassword}
          value={this.state.password}
          placeholder="Password"
        />
        <MFTextInput
          secureTextEntry
          style={styles.input}
          onChangeText={this.onChangeConfirmPassword}
          value={this.state.confirmPassword}
          placeholder="Confirm Password"
        />
        {errorMsg}
        {action}
      </View>
    )
  }

  renderOpenVault() {
    const errorMsg = this.state.error ? (
      <Text style={styles.errorLabel}>{this.state.error}</Text>
    ) : null
    const action = this.state.awaitingResponse ? (
      <ActivityIndicator />
    ) : (
      <Button title="Unlock Vault" onPress={this.onPressUnlockVault} />
    )
    return (
      <View>
        <Text style={styles.title}>Unlock Vault</Text>
        <MFTextInput
          secureTextEntry
          style={styles.input}
          onChangeText={this.onChangeUnlockPassword}
          value={this.state.unlockPassword}
          placeholder="Password"
        />
        {errorMsg}
        {action}
      </View>
    )
  }

  render() {
    const content = this.props.defaultVault
      ? this.renderOpenVault()
      : this.renderCreateVault()

    return <ModalView>{content}</ModalView>
  }
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  description: {
    fontSize: 12,
    paddingBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  errorLabel: {
    fontSize: 12,
    paddingBottom: 10,
    color: colors.PRIMARY_RED,
  },
})
