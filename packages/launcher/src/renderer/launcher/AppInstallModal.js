//@flow

import type { PermissionsGrants } from '@mainframe/app-permissions'
import type { ID } from '@mainframe/utils-id'
import fs from 'fs-extra'
import React, { createRef, Component, type ElementRef } from 'react'
import { View, StyleSheet } from 'react-native-web'

import { client } from '../electronIpc.js'
import Button from '../UIComponents/Button'
import Text from '../UIComponents/Text'
import ModalView from '../UIComponents/ModalView'
import PermissionsView, { type PermissionOptions } from './PermissionsView'
import IdentitySelectorView from './IdentitySelectorView'

type Props = {
  onRequestClose: () => void,
  onInstallComplete: (appID: ID) => void,
}

type User = {
  id: ID,
  data: {
    name: string,
  },
}
type State = {
  inputValue: string,
  installStep: 'manifest' | 'identity' | 'permissions' | 'download',
  manifest: ?{
    name: string,
    permissions: PermissionOptions,
  },
  userPermissions?: PermissionsGrants,
  userId?: ID,
  ownUsers: Array<User>,
}

export default class AppInstallModal extends Component<Props, State> {
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

  handleSelectedFiles = (files: Array<Object>) => {
    if (files.length) {
      const file = files[0]
      try {
        const manifest = fs.readJsonSync(file.path)
        if (
          typeof manifest.name === 'string' &&
          typeof manifest.permissions === 'object'
        ) {
          this.setState({
            manifest,
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

  onSubmitPermissions = (userPermissions: PermissionsGrants) => {
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
      const res = await client.getOwnUserIdentities()
      this.setState({ ownUsers: res.users })
    } catch (err) {
      // TODO: Handle error
      // eslint-disable-next-line no-console
      console.warn(err)
    }
  }

  onSelectId = (id: ID) => {
    this.setState({ installStep: 'permissions', userId: id })
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

    try {
      const permissions = {
        permissions: userPermissions,
        permissionsChecked: true,
      }
      const res = await client.installApp(manifest, userId, permissions)
      this.props.onInstallComplete(res.id)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('err:', err)
      // TODO: handle error
    }
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
        enableCreate
        onSelectId={this.onSelectId}
        users={this.state.ownUsers}
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
