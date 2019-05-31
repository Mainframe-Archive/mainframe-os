// @flow

import { Text } from '@morpheus-ui/core'

// TODO: use local type rather than library import
import type { StrictPermissionsRequirements } from '@mainframe/app-permissions'
import React, { Component } from 'react'
import { graphql, commitMutation } from 'react-relay'

import { EnvironmentContext } from '../RelayEnvironment'

import PermissionsRequirementsView from './PermissionsRequirements'
import AppSummary, { type AppData } from './AppSummary'
import EditAppDetailsModal, {
  type CompleteAppData,
} from './EditAppDetailsModal'

const createAppMutation = graphql`
  mutation CreateAppModalMutation($input: AppCreateMutationInput!) {
    createApp(input: $input) {
      app {
        id
        localID
        profile {
          name
        }
      }
      devtools {
        ...OwnAppsScreen_devtools
      }
    }
  }
`

type Props = {
  developerID: string,
  onPressBack?: () => any,
  onRequestClose: () => void,
  onAppCreated: () => void,
}

type State = {
  screen: 'info' | 'permissions' | 'summary',
  permissionsRequirements: StrictPermissionsRequirements,
  userId?: string,
  appData: AppData,
  errorMsg?: string,
}

export default class CreateAppModal extends Component<Props, State> {
  static contextType = EnvironmentContext

  state = {
    screen: 'info',
    manifest: null,
    appData: {
      version: '1.0.0',
    },
    permissionsRequirements: {
      optional: {
        WEB_REQUEST: [],
      },
      required: {
        WEB_REQUEST: [],
      },
    },
  }

  // HANDLERS

  onPressCreateApp = async () => {
    const { appData, permissionsRequirements } = this.state
    if (
      appData.name == null ||
      appData.version == null ||
      appData.contentsPath == null
    ) {
      this.setState({
        errorMsg: 'Unable to create app due to incomplete data.', // TODO: More specific error
      })
      return
    }

    commitMutation(this.context, {
      mutation: createAppMutation,
      variables: {
        input: {
          ...appData,
          developerID: this.props.developerID,
          // $FlowFixMe: Relay type
          permissionsRequirements,
        },
      },
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

  onSetAppData = (appData: CompleteAppData) => {
    this.setState({
      appData,
      screen: 'permissions',
    })
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
      <EditAppDetailsModal
        onRequestClose={this.props.onRequestClose}
        onSetAppData={this.onSetAppData}
        appData={this.state.appData}
      />
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

  renderError() {
    return this.state.errorMsg ? (
      <Text variant="error">{this.state.errorMsg}</Text>
    ) : null
  }

  render() {
    switch (this.state.screen) {
      case 'permissions':
        return this.renderPermissions()
      case 'summary':
        return this.renderSummary()
      case 'info':
      default:
        return this.renderInfoForm()
    }
  }
}
