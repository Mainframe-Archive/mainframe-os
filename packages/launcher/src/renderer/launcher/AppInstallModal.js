//@flow

import type { PermissionsGrants } from '@mainframe/app-permissions'
import fs from 'fs-extra'
import React, {
  createRef,
  Component,
  type Element,
  type ElementRef,
} from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Modal,
} from 'react-native-web'
import ReactModal from 'react-modal'
import type { ID } from '@mainframe/utils-id'

import { client } from '../electronIpc.js'
import Button from '../Button'
import PermissionsView, { type PermissionOptions } from './PermissionsView'
import IDSelectorView from './IDSelectorView'

type Props = {
  onRequestClose: () => void,
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
}

export default class AppInstallModal extends Component<Props, State> {
  state = {
    inputValue: '',
    installStep: 'manifest',
    manifest: null,
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

  onDownloadComplete = (path: string) => {
    this.setState({
      appPath: path,
      installStep: 'id',
    })
  }

  onSelectId = (id: ID) => {
    this.setState({ userId: id }, this.saveApp)
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
      console.log('res: ', res)
    } catch (err) {
      console.log('err:', err)
      // TODO: handle error
    }
  }

  // RENDER

  renderManifestImport() {
    return (
      <View style={styles.container}>
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
      <View style={styles.container}>
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
      <View style={styles.container}>
        <Text style={styles.header}>{`Downloading ${manifest.name}`}</Text>
        <Text>Downloading from swarm...</Text>
      </View>
    ) : null
  }

  renderSetId() {
    return (
      <View style={styles.container}>
        <IDSelectorView onSelectId={this.onSelectId} />
      </View>
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
      <ReactModal isOpen={true} onRequestClose={this.props.onRequestClose}>
        {this.renderContent()}
      </ReactModal>
    )
  }
}

const COLOR_WHITE = '#ffffff'
const COLOR_GREY = '#eeeeee'

const styles = StyleSheet.create({
  container: {
    maxWidth: 600,
    minWidth: 480,
    padding: 20,
    backgroundColor: COLOR_WHITE,
    flex: 1,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    paddingVertical: 15,
  },
})
