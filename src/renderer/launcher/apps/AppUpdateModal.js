//@flow

import { Text } from '@morpheus-ui/core'
import React, { Component } from 'react'
import {
  commitMutation,
  createFragmentContainer,
  graphql,
  type Environment,
} from 'react-relay'
import styled from 'styled-components/native'

import type { ReadOnlyWebDomainsDefinitions } from '../../../types'

import FormModalView from '../../UIComponents/FormModalView'
import Loader from '../../UIComponents/Loader'
import PermissionsView from '../PermissionsView'

import type { AppUpdateModal_userAppVersion as UserAppVersion } from './__generated__/AppUpdateModal_userAppVersion.graphql'

const updateMutation = graphql`
  mutation AppUpdateModalUpdateUserAppVersionMutation(
    $input: UpdateUserAppVersionMutationInput!
  ) {
    updateUserAppVersion(input: $input) {
      userAppVersion {
        ...AppUpdateModal_userAppVersion
      }
      viewer {
        ...AppsScreen_user
      }
    }
  }
`

type Props = {
  userAppVersion: UserAppVersion,
  onRequestClose: () => void,
  onUpdateComplete: () => void,
  relay: {
    environment: Environment,
  },
}

type State = {
  updateStep: 'confirm' | 'permissions' | 'download',
  webDomains?: ReadOnlyWebDomainsDefinitions,
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
  state = {
    updateStep: 'confirm',
    webDomains: undefined,
  }

  // HANDLERS

  onSubmitConfirm = () => {
    const { update } = this.props.userAppVersion
    if (update != null && update.permissionsChanged) {
      this.setState({ updateStep: 'permissions' })
    } else {
      this.setState({ updateStep: 'download' })
      this.updateApp()
    }
  }

  onSubmitPermissions = (webDomains: ReadOnlyWebDomainsDefinitions) => {
    this.setState({ updateStep: 'download', webDomains }, this.updateApp)
  }

  updateApp = async () => {
    const { relay, userAppVersion } = this.props
    const { webDomains } = this.state

    commitMutation(relay.environment, {
      mutation: updateMutation,
      variables: {
        input: {
          userAppVersionID: userAppVersion.localID,
          // $FlowFixMe: type definition difference between Relay-generated and library-defined
          webDomains: webDomains || userAppVersion.settings.webDomains,
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
    const { userAppVersion } = this.props
    if (userAppVersion.update == null) {
      return null
    }

    const { fromVersion, toVersion } = userAppVersion.update
    const appName = toVersion.manifest.profile.name || toVersion.publicID
    const errorMsg = this.state.errorMsg ? (
      <Text variant="error">{this.state.errorMsg}</Text>
    ) : null

    return (
      <FormModalView
        dismissButton="CANCEL"
        confirmButton="UPDATE"
        title={`Update ${appName}`}
        onRequestClose={this.props.onRequestClose}
        onSubmitForm={this.onSubmitConfirm}>
        <Container>
          <TextContainer>
            <Text variant={['modalText', 'center']}>
              Are you sure you want to update {appName} from version{' '}
              {fromVersion.manifest.version} to version{' '}
              {toVersion.manifest.version}?
            </Text>
          </TextContainer>
          {errorMsg}
        </Container>
      </FormModalView>
    )
  }

  renderPermissions() {
    const { userAppVersion } = this.props
    if (userAppVersion.update == null) {
      return null
    }

    const version = userAppVersion.update.toVersion
    return (
      <PermissionsView
        publicID={version.publicID}
        name={version.manifest.profile.name || version.publicID}
        webDomainsGrants={userAppVersion.settings.webDomains}
        // $FlowFixMe: type definition difference between Relay-generated and library-defined
        webDomainsRequirements={version.manifest.webDomains}
        onSubmit={this.onSubmitPermissions}
        onCancel={this.props.onRequestClose}
      />
    )
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
        webDomains {
          domain
          internal
          external
        }
      }
      update {
        fromVersion {
          manifest {
            profile {
              name
            }
            version
            webDomains {
              domain
              internal
              external
            }
          }
        }
        toVersion {
          publicID
          manifest {
            profile {
              name
            }
            version
            webDomains {
              domain
              internal
              external
            }
          }
        }
        permissionsChanged
      }
    }
  `,
})
