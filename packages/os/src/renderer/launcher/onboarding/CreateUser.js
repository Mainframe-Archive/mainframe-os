// @flow

import {
  Button,
  TextField,
  Row,
  Column,
  Text,
  Switch,
  Tooltip,
} from '@morpheus-ui/core'
import { Form, type FormSubmitPayload } from '@morpheus-ui/forms'
import CircleArrowRight from '@morpheus-ui/icons/CircleArrowRight'
import React, { useCallback, useState } from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components/native'

import { ROUTES } from '../constants'

import Loader from '../../UIComponents/Loader'
import rpc from '../rpc'
import FlowContainer from './FlowContainer'

const FormContainer = styled.View`
  max-width: 260px;
`

const ToolTipContent = (
  <>
    <Text variant="tooltipTitle">Why do I need an identity?</Text>
    <Text variant="tooltipText">
      An identity enables social functionality like sending payments to
      contacts, messaging, or otherwise interacting with users within Mainframe
      OS. You can choose whether or not to reveal your identity to other users.
    </Text>
  </>
)

type Status = 'input' | 'creating' | 'failed' | 'done'

export default function OnboardingCreateUser() {
  const [status, setStatus] = useState<Status>('input')

  const onSubmit = useCallback(async (payload: FormSubmitPayload) => {
    if (payload.valid) {
      setStatus('creating')
      try {
        await rpc.createUser({
          profile: { name: payload.fields.name },
          isPrivate: !payload.fields.discoverable,
        })
        setStatus('done')
      } catch (err) {
        setStatus('failed')
      }
    }
  }, [])

  if (status === 'done') {
    return <Redirect to={ROUTES.ONBOARDING_WALLET} />
  }

  const errorMsg =
    status === 'failed' ? (
      <Row size={1}>
        <Column>
          <Text variant="error">
            Sorry, there was a problem creating your identity.
          </Text>
        </Column>
      </Row>
    ) : null

  const action =
    status === 'creating' ? (
      <Loader />
    ) : (
      <Button
        variant="onboarding"
        Icon={CircleArrowRight}
        title="CONTINUE"
        testID="onboard-create-identity-button"
        invalidFormDisabled
        submit
      />
    )

  return (
    <FlowContainer
      id
      step={2}
      title="Identity"
      description="Create your Mainframe identity"
      tooltipContent={ToolTipContent}>
      <FormContainer>
        <Form onSubmit={onSubmit}>
          <Row size={1} top>
            <Column>
              <TextField
                autoFocus
                label="Name"
                name="name"
                required
                testID="onboard-create-identity-input-name"
              />
            </Column>
            <Column styles="flex-direction:row;">
              <Switch
                label="Make my identity discoverable to other users"
                name="discoverable"
              />
              <Tooltip theme={{ margin: '10px 0 0 10px' }}>
                <Text variant="tooltipTitle">
                  Why should I be discoverable?
                </Text>
                <Text variant="tooltipText">
                  Making your identity discoverable will more easily enable you
                  to interact with others. They will be able to see your name as
                  well as the ETH address attached to your default wallet.
                </Text>
              </Tooltip>
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
