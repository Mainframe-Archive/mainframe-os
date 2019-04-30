//@flow

import type { StrictPermissionsRequirements } from '@mainframe/app-permissions'
import type { AppCreateParams, IdentityOwnData } from '@mainframe/client'
import React, { Component } from 'react'
import { graphql, QueryRenderer, commitMutation } from 'react-relay'
import { Text } from '@morpheus-ui/core'

import RelayLoaderView from '../RelayLoaderView'
import { EnvironmentContext } from '../RelayEnvironment'
import { appCreateMutation } from '../apps/appMutations'
import PermissionsRequirementsView from './PermissionsRequirements'
import AppSummary, { type AppData } from './AppSummary'
import EditAppDetailsModal, {
  type CompleteAppData,
} from './EditAppDetailsModal'

type RendererProps = {
  onPressBack?: () => any,
  onRequestClose: () => void,
  onAppCreated: () => void,
}

type Props = RendererProps & {
  ownDevelopers: Array<IdentityOwnData>,
}

type State = {
  screen: 'info' | 'permissions' | 'summary',
  permissionsRequirements: StrictPermissionsRequirements,
  userId?: string,
  appData: AppData,
  errorMsg?: string,
}

class CreateAppModal extends Component<Props, State> {
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
      // $FlowFixMe: null checks
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

  onSetAppData = (appData: CompleteAppData) => {
    const { ownDevelopers } = this.props

    this.setState({
      appData: {
        ...appData,
        developerID: ownDevelopers[0].localID,
      },
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

export default class CreateAppModalRenderer extends Component<RendererProps> {
  static contextType = EnvironmentContext

  render() {
    return (
      <QueryRenderer
        environment={this.context}
        query={graphql`
          query CreateAppModalQuery {
            viewer {
              id
              # identities {
              #   ownDevelopers {
              #     localID
              #   }
              # }
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
