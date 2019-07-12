// @flow

import { Text, Button, TextField, Switch } from '@morpheus-ui/core'
import {
  type FormSubmitPayload,
  type FieldValidateFunctionParams,
} from '@morpheus-ui/forms'
import React, { Component, createRef } from 'react'
import styled from 'styled-components/native'

import FormModalView from '../../UIComponents/FormModalView'

export type AppData = {
  name?: ?string,
  contentsPath?: ?string,
  version?: ?string,
}

export type CompleteAppData = {
  name: string,
  contentsPath: string,
  version: string,
}

type Props = {
  appData: AppData,
  isEdition?: boolean,
  onSetAppData: (appData: CompleteAppData) => void,
  onRequestClose: () => void,
  previousVersion?: ?string,
  submitButtonTitle?: ?string,
}

const Container = styled.View`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  padding: 20px 80px;
`

const Row = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

export default class TermsAndConditions extends Component<Props> {
  render() {
    return (
      <FormModalView
        title={'Terms and conditions'}
        dismissButton={this.props.onPressBack ? 'BACK' : 'CANCEL'}
        confirmButton="DONE"
        onPressDismiss={this.props.onPressBack}
        onPressConfirm={this.props.onProceed}
        onRequestClose={this.props.onRequestClose}>
        <Container>
          <Row>
            <Text size={14} theme={{ marginBottom: '20px' }}>
              Some initial text about app restrictions and our terms of service.
              Some initial text about app restrictions and our terms of service.
              Some initial text about app restrictions and our terms of service.
              Some initial text about app restrictions and our terms of service.
            </Text>
          </Row>
          <Row>
            <Text size={13} variant={'center'} theme={{ marginBottom: '10px' }}>
              Condition 1.
            </Text>
          </Row>
          <Row>
            <Text
              size={13}
              variant={'greyMed'}
              theme={{ marginBottom: '10px' }}>
              Here is some longer text that can go on for a while and this is
              how it will look.
            </Text>
            <Switch name="cond1" label="I agree" required />
          </Row>
          <Row>
            <Text size={13} variant={'center'} theme={{ marginBottom: '10px' }}>
              Condition 2.
            </Text>
          </Row>
          <Row>
            <Text
              size={13}
              variant={'greyMed'}
              theme={{ marginBottom: '10px' }}>
              Here is some longer text that can go on for a while and this is
              how it will look.
            </Text>
            <Switch name="cond2" label="I agree" required />
          </Row>
          <Row>
            <Text size={13} variant={'center'} theme={{ marginBottom: '10px' }}>
              Condition 3.
            </Text>
          </Row>
          <Row>
            <Text
              size={13}
              variant={'greyMed'}
              theme={{ marginBottom: '10px' }}>
              Here is some longer text that can go on for a while and this is
              how it will look.
            </Text>
            <Switch name="cond3" label="I agree" required />
          </Row>
        </Container>
      </FormModalView>
    )
  }
}
