//@flow

import { type StrictPermissionsGrants } from '@mainframe/app-permissions'
import { Text } from '@morpheus-ui/core'
import React, { Component } from 'react'
import {
  commitMutation,
  createFragmentContainer,
  graphql,
  type Environment,
} from 'react-relay'
import styled from 'styled-components/native'

import { LauncherContext } from '../LauncherContext'
import FormModalView from '../../UIComponents/FormModalView'
import Loader from '../../UIComponents/Loader'
import PermissionsView from '../PermissionsView'

import type { AppUpdateModal_app as App } from './__generated__/AppUpdateModal_app.graphql'

const appUpdateMutation = graphql`
  mutation AppUpdateModalAppUpdateMutation($input: AppUpdateMutationInput!) {
    updateApp(input: $input) {
      viewer {
        id
        # apps {
        #   ...AppsView_apps
        # }
      }
    }
  }
`

type Props = {
  app: App,
  onRequestClose: () => void,
  onUpdateComplete: () => void,
  relay: {
    environment: Environment,
  },
}

type State = {
  updateStep: 'confirm' | 'permissions' | 'download',
  userPermissions: ?StrictPermissionsGrants,
  errorMsg?: string,
}

const Container = styled.View`
  flex: 1;
  width: 100%;
  max-width: 550px;
  padding: 20px;
  justify-content: center;
  overflow-y: auto;
`

const TextContainer = styled.View`
  padding: 20px;
`

class AppUpdateModal extends Component<Props, State> {
  static contextType = LauncherContext

  state = {
    updateStep: 'confirm',
    userPermissions: undefined,
  }

  // HANDLERS

  onSubmitConfirm = () => {
    const { update } = this.props.app
    if (update && update.permissionsChanged) {
      this.setState({ updateStep: 'permissions' })
    } else {
      this.setState({ updateStep: 'download' }, this.updateApp)
    }
  }

  onSubmitPermissions = (userPermissions: StrictPermissionsGrants) => {
    this.setState({ updateStep: 'download', userPermissions }, this.updateApp)
  }

  updateApp = async () => {
    const { userPermissions } = this.state
    const permissionsSettings = userPermissions
      ? { grants: userPermissions, permissionsChecked: true }
      : undefined

    commitMutation(this.props.relay.environment, {
      mutation: appUpdateMutation,
      variables: {
        input: {
          appID: this.props.app.localID,
          userID: this.context.user.localID,
          // $FlowFixMe: type definition difference between Relay-generated and library-defined
          permissionsSettings,
        },
      },
      onCompleted: (res, errors) => {
        if (errors && errors.length) {
          this.setState({
            errorMsg: `Error: ${errors[0].message}`,
            updateStep: 'confirm',
          })
        } else {
          this.props.onUpdateComplete()
        }
      },
      onError: err => {
        const msg =
          err.message || 'Sorry, there was a problem installing this app.'
        this.setState({
          errorMsg: msg,
          updateStep: 'confirm',
        })
      },
    })
  }

  // RENDER

  renderConfirm() {
    const { app } = this.props
    const errorMsg = this.state.errorMsg ? (
      <Text variant="error">{this.state.errorMsg}</Text>
    ) : null

    return app.update == null ? null : (
      <FormModalView
        dismissButton="CANCEL"
        confirmButton="UPDATE"
        title={`Update ${app.name}`}
        onRequestClose={this.props.onRequestClose}
        onSubmitForm={this.onSubmitConfirm}>
        <Container>
          <TextContainer>
            <Text variant={['modalText', 'center']}>
              Are you sure you want to update {app.name} from version{' '}
              {app.manifest.version} to version {app.update.manifest.version}?
            </Text>
          </TextContainer>
          {errorMsg}
        </Container>
      </FormModalView>
    )
  }

  renderPermissions() {
    // TODO: provide already defined permissions from current version
    const { app } = this.props

    return app.update ? (
      <PermissionsView
        mfid={app.mfid}
        name={app.name}
        // $FlowFixMe: type definition difference between Relay-generated and library-defined
        permissions={app.update.manifest.permissions}
        onSubmit={this.onSubmitPermissions}
        onCancel={this.props.onRequestClose}
      />
    ) : null
  }

  renderDownload() {
    return (
      <FormModalView title="Downloading app update">
        <Container>
          <TextContainer>
            <Text variant={['modalText', 'center']}>
              <Loader />
            </Text>
          </TextContainer>
        </Container>
      </FormModalView>
    )
  }

  render() {
    switch (this.state.updateStep) {
      case 'confirm':
        return this.renderConfirm()
      case 'permissions':
        return this.renderPermissions()
      case 'download':
        return this.renderDownload()
      default:
        return null
    }
  }
}

export default createFragmentContainer(AppUpdateModal, {
  userAppVersion: graphql`
    fragment AppUpdateModal_userAppVersion on UserAppVersion {
      localID
      settings {
        permissionsGrants {
          CONTACT_COMMUNICATION
          CONTACT_LIST
          ETHEREUM_TRANSACTION
          WEB_REQUEST {
            granted
            denied
          }
        }
      }
      update {
        fromVersion {
          manifest {
            permissions {
              optional {
                CONTACT_COMMUNICATION
                CONTACT_LIST
                ETHEREUM_TRANSACTION
                WEB_REQUEST
              }
              required {
                CONTACT_COMMUNICATION
                CONTACT_LIST
                ETHEREUM_TRANSACTION
                WEB_REQUEST
              }
            }
            profile {
              name
            }
            version
          }
        }
        toVersion {
          manifest {
            permissions {
              optional {
                CONTACT_COMMUNICATION
                CONTACT_LIST
                ETHEREUM_TRANSACTION
                WEB_REQUEST
              }
              required {
                CONTACT_COMMUNICATION
                CONTACT_LIST
                ETHEREUM_TRANSACTION
                WEB_REQUEST
              }
            }
            profile {
              name
            }
            version
          }
        }
        permissionsChanged
      }
    }
  `,
})
