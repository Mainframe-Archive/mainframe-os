// @flow

import { Text } from '@morpheus-ui/core'
import React, { Component } from 'react'
import {
  graphql,
  commitMutation,
  createFragmentContainer,
  type Environment,
} from 'react-relay'

import type { WebDomainsDefinitions } from '../../../types'

import AppSummary, { type AppData } from './AppSummary'
import EditAppDetailsModal, {
  type CompleteAppData,
} from './EditAppDetailsModal'
import SetPermissionsRequirements from './SetPermissionsRequirements'

import type { CreateAppModal_developer as Developer } from './__generated__/CreateAppModal_developer.graphql'

const createAppMutation = graphql`
  mutation CreateAppModalMutation($input: CreateAppInput!) {
    createApp(input: $input) {
      app {
        id
        localID
        developer {
          ...DeveloperAppsScreen_developer
        }
        profile {
          name
        }
      }
    }
  }
`

type Props = {
  developer: Developer,
  onPressBack?: () => any,
  onRequestClose: () => void,
  onAppCreated: () => void,
  relay: {
    environment: Environment,
  },
}

type State = {
  screen: 'info' | 'permissions' | 'summary',
  webDomains: WebDomainsDefinitions,
  userId?: string,
  appData: AppData,
  errorMsg?: string,
}

class CreateAppModal extends Component<Props, State> {
  state = {
    screen: 'info',
    manifest: null,
    appData: {
      version: '1.0.0',
    },
    webDomains: [],
  }

  // HANDLERS

  onPressCreateApp = async () => {
    const { appData, webDomains } = this.state
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

    commitMutation(this.props.relay.environment, {
      mutation: createAppMutation,
      variables: {
        input: {
          ...appData,
          developerID: this.props.developer.localID,
          // $FlowFixMe: Relay type
          webDomains,
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
    this.setState({ appData, screen: 'permissions' })
  }

  onSetWebDomains = (webDomains: WebDomainsDefinitions) => {
    this.setState({ webDomains, screen: 'summary' })
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
      <SetPermissionsRequirements
        onSetWebDomains={this.onSetWebDomains}
        onPressBack={this.onBackPermissions}
        onRequestClose={this.props.onRequestClose}
        webDomains={this.state.webDomains}
      />
    )
  }

  renderSummary() {
    const { appData, webDomains } = this.state
    return (
      <AppSummary
        appData={appData}
        webDomains={webDomains}
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

export default createFragmentContainer(CreateAppModal, {
  developer: graphql`
    fragment CreateAppModal_developer on OwnDeveloper {
      localID
    }
  `,
})
