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

import { callMainClient } from '../electronIpc.js'
import Button from '../Button'
import PermissionsView, {
  type PermissionOptions,
  type AppPermissions,
} from './PermissionsView'

type Props = {
  onRequestClose: () => void,
}

type State = {
  inputValue?: string,
  manifest?: {
    permissions: PermissionOptions,
    name: string,
  },
  installStep: 'manifest' | 'permissions' | 'download' | 'id',
  appPermissions?: AppPermissions,
  appPath?: string,
  userId?: string,
}

export default class AppInstallModal extends Component<Props, State> {
  state = {
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
        this.setState({
          manifest,
          installStep: 'permissions',
        })
        console.log('manifest: ', manifest)
      } catch (err) {
        // TODO: Feedback error
        console.log('error parsing manifest: ', err)
      }
    }
  }

  onSubmitPermissions = (permissions: AppPermissions) => {
    console.log('do something with permissions', permissions)
    this.setState({
      appPermissions: permissions,
      installStep: 'download',
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

  onSelectId = (id: string) => {
    this.setState({
      userId: id,
    })
    this.saveApp()
  }

  createNewId = () => {}

  saveApp = async () => {
    const app = {
      name: this.state.manifest.name,
      permissions: this.state.appPermissions,
    }
    console.log('saving app: ', app)
    try {
      const res = await callMainClient.createApp(app)
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
          ref={this.bindFileInput}
          type="file"
          hidden
          value={this.state.inputValue}
        />
      </View>
    )
  }

  renderPermissions() {
    const header = `Manage permissions for ${this.state.manifest.name}`
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{header}</Text>
        <PermissionsView
          permissions={this.state.manifest.permissions}
          onSubmit={this.onSubmitPermissions}
        />
      </View>
    )
  }

  renderDownload() {
    const header = `Downloading ${this.state.manifest.name}`
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{header}</Text>
        <Text>Downloading from swarm...</Text>
      </View>
    )
  }

  renderSetId() {
    const header = `Select User ID`
    // TODO: fetch from daemon
    const ids = [
      {
        id: 'jsmith',
        name: 'James Smith',
      },
      {
        id: 'mranon',
        name: 'Mr Anon',
      },
    ]
    const rowRender = (name, style, handler) => {
      return (
        <TouchableOpacity onPress={handler} style={style} key={name}>
          <Text>{name}</Text>
        </TouchableOpacity>
      )
    }
    const idRows = ids.map((id, index) => {
      const handler = () => this.onSelectId(id.id)
      return rowRender(id.name, styles.idRow, handler)
    })
    const createIdHandler = this.createNewId()
    const createNewRow = rowRender(
      '+ Create new ID',
      [styles.idRow, styles.newId],
      createIdHandler,
    )
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{header}</Text>
        {idRows}
        {createNewRow}
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
  idRow: {
    padding: 10,
    borderRadius: 3,
    backgroundColor: COLOR_GREY,
    marginTop: 10,
  },
  newId: {
    borderWidth: 1,
    borderColor: COLOR_GREY,
    backgroundColor: COLOR_WHITE,
  },
})
