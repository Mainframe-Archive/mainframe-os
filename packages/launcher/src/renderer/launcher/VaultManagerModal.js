//@flow

import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native-web'

import { client } from '../electronIpc.js'
import Button from '../UIComponents/Button'
import ModalView from '../UIComponents/ModalView'
import MFTextInput from '../UIComponents/TextInput'
import Icon from '../UIComponents/Icon'
import Text from '../UIComponents/Text'
import colors from '../colors'
import type { VaultsData, VaultPath } from '../types'

type Props = {
  vaultsData: VaultsData,
  onOpenedVault: () => void,
}

type State = {
  password: string,
  confirmPassword: string,
  unlockPassword: string,
  newVaultLabel: string,
  selectedVault: VaultPath,
  awaitingResponse?: boolean,
  showVaultList?: boolean,
  showCreateVault?: boolean,
  error?: ?string,
}

export default class VaultManagerModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      password: '',
      confirmPassword: '',
      unlockPassword: '',
      newVaultLabel: '',
      selectedVault: props.vaultsData.defaultVault,
    }
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

  onChangeLabel = (value: string) => {
    this.setState({
      newVaultLabel: value,
    })
  }

  onPressCreateVault = () => {
    const { password, confirmPassword, newVaultLabel } = this.state
    if (!newVaultLabel.length) {
      this.setState({
        error: 'Please provide a name for your vault',
      })
      return
    }
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
    this.createVault(password, this.state.newVaultLabel)
  }

  async createVault(password: string, label: string) {
    try {
      await client.createVault(password, label)
      this.props.onOpenedVault()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err)
      this.setState({
        error: 'Error creating vault',
        awaitingResponse: false,
      })
    }
  }

  onUnlockVault = () => {
    this.unlockVault(this.state.unlockPassword)
  }

  async unlockVault(password: string) {
    this.setState({
      awaitingResponse: true,
    })
    try {
      await client.openVault(this.props.vaultsData.defaultVault, password)
      this.props.onOpenedVault()
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

  onSelectVault = (path: string) => {
    this.setState({
      selectedVault: path,
      showVaultList: false,
    })
  }

  onToggleSelectVault = () => {
    this.setState({
      showVaultList: !this.state.showVaultList,
    })
  }

  onToggleShowCreateVault = () => {
    this.setState({
      showCreateVault: !this.state.showCreateVault,
      showVaultList: false,
    })
  }

  // RENDER

  renderCreateVault() {
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
    const openVaultButton = this.props.vaultsData.defaultVault ? (
      <TouchableOpacity
        style={styles.backButton}
        onPress={this.onToggleShowCreateVault}>
        <Icon name="left-arrow-grey" size={14} style={styles.leftArrow} />
        <Text style={styles.backButtonLabel}>
          Open a previously created Vault
        </Text>
      </TouchableOpacity>
    ) : null
    return (
      <View>
        <Text style={styles.title}>Create a Vault</Text>
        <Text style={styles.description}>
          This is where we securely store your files, wallets and identities.
        </Text>
        <MFTextInput
          style={styles.input}
          onChangeText={this.onChangeLabel}
          value={this.state.newVaultLabel}
          placeholder="Vault name"
          testID="create-vault-input-name"
        />
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
        {openVaultButton}
      </View>
    )
  }

  renderVaultsList() {
    const { vaultsData } = this.props
    const rows = this.state.showVaultList
      ? Object.keys(vaultsData.vaults).map(path => {
          const label = vaultsData.vaults[path]
          const onPress = () => {
            this.onSelectVault(path)
          }
          return (
            <TouchableOpacity
              key={path}
              style={styles.vaultListRow}
              onPress={onPress}>
              <Text>{label}</Text>
            </TouchableOpacity>
          )
        })
      : null
    if (rows) {
      rows.push(
        <TouchableOpacity
          key={'create'}
          style={styles.vaultListRow}
          onPress={this.onToggleShowCreateVault}>
          <Text style={styles.vaultlistCreate}>Create a new vault</Text>
        </TouchableOpacity>,
      )
    }
    return (
      <View style={styles.vaults}>
        <TouchableOpacity
          style={styles.selectedVault}
          onPress={this.onToggleSelectVault}>
          <Text style={styles.selectedVaultLabel}>
            {vaultsData.vaults[this.state.selectedVault]}
          </Text>
          <Icon name="down-arrow-grey" size={15} style={styles.downArrow} />
        </TouchableOpacity>
        <View style={styles.selectVaultList}>{rows}</View>
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
      <Button
        title="Unlock Vault"
        testID="vault-manager-unlock-button"
        onPress={this.onUnlockVault}
      />
    )
    return (
      <View>
        <Text style={styles.title}>Unlock Vault</Text>
        {this.renderVaultsList()}
        <MFTextInput
          secureTextEntry
          testID="vault-manager-unlock-input"
          style={styles.input}
          onChangeText={this.onChangeUnlockPassword}
          onSubmitEditing={this.onUnlockVault}
          value={this.state.unlockPassword}
          placeholder="Password"
        />
        {errorMsg}
        {action}
      </View>
    )
  }

  render() {
    const content =
      this.state.showCreateVault || !this.props.vaultsData.defaultVault
        ? this.renderCreateVault()
        : this.renderOpenVault()

    return <ModalView>{content}</ModalView>
  }
}

const PADDING = 10

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    paddingBottom: PADDING,
  },
  description: {
    fontSize: 13,
    paddingBottom: PADDING,
  },
  input: {
    marginBottom: PADDING,
  },
  errorLabel: {
    fontSize: 12,
    paddingBottom: PADDING,
    color: colors.PRIMARY_RED,
  },
  vaults: {
    paddingBottom: PADDING,
  },
  selectedVault: {
    backgroundColor: colors.LIGHT_GREY_EE,
    padding: PADDING,
    flexDirection: 'row',
  },
  selectedVaultLabel: {
    flex: 1,
  },
  selectVaultList: {
    borderColor: colors.LIGHT_GREY_EE,
    borderWidth: 1,
  },
  vaultListRow: {
    borderBottomColor: colors.LIGHT_GREY_EE,
    borderBottomWidth: 1,
    padding: 8,
    color: colors.GREY_MED_75,
  },
  vaultlistCreate: {
    color: colors.PRIMARY_BLUE,
  },
  downArrow: {
    paddingTop: 5,
  },
  leftArrow: {
    paddingTop: 2,
    paddingRight: 10,
  },
  backButton: {
    paddingTop: 12,
    flexDirection: 'row',
  },
  backButtonLabel: {
    fontSize: 13,
    color: colors.GREY_MED_75,
  },
})
