// @flow

import { Button, TextField, Row, Column, Switch, Text } from '@morpheus-ui/core'
import { Form, type FormSubmitPayload } from '@morpheus-ui/forms'
import CircleArrowRight from '@morpheus-ui/icons/CircleArrowRight'
import React, { useCallback, useState } from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components/native'

import { ROUTES } from '../constants'

import Loader from '../../UIComponents/Loader'
import rpc from '../rpc'
import FlowContainer from './FlowContainer'

type Status =
  | 'input'
  | 'checking'
  | 'failed'
  | 'redirect-user'
  | 'redirect-wallet'
  | 'redirect-home'

const FormContainer = styled.View`
  max-width: 260px;
`

export default function OnboardingOpenDB() {
  const [status, setStatus] = useState<Status>('input')

  const onSubmit = useCallback(async (payload: FormSubmitPayload) => {
    if (payload.valid) {
      setStatus('checking')
      try {
        const res = await rpc.openDB(
          payload.fields.password,
          payload.fields.save,
        )
        if (!res.user) {
          setStatus('redirect-user')
        } else if (!res.wallet) {
          setStatus('redirect-wallet')
        } else {
          setStatus('redirect-home')
        }
      } catch (err) {
        setStatus('failed')
      }
    }
  }, [])

  if (status === 'redirect-user') {
    return <Redirect to={ROUTES.ONBOARDING_USER} />
  }
  if (status === 'redirect-wallet') {
    return <Redirect to={ROUTES.ONBOARDING_WALLET} />
  }
  if (status === 'redirect-home') {
    return <Redirect to={ROUTES.HOME} />
  }

  const errorMsg =
    status === 'failed' ? (
      <Row size={1}>
        <Column>
          <Text variant="error">
            Failed to unlock vault, please check you entered the correct
            password.
          </Text>
        </Column>
      </Row>
    ) : null

  const action =
    status === 'checking' ? (
      <Loader />
    ) : (
      <Button
        title="UNLOCK"
        variant="onboarding"
        Icon={CircleArrowRight}
        testID="vault-manager-unlock-button"
        submit
      />
    )

  return (
    <FlowContainer
      title="Welcome"
      description="Enter your password to unlock your vault.">
      <FormContainer>
        <Form onSubmit={onSubmit}>
          <Row size={1} top>
            <Column>
              <TextField
                autoFocus
                label="Password"
                name="password"
                type="password"
                testID="vault-manager-unlock-input"
                required
              />
            </Column>
          </Row>
          {errorMsg}
          <Row size={2} top>
            <Column>
              <Switch label="Save my password on this device" name="save" />
            </Column>
            <Column styles="align-items:flex-end;" smOffset={1}>
              {action}
            </Column>
          </Row>
        </Form>
      </FormContainer>
    </FlowContainer>
  )
}
