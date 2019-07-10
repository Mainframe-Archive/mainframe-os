// @flow

import type { IdentityOwnData } from '@mainframe/client'
import type { ManifestData } from '@mainframe/app-manifest'
import React, { Component } from 'react'
import { Text, TextField } from '@morpheus-ui/core'
import { type FormSubmitPayload } from '@morpheus-ui/forms'
import { commitMutation, graphql } from 'react-relay'
import { fetchQuery } from 'relay-runtime'
import styled from 'styled-components/native'

import { EnvironmentContext } from '../RelayEnvironment'

import FormModalView from '../../UIComponents/FormModalView'
import Loader from '../../UIComponents/Loader'
import PermissionsView from '../PermissionsView'
import { appInstallMutation } from './appMutations'

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

const appLookupQuery = graphql`
  query AppInstallModalLookupAppQuery($publicID: ID!) {
    lookup {
      appByID(publicID: $publicID) {
        app {
          latestAvailableVersion {
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
        }
        userAppVersion {
          localID
        }
      }
    }
  }
`

type Props = {
  appID?: ?string,
  onRequestClose: () => void,
  onInstallComplete: () => void,
  getIcon?: (id?: ?string) => ?string,
}

type State = {
  installStep: 'manifest' | 'permissions' | 'download',
  manifest: ?ManifestData,
  errorMsg?: string,
}

export default class AppInstallModal extends Component<Props, State> {
  static contextType = EnvironmentContext

  state = {
    installStep: 'manifest',
    manifest: null,
  }

  componentDidMount() {
    if (this.props.appID != null) {
      this.loadApp(this.props.appID)
    }
  }

  // HANDLERS

  async loadApp(publicID: string) {
    try {
      this.setState({ installStep: 'download' })

      const res = await fetchQuery(this.context, appLookupQuery, { publicID })
      if (res.lookup.appByID == null) {
        this.setState({
          errorMsg: 'Application not found',
          installStep: 'manifest',
        })
        return
      }

      if (res.lookup.appByID.userAppVersion != null) {
        // User already has this app installed
        // TODO: open app details screen
        this.props.onInstallComplete()
        return
      }

      // TODO: this screen should not only display permissions but also developer and app description
      // before the user confirms installation (= create userAppVersion and background download the app contents)
      // this.setState({
      //   installStep: 'permissions',
      //   manifest: res.lookup.appByID.app.latestAvailableVersion.manifest,
      // })

      console.log('lookup app res', res)
      this.props.onRequestClose()
    } catch (err) {
      this.setState({
        errorMsg: err.message,
        installStep: 'manifest',
      })
    }
  }

  onSubmitAppID = async (payload: FormSubmitPayload) => {
    if (payload.valid) {
      await this.loadApp(payload.fields.appid)
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
    const errorMsg = this.state.errorMsg ? (
      <Text variant="error">{this.state.errorMsg}</Text>
    ) : null
    return (
      <FormModalView
        dismissButton="CANCEL"
        confirmButton="OK"
        title="Install an app"
        onRequestClose={this.props.onRequestClose}
        onSubmitForm={this.onSubmitAppID}>
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
    if (!manifest) return null

    const icon = this.props.getIcon ? this.props.getIcon(manifest.id) : null
    return (
      <PermissionsView
        mfid={manifest.id}
        icon={icon}
        name={manifest.name}
        permissions={manifest.permissions}
        onSubmit={this.onSubmitPermissions}
        onCancel={this.props.onRequestClose}
      />
    )
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
