//@flow

import React, { Component } from 'react'

import { graphql, commitMutation } from 'react-relay'

import styled from 'styled-components/native'
import { Button, Row, Column, TextField, Text } from '@morpheus-ui/core'
import { Form, type FormSubmitPayload } from '@morpheus-ui/forms'
import CircleArrowRight from '@morpheus-ui/icons/CircleArrowRight'

import { EnvironmentContext } from '../RelayEnvironment'
import Loader from '../../UIComponents/Loader'

type Props = {}

type State = {
  error?: string,
  adding?: boolean,
}

const Container = styled.View`
  margin-top: 20px;
  padding-left: 48px;
  flex: 1;
`

const FormContainer = styled.View`
  margin-top: 10px;
  max-width: 450px;
`

export const createDeveloperMutation = graphql`
  mutation CreateDevIdentityViewCreateDeveloperIdentityMutation(
    $input: CreateDeveloperIdentityInput!
  ) {
    createDeveloperIdentity(input: $input) {
      viewer {
        identities {
          ownDevelopers {
            profile {
              name
            }
          }
        }
      }
    }
  }
`

export default class CreateDevIdentityView extends Component<Props, State> {
  static contextType = EnvironmentContext

  state = {}

  onSubmit = async (payload: FormSubmitPayload) => {
    if (payload.valid) {
      this.setState({ adding: true })
      const input = {
        profile: {
          name: payload.fields.name,
        },
      }

      commitMutation(this.context, {
        mutation: createDeveloperMutation,
        variables: { input },
        onCompleted: () => {
          this.setState({ adding: false })
        },
        onError: err => {
          const msg =
            err.message || 'Sorry, there was a problem creating your identity.'
          this.setState({
            error: msg,
            adding: false,
          })
        },
      })
    }
  }

  render() {
    const { error, adding } = this.state
    const errorMsg = error ? (
      <Row size={1}>
        <Column>
          <Text variant="error">{error}</Text>
        </Column>
      </Row>
    ) : null

    return (
      <Container>
        <Row size={1}>
          <Column>
            <Text variant={['smallTitle', 'blue', 'noPadding', 'bold']}>
              DEVELOPER IDENTITY
            </Text>
          </Column>
        </Row>
        <Row size={1}>
          <Column>
            <Text variant="greyMed" size={12}>
              Please create your developer identity in order to create apps.
            </Text>
          </Column>
        </Row>
        <FormContainer>
          <Form onSubmit={this.onSubmit}>
            <Row size={1}>
              <Column>
                <TextField
                  name="name"
                  required
                  label="Name"
                  autoFocus
                  testID="create-identity-input-name"
                />
              </Column>
            </Row>
            <Row>{errorMsg}</Row>
            <Row size={2} top>
              <Column styles="align-items:flex-end;" smOffset={1}>
                <Button
                  disabled={adding}
                  title="CREATE"
                  variant="onboarding"
                  Icon={CircleArrowRight}
                  submit
                  testID="create-identity-button-submit"
                />
              </Column>
            </Row>
            {adding && (
              <Row>
                <Column>
                  <Loader />
                </Column>
              </Row>
            )}
          </Form>
        </FormContainer>
      </Container>
    )
  }
}
