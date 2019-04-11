//@flow

import React, { Component } from 'react'

import { uniqueID } from '@mainframe/utils-id'

import { Button, TextField, Row, Column, Text } from '@morpheus-ui/core'
import CircleArrowRight from '@morpheus-ui/icons/CircleArrowRight'
import {
  Form,
  type FormSubmitPayload,
  type FieldValidateFunctionParams,
} from '@morpheus-ui/forms'

import styled from 'styled-components/native'

import Loader from '../UIComponents/Loader'
import rpc from './rpc'
import OnboardContainer from './onboarding/OnboardContainer'

type Props = {
  onVaultCreated: () => void,
}

type State = {
  error?: ?string,
  awaitingResponse?: boolean,
  validPass?: boolean,
}

const FormContainer = styled.View`
  max-width: 260px;
`

const passwordValidation = ({ value }: FieldValidateFunctionParams) => {
  if (value && typeof value === 'string' && value.length < 8) {
    return 'Password must be at least 8 characters'
  }
}

const ToolTipContent = (
  <>
    <Text variant="tooltipTitle">Where will my data be stored?</Text>
    <Text variant="tooltipText">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin consectetur
      mi in malesuada porttitor.
    </Text>
    <Text variant="tooltipTitle">Why should I make my name discoverable?</Text>
    <Text variant="tooltipText">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin consectetur
      mi in malesuada porttitor.
    </Text>
  </>
)

const confirmPasswordValidation = ({
  value,
  values,
}: FieldValidateFunctionParams) => {
  if (values && value !== values.password) {
    return 'Passwords do not match'
  }
  return ''
}

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
        error: 'Error creating vault.',
        awaitingResponse: false,
      })
    }
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
      <Loader />
    ) : (
      <Button
        title="CONTINUE"
        variant="onboarding"
        Icon={CircleArrowRight}
        testID="create-vault-button-submit"
        invalidFormDisabled
        submit
      />
    )
    return (
      <OnboardContainer
        step={1}
        title="Welcome"
        description="Let’s quickly secure your data."
        tooltipContent={ToolTipContent}>
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
                  validation={passwordValidation}
                  required
                />
              </Column>
              <Column>
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  renderIfValid="password"
                  testID="create-vault-input-confirm-password"
                  validation={confirmPasswordValidation}
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
