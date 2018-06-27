//@flow

import type { PermissionsGrants } from '@mainframe/app-permissions'
import fs from 'fs-extra'
import React, { createRef, Component, type ElementRef } from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native-web'
import type { ID } from '@mainframe/utils-id'

import { client } from '../electronIpc.js'
import Button from '../Button'
import ModalView from '../ModalView'
import PermissionsView, { type PermissionOptions } from './PermissionsView'
import IdentitySelectorView from './IdentitySelectorView'
import colors from '../colors'

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
  installStep: 'manifest' | 'permissions' | 'download' | 'id',
  manifest: ?{
    name: string,
    permissions: PermissionOptions,
  },
  userPermissions?: PermissionsGrants,
  appPath?: string,
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
            installStep: 'permissions',
          })
        } else {
          console.log('invalid manifest')
        }
      } catch (err) {
        // TODO: Feedback error
        console.log('error parsing manifest: ', err)
      }
    }
  }

  onSubmitPermissions = (userPermissions: PermissionsGrants) => {
    this.setState({
      installStep: 'download',
      userPermissions,
    })
    // TODO Actually download from swarm
    setTimeout(this.onDownloadComplete, 1000, 'testPath')
  }

  async getOwnIdentities() {
    try {
      const res = await client.getOwnUserIdentities()
      this.setState({ ownUsers: res.users })
    } catch (err) {
      // TODO: Handle error
      console.warn(err)
    }
  }

  onDownloadComplete = async (path: string) => {
    await this.getOwnIdentities()
    this.setState({
      appPath: path,
      installStep: 'id',
    })
  }

  onSelectId = (id: ID) => {
    this.setState({ userId: id }, this.saveApp)
  }

  onCreatedId = (id: ID) => {
    this.getOwnIdentities()
  }

  saveApp = async () => {
    // $FlowFixMe: userPermissions key in state
    const { manifest, userPermissions, userId } = this.state
    if (manifest == null || userPermissions == null || userId == null) {
      console.log('invalid manifest or permissions to save app')
      // TODO: Display error
      return
    }

    try {
      const res = await client.installApp(manifest, userId, userPermissions)
      this.props.onInstallComplete(res.id)
    } catch (err) {
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
          onChange={this.onFileInputChange}
          ref={this.fileInput}
          type="file"
          hidden
          value={this.state.inputValue}
        />
      </View>
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

  renderSetId() {
    return (
      <IdentitySelectorView
        enableCreate
        onSelectId={this.onSelectId}
        users={this.state.ownUsers}
        onCreatedId={this.onCreatedId}
      />
    )
  }

  renderContent() {
    switch (this.state.installStep) {
      case 'manifest':
        return this.renderManifestImport()
      case 'permissions':
        return this.renderPermissions()
      case 'download':
        return this.renderDownload()
      case 'id':
        return this.renderSetId()
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
