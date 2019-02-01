// @flow

import React, { Component } from 'react'
import { Text, TextField, Switch } from '@morpheus-ui/core'
import styled from 'styled-components/native'
import { type FormSubmitPayload } from '@morpheus-ui/forms'

import FormModalView from '../../UIComponents/FormModalView'
import { type User } from './IdentitiesView'

type Props = {
  user: User,
  onClose: () => void,
}

const Container = styled.View`
  width: 100%;
  max-width: 450px;
  min-width: 300px;
  flex: 1;
  justify-content: center;
`

const FormContainer = styled.View`
  padding: 20px;
  justify-content: center;
  width: 100%;
  min-width: 300px;
`

export default class IdentityEditModal extends Component<Props> {
  onSubmit = (payload: FormSubmitPayload) => {
    if (payload.valid) {
      // TODO: Implement edit Identity
      this.props.onClose()
    }
  }

  render() {
    return (
      <FormModalView
        onRequestClose={this.props.onClose}
        title="Edit Identity"
        dismissButton="CANCEL"
        onPressDismiss={this.props.onClose}
        confirmButton="SAVE"
        onSubmitForm={this.onSubmit}>
        <Container>
          <FormContainer>
            <TextField
              autoFocus
              name="name"
              required
              defaultValue={this.props.user.profile.name}
            />
            <Switch
              name="discoverable"
              defaultValue={this.props.user.discoverable}
              label="Make my name discoverable"
            />

            {this.props.user.feedHash && (
              <>
                <Text variant="smallTitle" theme={{ padding: '20px 0 10px 0' }}>
                  Mainframe ID
                </Text>
                <Text variant="addressLarge">{this.props.user.feedHash}</Text>
              </>
            )}
          </FormContainer>
        </Container>
      </FormModalView>
    )
  }
}
