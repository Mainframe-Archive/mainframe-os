// @flow

import {
  Button,
  Row,
  Column,
  TextField,
  Text,
  Tooltip,
} from '@morpheus-ui/core'
import { Form, type FormSubmitPayload } from '@morpheus-ui/forms'
import CircleArrowRight from '@morpheus-ui/icons/CircleArrowRight'
import React, { useCallback, useState } from 'react'
import { graphql, commitMutation } from 'react-relay'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components/native'

import { ROUTES } from '../constants'

import Loader from '../../UIComponents/Loader'
import { useEnvironment } from '../RelayEnvironment'

const Container = styled.View`
  margin-top: 20px;
  padding-left: 48px;
  flex: 1;
`

const FormContainer = styled.View`
  margin-top: 10px;
  max-width: 450px;
`

const DescriptionContainer = styled.View`
  flex-direction: row;
  align-items: center;
`

const createDeveloperMutation = graphql`
  mutation CreateDeveloperScreenMutation($input: CreateDeveloperInput!) {
    createDeveloper(input: $input) {
      developer {
        id
      }
      devtools {
        developers {
          profile {
            name
          }
        }
      }
    }
  }
`

const ERROR_MESSAGE = 'Sorry, there was a problem creating your identity.'

type State =
  | { status: 'pending' }
  | { status: 'creating' }
  | { status: 'done', developerID: string }
  | { status: 'failed', error: string }

export default function CreateDeveloper() {
  const env = useEnvironment()
  const [state, setState] = useState<State>({ status: 'pending' })

  const onSubmit = useCallback((payload: FormSubmitPayload) => {
    if (payload.valid) {
      setState({ status: 'creating' })

      commitMutation(env, {
        mutation: createDeveloperMutation,
        variables: {
          input: {
            profile: {
              name: payload.fields.name,
            },
          },
        },
        onCompleted: (res, errors) => {
          if (errors != null && errors.length > 0) {
            setState({
              status: 'failed',
              error: errors[0].message || ERROR_MESSAGE,
            })
          } else {
            setState({
              status: 'done',
              developerID: res.createDeveloper.developer.id,
            })
          }
        },
        onError: err => {
          setState({
            status: 'failed',
            error: err.message || ERROR_MESSAGE,
          })
        },
      })
    }
  })

  if (state.status === 'done') {
    return (
      <Redirect
        to={ROUTES.DEVTOOLS_DEVELOPER_APPS.replace(
          ':developerID',
          state.developerID,
        )}
      />
    )
  }

  const errorMsg =
    state.status === 'failed' ? (
      <Row size={1}>
        <Column>
          <Text variant="error">{state.error}</Text>
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
          <DescriptionContainer>
            <Text variant="greyMed" size={12}>
              Please create your developer identity in order to create apps.
            </Text>
            <Tooltip>
              <Text variant="tooltipTitle">
                Why do I need a Developer Identity?
              </Text>
              <Text variant="tooltipText">
                Your developer identity is used to sign your apps so users can
                verify authenticity when they install. They will also see your
                Developer Name next to your app icon on the Application screen.
              </Text>
            </Tooltip>
          </DescriptionContainer>
        </Column>
      </Row>
      <FormContainer>
        <Form onSubmit={onSubmit}>
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
                disabled={state.status === 'creating'}
                title="CREATE"
                variant="onboarding"
                Icon={CircleArrowRight}
                submit
                testID="create-identity-button-submit"
              />
            </Column>
          </Row>
          {state.status === 'creating' ? (
            <Row>
              <Column>
                <Loader />
              </Column>
            </Row>
          ) : null}
        </Form>
      </FormContainer>
    </Container>
  )
}
