// @flow

import React, { Component, createRef } from 'react'
import { Text, Button, TextField } from '@morpheus-ui/core'
import {
  type FormSubmitPayload,
  type FieldValidateFunctionParams,
} from '@morpheus-ui/forms'
import styled from 'styled-components/native'
import { isValidSemver } from '@mainframe/app-manifest'
import semver from 'semver'

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
  previousVersion?: string,
  submitButtonTitle?: ?string,
}

type State = {
  inputValue?: ?string,
  contentsPath?: ?string,
}

const Container = styled.View`
  flex: 1;
  width: 500px;
  padding: 20px;
  justify-content: center;
`

const appNameValidaton = ({ value }: FieldValidateFunctionParams) => {
  if (
    !value ||
    typeof value !== 'string' ||
    value.length > 30 ||
    value.length < 3
  ) {
    return 'App name must be between 3 and 30 characters'
  }
}

export default class EditAppDetailsView extends Component<Props, State> {
  // $FlowFixMe: React Ref
  fileInput: ElementRef<'input'> = createRef()

  constructor(props: Props) {
    super(props)
    this.state = {
      contentsPath: props.appData.contentsPath,
    }
  }

  validateVersion = (params: FieldValidateFunctionParams) => {
    const { previousVersion } = this.props
    if (params.value && typeof params.value === 'string') {
      if (!isValidSemver(params.value)) {
        return 'Please provide a valid version number, e.g. 1.0.0'
      }
      if (
        previousVersion != null &&
        semver.lte(params.value, previousVersion)
      ) {
        return `Please provide a version higher than the previous one (${previousVersion})`
      }
    }
  }

  onSetAppData = (payload: FormSubmitPayload) => {
    if (payload.valid) {
      this.props.onSetAppData({
        ...payload.fields,
        contentsPath: this.state.contentsPath,
      })
    }
  }

  onPressSelectContentsFolder = () => {
    this.fileInput.current.webkitdirectory = true
    this.fileInput.current.click()
  }

  onFileInputChange = () => {
    const files = [...this.fileInput.current.files]
    if (files.length) {
      this.setState({
        contentsPath: files[0].path,
      })
    }
  }

  render() {
    return (
      <FormModalView
        title={this.props.isEdition ? 'App details' : 'Create an App'}
        dismissButton="CANCEL"
        confirmTestID="create-app-set-info-button"
        confirmButton={this.props.submitButtonTitle || 'CONTINUE'}
        onSubmitForm={this.onSetAppData}
        onRequestClose={this.props.onRequestClose}>
        <Container>
          <Text
            size={13}
            variant={['greyMed', 'center']}
            theme={{ marginBottom: '30px' }}>
            Set your app details.
          </Text>
          <TextField
            autoFocus
            name="name"
            label="App name"
            validation={appNameValidaton}
            testID="create-app-name-input"
            defaultValue={this.props.appData.name}
            required
          />
          <TextField
            name="version"
            label="Version"
            testID="create-app-version-input"
            validation={this.validateVersion}
            defaultValue={this.props.appData.version}
            required
          />
          <TextField
            name="contentsPath"
            label="Content Path"
            testID="create-app-version-input"
            disableEdit
            value={this.state.contentsPath}
            required
            IconRight={() => (
              <Button
                variant={['small', 'completeOnboarding']}
                title="BROWSE"
                onPress={this.onPressSelectContentsFolder}
              />
            )}
          />
          <input
            id="app-contents-file-selector"
            onChange={this.onFileInputChange}
            ref={this.fileInput}
            type="file"
            hidden
            value={this.state.inputValue}
          />
        </Container>
      </FormModalView>
    )
  }
}
