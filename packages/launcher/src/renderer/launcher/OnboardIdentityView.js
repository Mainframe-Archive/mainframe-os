//@flow

import React, { Component } from 'react'
import { ActivityIndicator } from 'react-native'

import { Button, TextField, Row, Column, Text } from '@morpheus-ui/core'
import CircleArrowRight from '@morpheus-ui/icons/CircleArrowRight'
import { Form, type FormSubmitPayload } from '@morpheus-ui/forms'

import styled from 'styled-components/native'

import OnboardContainer from '../UIComponents/OnboardContainer'

import rpc from './rpc'

type Props = {
  onIdentityCreated: (id: string) => void,
}

type State = {
  error?: ?string,
  awaitingResponse?: boolean,
}

const FormContainer = styled.View`
  max-width: 260px;
`

export default class OnboardIdentityView extends Component<Props, State> {
  state = {}

  onSubmit = (payload: FormSubmitPayload) => {
    const { valid, fields } = payload

    if (valid) {
      this.setState({
        error: null,
        awaitingResponse: true,
      })
      this.createIdentity(fields.name)
    }
  }

  async createIdentity(name: string) {
    try {
      const res = await rpc.createUserIdentity({ name })
      this.props.onIdentityCreated(res.id)
    } catch (err) {
      this.setState({
        error: err.message,
        awaitingResponse: false,
      })
      // eslint-disable-next-line no-console
      console.warn(err)
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
      <ActivityIndicator />
    ) : (
      <Button
        variant="onboarding"
        Icon={CircleArrowRight}
        title="CONTINUE"
        testID="onboard-create-identity-button"
        submit
      />
    )
    return (
      <OnboardContainer
        id
        title="Identity"
        description="Create your first identity">
        <FormContainer>
          <Form onSubmit={this.onSubmit}>
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
