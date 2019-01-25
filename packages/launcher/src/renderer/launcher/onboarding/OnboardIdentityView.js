//@flow

import React, { Component } from 'react'
import { ActivityIndicator } from 'react-native'
import { graphql, commitMutation } from 'react-relay'
import { Button, TextField, Row, Column, Text, Switch } from '@morpheus-ui/core'
import CircleArrowRight from '@morpheus-ui/icons/CircleArrowRight'
import { Form, type FormSubmitPayload } from '@morpheus-ui/forms'
import styled from 'styled-components/native'

import { EnvironmentContext } from '../RelayEnvironment'
import OnboardContainer from './OnboardContainer'

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

export const createUserMutation = graphql`
  mutation OnboardIdentityViewCreateUserIdentityMutation(
    $input: CreateUserIdentityInput!
  ) {
    createUserIdentity(input: $input) {
      user {
        localID
        profile {
          name
        }
      }
      viewer {
        identities {
          ownUsers {
            defaultEthAddress
            localID
          }
          ...Launcher_identities
        }
      }
    }
  }
`

export default class OnboardIdentityView extends Component<Props, State> {
  static contextType = EnvironmentContext

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
    const input = {
      profile: {
        name,
      },
    }

    commitMutation(this.context, {
      mutation: createUserMutation,
      variables: { input },
      onCompleted: ({ createUserIdentity }, errors) => {
        if (errors && errors.length) {
          this.setState({
            error: errors[0].message,
            awaitingResponse: false,
          })
        } else {
          this.props.onIdentityCreated(createUserIdentity.user.localID)
        }
      },
      onError: err => {
        const msg =
          err.message || 'Sorry, there was a problem creating your identity.'
        this.setState({
          error: msg,
          awaitingResponse: false,
        })
      },
    })
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
        step={2}
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
              <Column>
                <Switch label="Make my name discoverable" name="discoverable" />
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
