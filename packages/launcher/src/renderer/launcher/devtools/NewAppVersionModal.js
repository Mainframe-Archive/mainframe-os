// @flow

import { TextField } from '@morpheus-ui/core'
import {
  type FormSubmitPayload,
  type FieldValidateFunctionParams,
} from '@morpheus-ui/forms'
import React, { useCallback } from 'react'
import semver from 'semver'
import styled from 'styled-components/native'

import { isValidSemver } from '../../../validation'

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

export default function NewAppVersionModal(props: Props) {
  const validateVersion = useCallback(
    (params: FieldValidateFunctionParams) => {
      if (params.value && typeof params.value === 'string') {
        if (!isValidSemver(params.value)) {
          return 'Please provide a valid version number, e.g. 1.0.0'
        }
        if (semver.lte(params.value, props.currentVersion)) {
          return `Please provide a new version higher than the current one (${
            props.currentVersion
          })`
        }
      }
    },
    [props.currentVersion],
  )

  const onSetVersion = useCallback((payload: FormSubmitPayload) => {
    if (payload.valid) {
      this.props.onSetVersion(payload.fields.version)
    }
  }, [])

  return (
    <FormModalView
      title="New application version"
      dismissButton="CANCEL"
      confirmTestID="new-app-version-button"
      confirmButton="ADD NEW VERSION"
      onSubmitForm={onSetVersion}
      onRequestClose={props.onRequestClose}>
      <Container>
        <TextField
          autoFocus
          name="version"
          label="Version"
          testID="create-app-version-input"
          validation={validateVersion}
          defaultValue={semver.inc(props.currentVersion, 'minor')}
          required
        />
      </Container>
    </FormModalView>
  )
}
