//@flow

import type {
  PermissionKey,
  PermissionRequirement,
  StrictPermissionsRequirements,
} from '@mainframe/app-permissions'
import type { AppCreateParams, IdentityOwnData } from '@mainframe/client'
import { isValidSemver } from '@mainframe/app-manifest'
import React, { createRef, Component, type ElementRef } from 'react'
import { graphql, QueryRenderer, commitMutation } from 'react-relay'
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native-web'

import colors from '../../colors'
import globalStyles from '../../styles'
import RelayLoaderView from '../RelayLoaderView'
import Button from '../../UIComponents/Button'
import Text from '../../UIComponents/Text'
import TextInput from '../../UIComponents/TextInput'
import ModalView from '../../UIComponents/ModalView'
import IdentitySelectorView from '../IdentitySelectorView'
import { EnvironmentContext } from '../RelayEnvironment'
import { appCreateMutation } from '../apps/appMutations'
import PermissionsRequirementsView, {
  PERMISSIONS_DESCRIPTIONS,
} from './PermissionsRequirements'

type RendererProps = {
  onRequestClose: () => void,
  onAppCreated: () => void,
}

type Props = RendererProps & {
  ownDevelopers: Array<IdentityOwnData>,
}

type AppData = {
  name?: string,
  version?: string,
  contentsPath?: string,
  developerID?: string,
}

type State = {
  inputValue: string,
  screen: 'info' | 'identity' | 'permissions' | 'summary',
  permissionsRequirements: StrictPermissionsRequirements,
  userId?: string,
  appData: AppData,
  errorMsg?: string,
}

export class CreateAppModal extends Component<Props, State> {
  static contextType = EnvironmentContext

  state = {
    inputValue: '',
    screen: 'info',
    manifest: null,
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

  // HANDLERS

  onSelectId = (id: string) => {
    this.setState(({ appData }) => ({
      screen: 'permissions',
      appData: {
        ...appData,
        developerID: id,
      },
    }))
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

    commitMutation(this.context, {
      mutation: appCreateMutation,
      // $FlowFixMe: Relay type
      variables: { input: params },
      onCompleted: () => {
        this.props.onAppCreated()
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
    const { ownDevelopers } = this.props
    if (!appData.name || !appData.version || !appData.contentsPath) {
      this.setState({
        errorMsg: 'Please complete all fields.',
      })
    } else if (!isValidSemver(appData.version)) {
      this.setState({
        errorMsg: 'Please provide a valid verison number, e.g. 1.0.0',
      })
    } else {
      if (ownDevelopers.length) {
        this.onSelectId(ownDevelopers[0].localID)
      } else {
        this.setState({
          errorMsg: undefined,
          screen: 'identity',
        })
      }
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
          testID="create-app-name-input"
          style={styles.input}
          onChangeText={this.onChangeName}
          value={this.state.appData.name}
        />
        <TextInput
          placeholder="Version"
          style={styles.input}
          testID="create-app-version-input"
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
          id="app-contents-file-selector"
          onChange={this.onFileInputChange}
          ref={this.fileInput}
          type="file"
          hidden
          value={this.state.inputValue}
        />
        <Button
          testID="create-app-set-info-button"
          title="CONTINUE"
          onPress={this.onSetAppData}
        />
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
          onCreatedId={this.onSelectId}
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

  renderPermissionsSummaryRows = (
    requirements: StrictPermissionsRequirements,
    type: PermissionRequirement,
  ): Array<Object> => {
    return Object.keys(requirements[type]).reduce((acc, key: PermissionKey) => {
      // @$FlowFixMe Missing keys
      const permission = requirements[type][key]
      if (key === 'WEB_REQUEST') {
        if (permission.length) {
          // @$FlowFixMe WEB_REQUEST specific
          permission.forEach(host => {
            acc.push(
              <View style={styles.permissionSummaryRow}>
                <Text style={globalStyles.darkGreyText} key={key}>
                  Make web requests to{' '}
                  <Text style={globalStyles.boldText}>{host}</Text>
                </Text>
              </View>,
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
    }, [])
  }

  renderSummary() {
    const { appData, permissionsRequirements } = this.state

    let permissionsContainer

    const requirements = permissionsRequirements

    if (requirements) {
      const optionalPermissionRequirements = this.renderPermissionsSummaryRows(
        requirements,
        'optional',
      )
      const requiredPermissionRequirements = this.renderPermissionsSummaryRows(
        requirements,
        'required',
      )

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
        <ScrollView style={styles.scrollContainer}>
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
        </ScrollView>
        <Button
          testID="create-app-complete-button"
          title="CREATE APP"
          onPress={this.onPressCreateApp}
        />
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

export default class CreateAppModalRenderer extends Component<RendererProps> {
  static contextType = EnvironmentContext

  render() {
    return (
      <QueryRenderer
        environment={this.context}
        query={graphql`
          query CreateAppModalQuery {
            viewer {
              identities {
                ownDevelopers {
                  localID
                }
              }
            }
          }
        `}
        variables={{}}
        render={({ error, props }) => {
          if (error || !props) {
            return <RelayLoaderView error={error ? error.message : undefined} />
          } else {
            return (
              <CreateAppModal {...props.viewer.identities} {...this.props} />
            )
          }
        }}
      />
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
  scrollContainer: {
    marginVertical: PADDING,
    maxHeight: 400,
  },
  appDataSummary: {
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
