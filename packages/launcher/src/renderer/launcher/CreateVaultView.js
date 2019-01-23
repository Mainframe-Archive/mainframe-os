//@flow

import React, { Component } from 'react'
import { ActivityIndicator } from 'react-native'
import { uniqueID } from '@mainframe/utils-id'

import { Button, TextField, Row, Column, Text } from '@morpheus-ui/core'
import CircleArrowRight from '@morpheus-ui/icons/CircleArrowRight'
import {
  Form,
  type FormSubmitPayload,
  type FieldValidateFunctionParams,
} from '@morpheus-ui/forms'

import styled from 'styled-components/native'

import OnboardContainer from '../UIComponents/OnboardContainer'

import rpc from './rpc'

type Props = {
  onVaultCreated: () => void,
}

type State = {
  error?: ?string,
  awaitingResponse?: boolean,
}

const FormContainer = styled.View`
  max-width: 260px;
`

export default class CreateVaultView extends Component<Props, State> {
  state = {}

  onSubmit = (payload: FormSubmitPayload) => {
    if (payload.valid) {
      const { password } = payload.fields
      this.setState({
        error: null,
        awaitingResponse: true,
      })
      const label = uniqueID()
      this.createVault(password, label)
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
      <Row size={1}>
        <Column>
          <Text variant="error">{this.state.error}</Text>
        </Column>
      </Row>
    ) : null
    const action = this.state.awaitingResponse ? (
      <ActivityIndicator />
    ) : (
      <Button
        title="CONTINUE"
        variant="onboarding"
        Icon={CircleArrowRight}
        testID="create-vault-button-submit"
        submit
      />
    )
    return (
      <OnboardContainer
        step={1}
        title="Welcome"
        description="Let’s quickly secure your MainframeOS vault.">
        <FormContainer>
          <Form onSubmit={this.onSubmit}>
            <Row size={1} top>
              <Column>
                <TextField
                  autoFocus
                  label="Password"
                  name="password"
                  type="password"
                  testID="create-vault-input-password"
                  validation={this.passwordValidation}
                  required
                />
              </Column>
              <Column>
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  testID="create-vault-input-confirm-password"
                  validation={this.confirmPasswordValidation}
                />
              </Column>
            </Row>
            {errorMsg}
            <Row size={2} top>
              <Column styles="align-items:flex-end;" smOffset={1}>
                {action}
              </Column>
            </Row>
          </Form>
        </FormContainer>
      </OnboardContainer>
    )
  }
}
