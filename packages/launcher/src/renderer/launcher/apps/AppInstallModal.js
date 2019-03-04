//@flow

import {
  havePermissionsToGrant,
  type StrictPermissionsGrants,
  createStrictPermissionGrants,
} from '@mainframe/app-permissions'
import type { IdentityOwnData } from '@mainframe/client'
import type { ManifestData } from '@mainframe/app-manifest'
import React, { Component } from 'react'
import { Text, TextField } from '@morpheus-ui/core'
import { type FormSubmitPayload } from '@morpheus-ui/forms'
import { commitMutation } from 'react-relay'
import styled from 'styled-components/native'

import { EnvironmentContext } from '../RelayEnvironment'

import applyContext, { type CurrentUser } from '../LauncherContext'
import FormModalView from '../../UIComponents/FormModalView'
import Loader from '../../UIComponents/Loader'
import rpc from '../rpc'
import PermissionsView from '../PermissionsView'
import { appInstallMutation } from './appMutations'

type Props = {
  onRequestClose: () => void,
  onInstallComplete: () => void,
}

type ViewProps = Props & {
  user: CurrentUser,
}

type State = {
  installStep: 'manifest' | 'permissions' | 'download',
  manifest: ?ManifestData,
  userPermissions?: StrictPermissionsGrants,
  ownUsers: Array<IdentityOwnData>,
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

const View = styled.View``

class AppInstallModal extends Component<ViewProps, State> {
  static contextType = EnvironmentContext

  state = {
    installStep: 'manifest',
    manifest: null,
    ownUsers: [],
  }

  // HANDLERS

  onSubmitManifest = async (payload: FormSubmitPayload) => {
    if (payload.valid) {
      try {
        this.setState({ installStep: 'download' })

        const { manifest, appID, isOwn } = await rpc.loadManifest(
          payload.fields.appid,
        )
        // If appID is returned it means the app is already installed.
        // If we only support a single user in the launcher, the app must have been already installed by this user.
        if (appID != null) {
          if (isOwn) {
            return this.setState({
              installStep: 'manifest',
              errorMsg: `We currently don't support installing your own apps, they should be accessed from the developer section.`,
            })
          } else {
            return this.props.onInstallComplete()
          }
        }

        if (havePermissionsToGrant(manifest.permissions)) {
          this.setState({ installStep: 'permissions', manifest })
        } else {
          this.setState(
            {
              installStep: 'download',
              manifest,
              userPermissions: createStrictPermissionGrants({}),
            },
            this.saveApp,
          )
        }
      } catch (err) {
        this.setState({
          errorMsg: err.message,
          installStep: 'manifest',
        })
        // eslint-disable-next-line no-console
        console.log('error loading manifest:', err)
      }
    }
  }

  onSubmitPermissions = (userPermissions: StrictPermissionsGrants) => {
    this.setState(
      {
        installStep: 'download',
        userPermissions,
      },
      this.saveApp,
    )
  }

  saveApp = async () => {
    // $FlowFixMe: userPermissions key in state
    const { manifest, userPermissions } = this.state
    if (manifest == null || userPermissions == null) {
      // eslint-disable-next-line no-console
      console.log('invalid manifest or permissions to save app')
      // TODO: Display error
      return
    }

    const permissionsSettings = {
      grants: userPermissions,
      permissionsChecked: true,
    }

    const params = {
      userID: this.props.user.localID,
      manifest,
      permissionsSettings,
    }

    // $FlowFixMe: Permission types
    commitMutation(this.context, {
      mutation: appInstallMutation,
      variables: { input: params },
      onCompleted: (res, errors) => {
        if (errors && errors.length) {
          this.setState({
            errorMsg: `Error: ${errors[0].message}`,
            installStep: 'manifest',
          })
        } else {
          this.props.onInstallComplete()
        }
      },
      onError: err => {
        const msg =
          err.message || 'Sorry, there was a problem installing this app.'
        this.setState({
          errorMsg: msg,
          installStep: 'manifest',
        })
      },
    })
  }

  // RENDER

  renderManifestImport() {
    const errorMsg = this.state.errorMsg && (
      <Text variant="error">{this.state.errorMsg}</Text>
    )
    return (
      <FormModalView
        dismissButton="CANCEL"
        confirmButton="OK"
        title="Install an app"
        onRequestClose={this.props.onRequestClose}
        onSubmitForm={this.onSubmitManifest}>
        <Container>
          <TextContainer>
            <Text variant={['modalText', 'center']}>
              Enter an App ID below to begin the install process.
            </Text>
          </TextContainer>
          <View>
            <TextField name="appid" required label="Mainframe App ID" />
          </View>
          {errorMsg}
        </Container>
      </FormModalView>
    )
  }

  renderPermissions() {
    const { manifest } = this.state

    return manifest ? (
      <PermissionsView
        name={manifest.name}
        permissions={manifest.permissions}
        onSubmit={this.onSubmitPermissions}
        onCancel={this.props.onRequestClose}
      />
    ) : null
  }

  renderDownload() {
    const { manifest } = this.state

    return (
      <FormModalView
        title={`Downloading ${manifest ? manifest.name : 'App Manifest'}`}>
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
    switch (this.state.installStep) {
      case 'manifest':
        return this.renderManifestImport()
      case 'permissions':
        return this.renderPermissions()
      case 'download':
        return this.renderDownload()
      default:
        return null
    }
  }
}

export default applyContext(AppInstallModal)
