//@flow

import {
  havePermissionsToGrant,
  type StrictPermissionsGrants,
  createStrictPermissionGrants,
} from '@mainframe/app-permissions'
import type { IdentityOwnData } from '@mainframe/client'
import type { ManifestData } from '@mainframe/app-manifest'
import React, { createRef, Component, type ElementRef } from 'react'
import { Text } from '@morpheus-ui/core'
import { commitMutation } from 'react-relay'
import styled from 'styled-components/native'
// import Dropzone from 'react-dropzone'

import { EnvironmentContext } from '../RelayEnvironment'

import LauncherContext from '../LauncherContext'
import Button from '../../UIComponents/Button'
import FormModalView from '../../UIComponents/FormModalView'
import rpc from '../rpc'
import PermissionsView from '../PermissionsView'
import { appInstallMutation } from './appMutations'

type Props = {
  onRequestClose: () => void,
  onInstallComplete: () => void,
}

type ViewProps = Props & {
  userID: string,
}

type State = {
  inputValue: string,
  installStep: 'manifest' | 'permissions' | 'download',
  manifest: ?ManifestData,
  userPermissions?: StrictPermissionsGrants,
  ownUsers: Array<IdentityOwnData>,
  errorMsg?: string,
}

const View = styled.View``

const DragView = styled.View`
  background-color: red;
  padding: 50px;
`

class AppInstallModal extends Component<ViewProps, State> {
  static contextType = EnvironmentContext

  state = {
    inputValue: '',
    installStep: 'manifest',
    manifest: null,
    ownUsers: [],
  }

  // $FlowFixMe: React Ref
  fileInput: ElementRef<'input'> = createRef()
  // $FlowFixMe: React Ref
  dropArea: ElementRef<'div'> = createRef()

  componentDidMount() {
    console.log(this.dropArea)
    console.log(this.fileInput)
    // this.dropArea.current.addEventListener('drop', this.onDrop)
    // this.dropArea.current.addEventListener('dragover', this.onDragOver)
  }

  componentDidUpdate() {
    console.log(this.dropArea)
    console.log(this.fileInput)
  }

  componentWillUnmount() {
    // this.dropArea.current.removeEventListener('drop', this.onDrop)
    // this.dropArea.current.removeEventListener('dragover', this.onDragOver)
  }

  // HANDLERS

  onDragOver = (event: SyntheticDragEvent<HTMLHeadingElement>) => {
    event.preventDefault()
    event.stopPropagation()
    event.dataTransfer.dropEffect = 'copy'
  }

  onDrop = (event: SyntheticDragEvent<HTMLHeadingElement>) => {
    console.log(event.dataTransfer.files)

    event.preventDefault()
    event.stopPropagation()
    // // Only handle a single file for now
    // const file = event.dataTransfer.files[0]
    // if (file) {
    //   this.sendFile(file)
    // }
  }

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
          })
          if (havePermissionsToGrant(manifest.permissions)) {
            this.setState({
              installStep: 'permissions',
            })
          } else {
            const strictGrants = createStrictPermissionGrants({})
            this.onSubmitPermissions(strictGrants)
          }
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
      userID: this.props.userID,
      manifest,
      permissionsSettings,
    }

    // $FlowFixMe: Permission types
    commitMutation(this.context, {
      mutation: appInstallMutation,
      variables: { input: params },
      onCompleted: () => {
        this.props.onInstallComplete()
      },
      onError: err => {
        const msg =
          err.message || 'Sorry, there was a problem creating your app.'
        this.setState({
          errorMsg: msg,
        })
      },
    })
  }

  // RENDER

  renderManifestImport() {
    return (
      <>
        <DragView ref={this.dropArea}>
          <Text variant="modalText">
            Lorem ipsum dolor amet sitim opsos calibri dos ipsum dolor amet
            sitimus.
          </Text>
        </DragView>
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
      </>
    )
  }

  renderPermissions() {
    const { manifest } = this.state

    return manifest ? (
      <View>
        <Text variant="h2">{`Manage permissions for ${manifest.name}`}</Text>
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
        <Text variant="h2">{`Downloading ${manifest.name}`}</Text>
        <Text>Downloading from swarm...</Text>
      </View>
    ) : null
  }

  renderContent() {
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

  render() {
    return (
      <FormModalView
        dismissButton="CANCEL"
        title="Install an app"
        onRequestClose={this.props.onRequestClose}>
        {this.renderContent()}
      </FormModalView>
    )
  }
}

export default class AppInstallContextWrapper extends Component<Props> {
  static contextType = LauncherContext
  render() {
    return (
      <AppInstallModal userID={this.context.user.localID} {...this.props} />
    )
  }
}
