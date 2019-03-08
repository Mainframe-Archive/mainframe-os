// @flow

import React, { Component } from 'react'
import { Text, TextField, Switch } from '@morpheus-ui/core'
import styled from 'styled-components/native'
import { type FormSubmitPayload } from '@morpheus-ui/forms'
import { createFragmentContainer, graphql, commitMutation } from 'react-relay'

import { EnvironmentContext } from '../RelayEnvironment'
import FormModalView from '../../UIComponents/FormModalView'
import { type OwnUserIdentity } from './__generated__/IdentityEditModal_ownUserIdentity.graphql.js'

type Props = {
  ownUserIdentity: OwnUserIdentity,
  onClose: () => void,
}

type State = {
  errorMsg?: ?string,
  updating?: ?boolean,
  discoverable?: ?boolean,
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

const updateProfileMutation = graphql`
  mutation IdentityEditModalUpdateProfileMutation($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      viewer {
        identities {
          ...Launcher_identities
          ...IdentitiesView_identities
        }
      }
    }
  }
`

class IdentityEditModal extends Component<Props, State> {
  static contextType = EnvironmentContext

  state = {}

  onSubmit = (payload: FormSubmitPayload) => {
    if (payload.valid) {
      const input = {
        userID: this.props.ownUserIdentity.localID,
        profile: {
          name: payload.fields.name,
        },
        privateProfile: !payload.fields.discoverable,
      }

      this.setState({ updating: true })

      commitMutation(this.context, {
        mutation: updateProfileMutation,
        variables: { input },
        onCompleted: (res, errors) => {
          if (errors && errors.length) {
            this.setState({
              errorMsg: errors[0].message,
              updating: false,
            })
          } else {
            this.props.onClose()
          }
        },
        onError: err => {
          this.setState({
            errorMsg: err.message,
            updating: false,
          })
        },
      })
    }
  }

  onToggleDiscoverable = (value: boolean) => {
    this.setState({
      discoverable: value,
    })
  }

  render() {
    const updateError = this.state.errorMsg ? (
      <Text variant="error">{this.state.errorMsg}</Text>
    ) : null
    return (
      <FormModalView
        onRequestClose={this.props.onClose}
        title="Edit Identity"
        dismissButton="CANCEL"
        onPressDismiss={this.props.onClose}
        confirmButton="SAVE"
        confirmButtonDisabled={!!this.state.updating}
        onSubmitForm={this.onSubmit}>
        <Container>
          <FormContainer>
            <TextField
              autoFocus
              name="name"
              required
              defaultValue={this.props.ownUserIdentity.profile.name}
            />
            <Switch
              name="discoverable"
              defaultValue={!this.props.ownUserIdentity.privateProfile}
              label="Make my name and ETH address discoverable to other users"
              onChange={this.onToggleDiscoverable}
            />
            {updateError}

            {this.props.ownUserIdentity.feedHash && (
              <>
                <Text variant="smallTitle" theme={{ padding: '20px 0 10px 0' }}>
                  Mainframe Contact ID
                </Text>
                <Text variant="addressLarge">
                  {this.props.ownUserIdentity.feedHash}
                </Text>
              </>
            )}
          </FormContainer>
        </Container>
      </FormModalView>
    )
  }
}

export default createFragmentContainer(IdentityEditModal, {
  ownUserIdentity: graphql`
    fragment IdentityEditModal_ownUserIdentity on OwnUserIdentity {
      localID
      feedHash
      privateProfile
      profile {
        name
        avatar
      }
    }
  `,
})
