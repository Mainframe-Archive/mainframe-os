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
  saving?: boolean,
  error?: ?string,
}

export default class VaultCreateModal extends Component<Props, State> {
  state = {
    password: '',
    confirmPassword: '',
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
      saving: true,
    })
    this.createVault(password)
  }

  async createVault(password: string) {
    try {
      const res = await callMainProcess('createVault', [password])
      this.props.onOpenedVault()
    } catch (err) {
      console.warn(err)
    }
  }

  // RENDER

  renderCreateVault() {
    const errorMsg = this.state.error ? (
      <Text style={styles.errorLabel}>{this.state.error}</Text>
    ) : null
    const action = this.state.saving ? (
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
    return (
      <View>
        <MFTextInput
          style={styles.input}
          onChangeText={this.onChangePassword}
          value={this.state.password}
          placeholder="vault password"
        />
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
  },
  description: {
    fontSize: 12,
    paddingVertical: 10,
  },
  input: {
    marginBottom: 10,
  },
  errorLabel: {
    paddingBottom: 10,
    color: colors.PRIMARY_RED,
  },
})
