//@flow

import type { StrictPermissionsRequirements } from '@mainframe/app-permissions'
import type { AppCreateParams, IdentityOwnData } from '@mainframe/client'
import { isValidSemver } from '@mainframe/app-manifest'
import React, { createRef, Component, type ElementRef } from 'react'
import { graphql, QueryRenderer, commitMutation } from 'react-relay'

import { Button, TextField, Text } from '@morpheus-ui/core'
import {
  type FormSubmitPayload,
  type FieldValidateFunctionParams,
} from '@morpheus-ui/forms'
import styled from 'styled-components/native'

import RelayLoaderView from '../RelayLoaderView'
import FormModalView from '../../UIComponents/FormModalView'
import { EnvironmentContext } from '../RelayEnvironment'
import { appCreateMutation } from '../apps/appMutations'
import PermissionsRequirementsView from './PermissionsRequirements'
import AppSummary from './AppSumary'

type RendererProps = {
  onPressBack?: () => any,
  onRequestClose: () => void,
  onAppCreated: () => void,
}

type Props = RendererProps & {
  ownDevelopers: Array<IdentityOwnData>,
}

export type AppData = {
  name?: string,
  version?: string,
  contentsPath?: string,
  developerID?: string,
}

type State = {
  inputValue: string,
  screen: 'info' | 'permissions' | 'summary',
  permissionsRequirements: StrictPermissionsRequirements,
  userId?: string,
  appData: AppData,
  errorMsg?: string,
}

const Container = styled.View`
  flex: 1;
  width: 500px;
  padding: 20px;
  justify-content: center;
`

const validateVersion = (params: FieldValidateFunctionParams) => {
  if (
    params.value &&
    typeof params.value === 'string' &&
    !isValidSemver(params.value)
  ) {
    return 'Please provide a valid verison number, e.g. 1.0.0'
  }
}

class CreateAppModal extends Component<Props, State> {
  static contextType = EnvironmentContext

  state = {
    inputValue: '',
    screen: 'info',
    manifest: null,
    appData: {},
    permissionsRequirements: {
      optional: {
        WEB_REQUEST: [],
      },
      required: {
        WEB_REQUEST: [],
      },
    },
  }

  // $FlowFixMe: React Ref
  fileInput: ElementRef<'input'> = createRef()

  // HANDLERS

  onSelectId = (id: string) => {
    this.setState(({ appData }) => ({
      screen: 'permissions',
      appData: {
        ...appData,
        developerID: id,
      },
    }))
  }

  getCreateParams = (
    appData: AppData,
    permissions: StrictPermissionsRequirements,
  ): ?AppCreateParams => {
    if (
      appData.name &&
      appData.version &&
      appData.contentsPath &&
      appData.developerID
    ) {
      return {
        ...appData,
        permissionsRequirements: permissions,
      }
    }
  }

  onPressCreateApp = async () => {
    const { appData, permissionsRequirements } = this.state

    const params = this.getCreateParams(appData, permissionsRequirements)
    if (!params) {
      this.setState({
        errorMsg: 'Unable to create app due to incomplete data.', // TODO: More specific error
      })
      return
    }

    commitMutation(this.context, {
      mutation: appCreateMutation,
      // $FlowFixMe: Relay type
      variables: { input: params },
      onCompleted: () => {
        this.props.onAppCreated()
      },
      onError: err => {
        const msg =
          err.message || 'Sorry, there was a problem creating your app.'
        this.setState({
          errorMsg: msg,
        })
      },
    })
  }

  onPressSelectContentsFolder = () => {
    this.fileInput.current.webkitdirectory = true
    this.fileInput.current.click()
  }

  onChangeName = (value: string) => {
    this.setState(({ appData }) => ({
      appData: {
        ...appData,
        name: value,
      },
    }))
  }

  onChangeVersion = (value: string) => {
    this.setState(({ appData }) => ({
      appData: {
        ...appData,
        version: value,
      },
    }))
  }

  onChangeContentsPath = (value: string) => {
    this.setState(({ appData }) => ({
      appData: {
        ...appData,
        contentsPath: value,
      },
    }))
  }

  onFileInputChange = () => {
    const files = [...this.fileInput.current.files]
    if (files.length) {
      this.setState(({ appData }) => ({
        appData: {
          ...appData,
          contentsPath: files[0].path,
        },
      }))
    }
  }

  onSetAppData = (payload: FormSubmitPayload) => {
    const { ownDevelopers } = this.props

    if (payload.valid && ownDevelopers.length) {
      this.setState({
        appData: {
          ...payload.fields,
          developerID: ownDevelopers[0].localID,
        },
        screen: 'permissions',
      })
    }
  }

  onSetPermissions = (
    permissionsRequirements: StrictPermissionsRequirements,
  ) => {
    this.setState({
      permissionsRequirements,
      screen: 'summary',
    })
  }

  onBackSummary = () => {
    this.setState({ screen: 'permissions' })
  }

  onBackPermissions = () => {
    this.setState({ screen: 'info' })
  }

  // RENDER
  renderInfoForm() {
    return (
      <FormModalView
        title="Create an App"
        dismissButton="CANCEL"
        confirmTestID="create-app-set-info-button"
        confirmButton="CONTINUE"
        onSubmitForm={this.onSetAppData}
        onRequestClose={this.props.onRequestClose}>
        <Container>
          <Text
            size={12}
            variant={['greyMed', 'center']}
            theme={{ marginBottom: '30px' }}>
            Set your app details.
          </Text>
          <TextField
            autoFocus
            name="name"
            label="App name"
            testID="create-app-name-input"
            defaultValue={this.state.appData.name}
            required
          />
          <TextField
            name="version"
            label="Version"
            testID="create-app-version-input"
            validation={validateVersion}
            defaultValue={this.state.appData.version}
            required
          />
          <TextField
            name="contentsPath"
            label="Content Path"
            testID="create-app-version-input"
            disableEdit
            value={this.state.appData.contentsPath}
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

  renderPermissions() {
    return (
      <PermissionsRequirementsView
        onSetPermissions={this.onSetPermissions}
        onPressBack={this.onBackPermissions}
        onRequestClose={this.props.onRequestClose}
      />
    )
  }

  renderSummary() {
    const { appData, permissionsRequirements } = this.state
    return (
      <AppSummary
        appData={appData}
        permissionsRequirements={permissionsRequirements}
        onPressBack={this.onBackSummary}
        onRequestClose={this.props.onRequestClose}
        onPressSave={this.onPressCreateApp}
      />
    )
  }

  renderContent() {
    switch (this.state.screen) {
      case 'info':
        return this.renderInfoForm()
      case 'permissions':
        return this.renderPermissions()
      case 'summary':
        return this.renderSummary()
      default:
        return null
    }
  }

  renderError() {
    return this.state.errorMsg ? (
      <Text variant="error">{this.state.errorMsg}</Text>
    ) : null
  }

  render() {
    return this.renderContent()
  }
}

export default class CreateAppModalRenderer extends Component<RendererProps> {
  static contextType = EnvironmentContext

  render() {
    return (
      <QueryRenderer
        environment={this.context}
        query={graphql`
          query CreateAppModalQuery {
            viewer {
              identities {
                ownDevelopers {
                  localID
                }
              }
            }
          }
        `}
        variables={{}}
        render={({ error, props }) => {
          if (error || !props) {
            return <RelayLoaderView error={error ? error.message : undefined} />
          } else {
            return (
              <CreateAppModal {...props.viewer.identities} {...this.props} />
            )
          }
        }}
      />
    )
  }
}
