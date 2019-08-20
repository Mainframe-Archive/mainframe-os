// @flow

import { Button, TextField, Row, Column, Text } from '@morpheus-ui/core'
import {
  Form,
  type FormSubmitPayload,
  type FieldValidateFunctionParams,
} from '@morpheus-ui/forms'
import CircleArrowRight from '@morpheus-ui/icons/CircleArrowRight'
import React, { useCallback, useState } from 'react'
import { Redirect } from 'react-router'
import styled from 'styled-components/native'

import { ROUTES } from '../constants'

import Loader from '../../UIComponents/Loader'
import rpc from '../rpc'
import FlowContainer from './FlowContainer'

const FormContainer = styled.View`
  max-width: 260px;
`

const passwordValidation = ({ value }: FieldValidateFunctionParams) => {
  if (value && typeof value === 'string' && value.length < 8) {
    return 'Password must be at least 8 characters long'
  }
}

const ToolTipContent = (
  <>
    <Text variant="tooltipTitle">Where will my data be stored?</Text>
    <Text variant="tooltipText">
      Your user data is encrypted and stored locally on your device. You will be
      asked to grant permission before any app can access your data.
    </Text>
    <Text variant="tooltipTitle">DO NOT FORGET YOUR PASSWORD</Text>
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

type Status = 'input' | 'creating' | 'failed' | 'done'

export default function OnboardingCreateDB() {
  const [status, setStatus] = useState<Status>('input')

  const onSubmit = useCallback(async (payload: FormSubmitPayload) => {
    if (payload.valid) {
      setStatus('creating')
      try {
        await rpc.createDB(payload.fields.password)
        setStatus('done')
      } catch (err) {
        setStatus('failed')
      }
    }
  }, [])

  if (status === 'done') {
    return <Redirect to={ROUTES.ONBOARDING_USER} />
  }

  const errorMsg =
    status === 'failed' ? (
      <Row size={1}>
        <Column>
          <Text variant="error">Error creating vault.</Text>
        </Column>
      </Row>
    ) : null

  const action =
    status === 'creating' ? (
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
    <FlowContainer
      step={1}
      title="Welcome"
      description="Let’s quickly secure your data."
      tooltipContent={ToolTipContent}>
      <FormContainer>
        <Form onSubmit={onSubmit}>
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
    </FlowContainer>
  )
}
