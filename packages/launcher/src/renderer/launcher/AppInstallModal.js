//@flow

import React, { Component, type Element } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Modal,
} from 'react-native-web'
import fs from 'fs-extra'
import ReactModal from 'react-modal'
import Button from '../Button'

type Props = {
  onRequestClose: () => void,
}

type State = {
  inputValue?: string,
  installStep: 'manifest' | 'permissions' | 'download',
}

export default class AppInstallModal extends Component<Props, State> {
  state: State = {
    installStep: 'manifest',
  }
  fileInput: ?Element<'input'>

  // HANDLERS

  onPressImportManifest = () => {
    this.fileInput.click()
  }

  bindFileInput = (e: Element<'input'>) => {
    this.fileInput = e
  }

  onFileInputChange = () => {
    const files = [...this.fileInput.files]
    this.handleSelectedFiles(files)
  }

  handleSelectedFiles = (files: Array<Object>) => {
    if (files.length) {
      const file = files[0]
      try {
        const manifest = fs.readJsonSync(file.path)
        console.log('manifest: ', manifest)
      } catch (err) {
        // TODO: Feedback error
        console.log('error parsing manifest: ', err)
      }
    }
  }

  // RENDER

  renderManifestImport() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Install Mainframe App</Text>
        <Text style={styles.description}>Import an app manifest file</Text>
        <Button
          title="Import App Manifest"
          onPress={this.onPressImportManifest}
        />
        <input
          multiple
          onChange={this.onFileInputChange}
          ref={this.bindFileInput}
          type="file"
          hidden
          value={this.state.inputValue}
        />
      </View>
    )
  }

  renderPermissions() {
    return undefined
  }

  renderDownload() {
    return undefined
  }

  renderContent() {
    switch (this.state.installStep) {
      case 'manifest':
        return this.renderManifestImport()
      case 'permissions':
        return this.renderPermissions()
      case 'download':
        return this.renderDownload()
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

const styles = StyleSheet.create({
  container: {
    maxWidth: 600,
    minWidth: 480,
    padding: 20,
    backgroundColor: '#ffffff',
    flex: 1,
  },
  header: {
    fontSize: 20,
  },
  description: {
    paddingVertical: 15,
  },
})
