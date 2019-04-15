// @flow

import React, { Component } from 'react'
import { TextField } from '@morpheus-ui/core'
import {
  type FormSubmitPayload,
  type FieldValidateFunctionParams,
} from '@morpheus-ui/forms'
import styled from 'styled-components/native'
import { isValidSemver } from '@mainframe/app-manifest'
import semver from 'semver'

import FormModalView from '../../UIComponents/FormModalView'

type Props = {
  currentVersion: string,
  onSetVersion: (version: string) => void,
  onRequestClose: () => void,
}

const Container = styled.View`
  flex: 1;
  width: 500px;
  padding: 20px;
  justify-content: center;
`

export default class NewVersionModal extends Component<Props> {
  validateVersion = (params: FieldValidateFunctionParams) => {
    if (params.value && typeof params.value === 'string') {
      if (!isValidSemver(params.value)) {
        return 'Please provide a valid version number, e.g. 1.0.0'
      }
      if (semver.lte(params.value, this.props.currentVersion)) {
        return `Please provide a new version higher than the current one (${
          this.props.currentVersion
        })`
      }
    }
  }

  onSetVersion = (payload: FormSubmitPayload) => {
    if (payload.valid) {
      this.props.onSetVersion(payload.fields.version)
    }
  }

  render() {
    return (
      <FormModalView
        title="New application version"
        dismissButton="CANCEL"
        confirmTestID="new-app-version-button"
        confirmButton="ADD NEW VERSION"
        onSubmitForm={this.onSetVersion}
        onRequestClose={this.props.onRequestClose}>
        <Container>
          <TextField
            autoFocus
            name="version"
            label="Version"
            testID="create-app-version-input"
            validation={this.validateVersion}
            defaultValue={semver.inc(this.props.currentVersion, 'minor')}
            required
          />
        </Container>
      </FormModalView>
    )
  }
}
