//@flow

import {
  havePermissionsToGrant,
  type StrictPermissionsGrants,
  createStrictPermissionGrants,
} from '@mainframe/app-permissions'
import type { ID, IdentityOwnData } from '@mainframe/client'
import type { ManifestData } from '@mainframe/app-manifest'
import React, { createRef, Component, type ElementRef } from 'react'
import { View, StyleSheet } from 'react-native-web'
import { commitMutation } from 'react-relay'
import { EnvironmentContext } from '../RelayEnvironment'

import Button from '../../UIComponents/Button'
import Text from '../../UIComponents/Text'
import ModalView from '../../UIComponents/ModalView'
import rpc from '../rpc'
import PermissionsView from '../PermissionsView'
import IdentitySelectorView from '../IdentitySelectorView'
import { appInstallMutation } from './appMutations'

type Props = {
  onRequestClose: () => void,
  onInstallComplete: () => void,
}

type State = {
  inputValue: string,
  installStep: 'manifest' | 'identity' | 'permissions' | 'download',
  manifest: ?ManifestData,
  userPermissions?: StrictPermissionsGrants,
  userId?: ID,
  ownUsers: Array<IdentityOwnData>,
  errorMsg?: string,
}

export default class AppInstallModal extends Component<Props, State> {
  static contextType = EnvironmentContext

  state = {
    inputValue: '',
    installStep: 'manifest',
    manifest: null,
    ownUsers: [],
  }

  // $FlowFixMe: React Ref
  fileInput: ElementRef<'input'> = createRef()

  componentDidMount() {
    this.getOwnIdentities()
  }

  // HANDLERS

  onPressImportManifest = () => {
    this.fileInput.current.click()
  }

  onFileInputChange = () => {
    this.handleSelectedFiles([...this.fileInput.current.files])
  }

  handleSelectedFiles = async (files: Array<Object>) => {
    if (files.length) {
      try {
        const manifest = await rpc.readManifest(files[0].path)
        if (
          typeof manifest.data.name === 'string' &&
          typeof manifest.data.permissions === 'object'
        ) {
          this.setState({
            manifest: manifest.data,
            installStep: 'identity',
          })
        } else {
          // eslint-disable-next-line no-console
          console.log('invalid manifest')
        }
      } catch (err) {
        // TODO: Feedback error
        // eslint-disable-next-line no-console
        console.log('error parsing manifest: ', err)
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

  async getOwnIdentities() {
    try {
      const res = await rpc.getOwnUserIdentities()
      this.setState({ ownUsers: res.users })
    } catch (err) {
      // TODO: Handle error
      // eslint-disable-next-line no-console
      console.warn(err)
    }
  }

  onSelectId = (id: ID) => {
    const { manifest } = this.state
    if (
      manifest &&
      manifest.permissions &&
      havePermissionsToGrant(manifest.permissions)
    ) {
      this.setState({
        installStep: 'permissions',
        userId: id,
      })
    } else {
      this.setState({ userId: id })
      const strictGrants = createStrictPermissionGrants({})
      this.onSubmitPermissions(strictGrants)
    }
  }

  onCreatedId = () => {
    this.getOwnIdentities()
  }

  saveApp = async () => {
    // $FlowFixMe: userPermissions key in state
    const { manifest, userPermissions, userId } = this.state
    if (manifest == null || userPermissions == null || userId == null) {
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
      userID: userId,
      manifest,
      permissionsSettings,
    }

    commitMutation(this.context, {
      mutation: appInstallMutation,
      variables: { input: params },
      onCompleted: () => {
        this.props.onInstallComplete()
      },
      onError: err => {
        // eslint-disable-next-line no-console
        console.log('err:', err)
        const msg =
          err.data && err.data.length
            ? err.data[0].message
            : 'Sorry, there was a problem creating your app.'
        this.setState({
          errorMsg: msg,
        })
      },
    })
  }

  // RENDER

  renderManifestImport() {
    return (
      <View>
        <Text style={styles.header}>Install New App</Text>
        <Text style={styles.description}>Import an app manifest file</Text>
        <Button
          title="Import App Manifest"
          onPress={this.onPressImportManifest}
        />
        <input
          multiple
          id="installer-file-selector"
          onChange={this.onFileInputChange}
          ref={this.fileInput}
          type="file"
          hidden
          value={this.state.inputValue}
        />
      </View>
    )
  }

  renderSetIdentity() {
    return (
      <IdentitySelectorView
        type="user"
        enableCreate
        onSelectId={this.onSelectId}
        onCreatedId={this.onCreatedId}
      />
    )
  }

  renderPermissions() {
    const { manifest } = this.state

    return manifest ? (
      <View>
        <Text style={styles.header}>{`Manage permissions for ${
          manifest.name
        }`}</Text>
        <PermissionsView
          permissions={manifest.permissions}
          onSubmit={this.onSubmitPermissions}
        />
      </View>
    ) : null
  }

  renderDownload() {
    const { manifest } = this.state

    return manifest ? (
      <View>
        <Text style={styles.header}>{`Downloading ${manifest.name}`}</Text>
        <Text>Downloading from swarm...</Text>
      </View>
    ) : null
  }

  renderContent() {
    switch (this.state.installStep) {
      case 'manifest':
        return this.renderManifestImport()
      case 'identity':
        return this.renderSetIdentity()
      case 'permissions':
        return this.renderPermissions()
      case 'download':
        return this.renderDownload()
      default:
        return null
    }
  }

  render() {
    return (
      <ModalView isOpen={true} onRequestClose={this.props.onRequestClose}>
        {this.renderContent()}
      </ModalView>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    paddingVertical: 15,
  },
})
