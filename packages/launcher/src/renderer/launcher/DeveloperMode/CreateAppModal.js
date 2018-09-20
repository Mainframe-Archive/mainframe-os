//@flow

import type {
  PermissionKey,
  PermissionRequirement,
  StrictPermissionsRequirements,
} from '@mainframe/app-permissions'
import type { ID, AppCreateParams } from '@mainframe/client'
import { isValidSemver } from '@mainframe/app-manifest'
import React, { createRef, Component, type ElementRef } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native-web'

import rpc from '../rpc'
import colors from '../../colors'
import globalStyles from '../../styles'
import Button from '../../UIComponents/Button'
import Text from '../../UIComponents/Text'
import TextInput from '../../UIComponents/TextInput'
import ModalView from '../../UIComponents/ModalView'
import IdentitySelectorView from '../IdentitySelectorView'
import PermissionsRequirementsView, {
  PERMISSIONS_DESCRIPTIONS,
} from './PermissionsRequirements'

type Props = {
  onRequestClose: () => void,
  onAppCreated: (appID: ID) => void,
}

type User = {
  id: ID,
  data: {
    name: string,
  },
}

type AppData = {
  name?: string,
  version?: string,
  contentsPath?: string,
  developerID?: ID,
}

type State = {
  inputValue: string,
  screen: 'info' | 'identity' | 'permissions' | 'summary',
  permissionsRequirements: StrictPermissionsRequirements,
  userId?: ID,
  devIdentities: Array<User>,
  appData: AppData,
  errorMsg?: string,
}

export default class CreateAppModal extends Component<Props, State> {
  state = {
    inputValue: '',
    screen: 'info',
    manifest: null,
    devIdentities: [],
    appData: {},
    permissionsRequirements: {
      optional: {
        WEB_REQUEST: [],
      },
      required: {
        WEB_REQUEST: [],
      },
    },
  }

  // $FlowFixMe: React Ref
  fileInput: ElementRef<'input'> = createRef()

  componentDidMount() {
    this.getOwnIdentities()
  }

  // HANDLERS

  async getOwnIdentities() {
    try {
      const res = await rpc.getOwnDevIdentities()
      this.setState({ devIdentities: res.developers })
    } catch (err) {
      // TODO: Handle error
      // eslint-disable-next-line no-console
      console.warn(err)
    }
  }

  onSelectId = (id: ID) => {
    this.setState(({ appData }) => ({
      screen: 'permissions',
      appData: {
        ...appData,
        developerID: id,
      },
    }))
  }

  onCreatedId = () => {
    this.getOwnIdentities()
  }

  getCreateParams = (
    appData: AppData,
    permissions: StrictPermissionsRequirements,
  ): ?AppCreateParams => {
    if (
      appData.name &&
      appData.version &&
      appData.contentsPath &&
      appData.developerID
    ) {
      return {
        ...appData,
        permissionsRequirements: permissions,
      }
    }
  }

  onPressCreateApp = async () => {
    const { appData, permissionsRequirements } = this.state

    const params = this.getCreateParams(appData, permissionsRequirements)
    if (!params) {
      this.setState({
        errorMsg: 'Unable to create app due to incomplete data.', // TODO: More specific error
      })
      return
    }

    try {
      const res = await rpc.createApp(params)
      this.props.onAppCreated(res.id)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('err:', err.data)
      const msg =
        err.data && err.data.length
          ? err.data[0].message
          : 'Sorry, there was a problem creating your app.'
      this.setState({
        errorMsg: msg,
      })
    }
  }

  onPressSelectContentsFolder = () => {
    this.fileInput.current.webkitdirectory = true
    this.fileInput.current.click()
  }

  onChangeName = (value: string) => {
    this.setState(({ appData }) => ({
      appData: {
        ...appData,
        name: value,
      },
    }))
  }

  onChangeVersion = (value: string) => {
    this.setState(({ appData }) => ({
      appData: {
        ...appData,
        version: value,
      },
    }))
  }

  onChangeContentsPath = (value: string) => {
    this.setState(({ appData }) => ({
      appData: {
        ...appData,
        contentsPath: value,
      },
    }))
  }

  onFileInputChange = () => {
    const files = [...this.fileInput.current.files]
    if (files.length) {
      this.setState(({ appData }) => ({
        appData: {
          ...appData,
          contentsPath: files[0].path,
        },
      }))
    }
  }

  onSetAppData = () => {
    const { appData } = this.state
    if (!appData.name || !appData.version || !appData.contentsPath) {
      this.setState({
        errorMsg: 'Please complete all fields.',
      })
    } else if (!isValidSemver(appData.version)) {
      this.setState({
        errorMsg: 'Please provide a valid verison number, e.g. 1.0.0',
      })
    } else {
      this.setState({
        errorMsg: undefined,
        screen: 'identity',
      })
    }
  }

  onSetPermissions = (
    permissionsRequirements: StrictPermissionsRequirements,
  ) => {
    this.setState({
      permissionsRequirements,
      screen: 'summary',
    })
  }

  // RENDER

  renderInfoForm() {
    return (
      <View>
        <Text style={globalStyles.header}>App Info</Text>
        <Text style={styles.description}>Set your app details.</Text>
        <TextInput
          placeholder="App name"
          style={styles.input}
          onChangeText={this.onChangeName}
          value={this.state.appData.name}
        />
        <TextInput
          placeholder="Version"
          style={styles.input}
          onChangeText={this.onChangeVersion}
          value={this.state.appData.version}
        />
        <TouchableOpacity
          onPress={this.onPressSelectContentsFolder}
          style={styles.contentsPathButton}>
          <Text style={styles.contentsPathLabel}>
            {this.state.appData.contentsPath || 'Select Contents Path'}
          </Text>
        </TouchableOpacity>
        <input
          multiple
          id="installer-file-selector"
          onChange={this.onFileInputChange}
          ref={this.fileInput}
          type="file"
          hidden
          value={this.state.inputValue}
        />
        <Button title="CONTINUE" onPress={this.onSetAppData} />
      </View>
    )
  }

  renderSetIdentity() {
    return (
      <View>
        <Text style={globalStyles.header}>Developer Identity</Text>
        <IdentitySelectorView
          enableCreate
          type="developer"
          onSelectId={this.onSelectId}
          identities={this.state.devIdentities}
          onCreatedId={this.onCreatedId}
        />
      </View>
    )
  }

  renderPermissions() {
    return (
      <View>
        <Text style={globalStyles.header}>App Permissions</Text>
        <PermissionsRequirementsView onSetPermissions={this.onSetPermissions} />
      </View>
    )
  }

  renderSummary() {
    const { appData, permissionsRequirements } = this.state

    let permissionsContainer

    const requirements = permissionsRequirements

    if (requirements) {
      const renderPermissions = (
        requirement: PermissionRequirement,
      ): Array<Object> => {
        return Object.keys(requirements[requirement]).reduce(
          (acc, key: PermissionKey) => {
            // @$FlowFixMe Missing keys
            const permission = requirements[requirement][key]
            if (key === 'WEB_REQUEST') {
              if (permission.length) {
                // @$FlowFixMe WEB_REQUEST specific
                permission.forEach(host => {
                  acc.push(
                    <Text
                      style={[
                        styles.permissionSummaryRow,
                        globalStyles.darkGreyText,
                      ]}
                      key={key}>
                      Make web requests to {host}
                    </Text>,
                  )
                })
              }
            } else {
              acc.push(
                <View style={styles.permissionSummaryRow}>
                  <Text key={key} style={globalStyles.darkGreyText}>
                    {PERMISSIONS_DESCRIPTIONS[key]}
                  </Text>
                </View>,
              )
            }
            return acc
          },
          [],
        )
      }

      const optionalPermissionRequirements = renderPermissions('optional')
      const requiredPermissionRequirements = renderPermissions('required')

      const optionalPermissions = optionalPermissionRequirements.length ? (
        <View>
          <Text style={globalStyles.subHeader}>Optional Permissions</Text>
          <View style={styles.permissionsSummary}>
            {optionalPermissionRequirements}
          </View>
        </View>
      ) : null

      const requiredPermissions = requiredPermissionRequirements.length ? (
        <View>
          <Text style={globalStyles.subHeader}>Required Permissions</Text>
          <View style={styles.permissionsSummary}>
            {requiredPermissionRequirements}
          </View>
        </View>
      ) : null

      permissionsContainer = (
        <View>
          {optionalPermissions}
          {requiredPermissions}
        </View>
      )
    }

    const summaryRowStyles = [styles.summaryRow, globalStyles.darkGreyText]

    return (
      <View>
        <Text style={globalStyles.header}>App Summary</Text>
        <View style={styles.appDataSummary}>
          <Text style={summaryRowStyles}>
            <Text style={globalStyles.boldText}>Name: </Text>
            {appData.name}
          </Text>
          <Text style={summaryRowStyles}>
            <Text style={globalStyles.boldText}>Version: </Text>
            {appData.version}
          </Text>
          <Text style={summaryRowStyles}>
            <Text style={globalStyles.boldText}>Contents path: </Text>
            {appData.contentsPath}
          </Text>
        </View>
        {permissionsContainer}
        <Button title="CREATE APP" onPress={this.onPressCreateApp} />
      </View>
    )
  }

  renderContent() {
    switch (this.state.screen) {
      case 'info':
        return this.renderInfoForm()
      case 'identity':
        return this.renderSetIdentity()
      case 'permissions':
        return this.renderPermissions()
      case 'summary':
        return this.renderSummary()
      default:
        return null
    }
  }

  renderError() {
    return this.state.errorMsg ? (
      <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>
    ) : null
  }

  render() {
    return (
      <ModalView isOpen={true} onRequestClose={this.props.onRequestClose}>
        {this.renderContent()}
        {this.renderError()}
      </ModalView>
    )
  }
}

const PADDING = 10

const styles = StyleSheet.create({
  description: {
    paddingTop: PADDING,
    paddingBottom: PADDING * 1.5,
  },
  input: {
    marginBottom: PADDING * 2,
  },
  contentsPathButton: {
    padding: PADDING,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.LIGHT_GREY_E8,
    backgroundColor: colors.LIGHT_GREY_F7,
    marginBottom: PADDING * 2,
  },
  contentsPathLabel: {
    fontSize: 14,
    borderRadius: 3,
  },
  appDataSummary: {
    marginVertical: PADDING,
    borderRadius: 3,
    borderWidth: 1,
    padding: PADDING,
    borderColor: colors.LIGHT_GREY_E8,
  },
  summaryRow: {
    paddingVertical: PADDING / 2,
  },
  permissionsSummary: {
    marginVertical: PADDING,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.LIGHT_GREY_E8,
  },
  permissionSummaryRow: {
    paddingHorizontal: PADDING,
    paddingVertical: PADDING,
    borderBottomColor: colors.LIGHT_GREY_E8,
    borderBottomWidth: 1,
  },
  errorMsg: {
    paddingTop: PADDING,
    color: colors.PRIMARY_RED,
  },
})
