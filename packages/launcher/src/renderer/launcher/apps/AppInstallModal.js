// @flow

import React, { Component } from 'react'
import { Text, TextField } from '@morpheus-ui/core'
import { type FormSubmitPayload } from '@morpheus-ui/forms'
import { commitMutation, graphql } from 'react-relay'
import { fetchQuery } from 'relay-runtime'
import styled from 'styled-components/native'

import type { ReadOnlyWebDomainsDefinitions } from '../../../types'

import { EnvironmentContext } from '../RelayEnvironment'

import FormModalView from '../../UIComponents/FormModalView'
import Loader from '../../UIComponents/Loader'
import PermissionsView from '../PermissionsView'

import type { AppInstallModalLookupAppQueryResponse } from './__generated__/AppInstallModalLookupAppQuery.graphql'
type LookupQuery = $PropertyType<
  AppInstallModalLookupAppQueryResponse,
  'lookup',
>
type AppByID = $PropertyType<LookupQuery, 'appByID'>
type AppResult = $PropertyType<AppByID, 'app'>
type AppVersion = $PropertyType<AppResult, 'latestAvailableVersion'>

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

const appInstallMutation = graphql`
  mutation AppInstallModalInstallUserAppVersionMutation(
    $input: InstallUserAppVersionMutationInput!
  ) {
    installUserAppVersion(input: $input) {
      viewer {
        ...AppsScreen_user
      }
    }
  }
`

const appLookupQuery = graphql`
  query AppInstallModalLookupAppQuery($publicID: ID!) {
    lookup {
      appByID(publicID: $publicID) {
        app {
          latestAvailableVersion {
            localID
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
        }
        userAppVersion {
          localID
        }
      }
    }
  }
`

type Props = {
  publicID?: ?string,
  onRequestClose: () => void,
  onInstallComplete: () => void,
  getIcon?: (id?: ?string) => ?string,
}

type State = {
  installStep: 'manifest' | 'permissions' | 'download' | 'error',
  appVersion: ?AppVersion,
  errorMsg?: string,
}

export default class AppInstallModal extends Component<Props, State> {
  static contextType = EnvironmentContext

  state = {
    installStep: 'manifest',
    appVersion: null,
  }

  componentDidMount() {
    if (this.props.publicID != null) {
      this.loadApp(this.props.publicID)
    }
  }

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
        this.props.onInstallComplete()
        return
      }

      this.setState({
        installStep: 'permissions',
        appVersion: res.lookup.appByID.app.latestAvailableVersion,
      })
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

  onSubmitWebDomains = (webDomains: ReadOnlyWebDomainsDefinitions) => {
    const { appVersion } = this.state
    if (appVersion == null) {
      this.setState({
        installStep: 'error',
        errorMsg: 'Missing appVersion data to install app',
      })
      return
    }

    this.setState({ installStep: 'download' })

    commitMutation(this.context, {
      mutation: appInstallMutation,
      variables: {
        input: {
          appVersionID: appVersion.localID,
          // $FlowFixMe: types mismatch
          webDomains,
        },
      },
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
    const { appVersion } = this.state
    if (!appVersion) return null

    const icon = this.props.getIcon
      ? this.props.getIcon(appVersion.publicID)
      : null
    return (
      <PermissionsView
        publicID={appVersion.publicID}
        icon={icon}
        name={appVersion.manifest.profile.name || appVersion.publicID}
        webDomainsRequirements={appVersion.manifest.webDomains}
        onSubmit={this.onSubmitWebDomains}
        onCancel={this.props.onRequestClose}
      />
    )
  }

  renderDownload() {
    const { appVersion } = this.state
    const appName = appVersion
      ? appVersion.manifest.profile.name || appVersion.publicID
      : 'app manifest'

    return (
      <FormModalView title={`Downloading ${appName}`}>
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

  renderError() {
    // TODO: retry button and/or return to default state
    return (
      <Container>
        <TextContainer>
          <Text variant={['modalText', 'center']}>
            {this.state.errorMsg || 'Failed to install app'}
          </Text>
        </TextContainer>
      </Container>
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
      case 'error':
        return this.renderError()
      default:
        return null
    }
  }
}
