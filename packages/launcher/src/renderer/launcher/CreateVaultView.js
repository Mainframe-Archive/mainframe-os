//@flow

import React, { Component } from 'react'
import { ActivityIndicator } from 'react-native-web'
import { uniqueID } from '@mainframe/utils-id'

import { Button, TextField } from '@morpheus-ui/core'
import {
  Form,
  type FormSubmitPayload,
  type FieldValidateFunctionParams,
} from '@morpheus-ui/forms'
import styled from 'styled-components/native'

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

const PADDING = 10

const ErrorText = styled.View`
  font-size: 14px;
  padding-bottom: ${PADDING}px;
  color: ${colors.PRIMARY_RED};
`

export default class CreateVaultView extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      password: '',
      confirmPassword: '',
    }
  }

  onSubmit = (payload: FormSubmitPayload) => {
    if (payload.valid) {
      const { password } = payload.fields
      this.setState({
        error: null,
        awaitingResponse: true,
      })
      // const label = uniqueID()
      // this.createVault(password, label)
    }
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

  passwordValidation = ({ value }: FieldValidateFunctionParams) => {
    if (value && typeof value === 'string' && value.length < 8) {
      return 'Password must be at least 8 characters'
    }
  }

  confirmPasswordValidation = ({
    value,
    values,
  }: FieldValidateFunctionParams) => {
    if (values && value !== values.password) {
      return 'Passwords do not match'
    }
    return ''
  }

  render() {
    const errorMsg = this.state.error ? (
      <ErrorText>{this.state.error}</ErrorText>
    ) : null
    const action = this.state.awaitingResponse ? (
      <ActivityIndicator />
    ) : (
      <Button title="Create Vault" testID="create-vault-button-submit" submit />
    )
    return (
      <OnboardContainer
        title="Welcome"
        description="This is where we securely store your files, wallets and identities.">
        <Form onSubmit={this.onSubmit}>
          <TextField
            label="Password"
            name="password"
            type="password"
            testID="create-vault-input-password"
            validation={this.passwordValidation}
            required
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            testID="create-vault-input-password"
            validation={this.confirmPasswordValidation}
          />
          {errorMsg}
          {action}
        </Form>
      </OnboardContainer>
    )
  }
}
