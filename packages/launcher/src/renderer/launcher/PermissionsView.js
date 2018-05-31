//@flow

import {
  createHTTPSRequestGrant,
  type PermissionKey, // eslint-disable-line import/named
  type PermissionRequirement, // eslint-disable-line import/named
  type PermissionsGrants, // eslint-disable-line import/named
} from '@mainframe/app-permissions'
import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Modal,
  Switch,
  ScrollView,
} from 'react-native-web'

import Button from '../Button'

type Domain = string
type PermissionGranted = boolean

type PermissionOption = {
  HTTPS_REQUEST?: Array<Domain>,
  [PermissionKey]: true,
}

type PermissionOptionValue = $Values<PermissionOption>

// Permissions requested by manifest
export type PermissionOptions = {
  [PermissionRequirement]: PermissionOption,
}

// Permissions set by user
type PermissionsSettings = {
  HTTPS_REQUEST: { [Domain]: PermissionGranted },
  [PermissionKey]: PermissionGranted,
}

type PermissionInfo = {
  name: string,
  description: string,
}

const PERMISSION_NAMES = {
  SWARM_DOWNLOAD: {
    name: 'Download From Swarm',
    description: 'Allow the app to download files from swarm',
  },
  SWARM_UPLOAD: {
    name: 'Upload To Swarm',
    description: 'Allow this app to upload files from swarm',
  },
  WEB3_CALL: {
    name: 'Read from Blockchain',
    description: 'Allow this app to make read only calls to the blockchain',
  },
  WEB3_SEND: {
    name: 'Write to the Blockchain',
    description:
      'Allow this app to make transactional calls to the blockchain, e.g. send tokens',
  },
  HTTPS_REQUEST: {
    name: 'Make https requests',
    description: 'Allow this app to make https requests to specified domains',
  },
  NOTIFICATION_DISPLAY: {
    name: 'Display Notifications',
    description: 'Allow this app to display notifications',
  },
  LOCATION_GET: {
    name: 'Read Location',
    description: 'Allow this app to read your current location',
  },
}

const formatSettings = (
  settings: $Shape<PermissionsSettings>,
): $Shape<PermissionsGrants> => {
  const { HTTPS_REQUEST, ...others } = settings
  return {
    ...others,
    HTTPS_REQUEST: HTTPS_REQUEST
      ? createHTTPSRequestGrant(Object.keys(HTTPS_REQUEST).filter(Boolean))
      : createHTTPSRequestGrant(),
  }
}

type Props = {
  permissions: PermissionOptions,
  onSubmit: (permissions: PermissionsGrants) => void,
}

type State = {
  failedValidation: boolean,
  permissionsSettings: PermissionsSettings,
}

export default class PermissionsView extends Component<Props, State> {
  state = {
    failedValidation: false,
    permissionsSettings: {
      HTTPS_REQUEST: {},
    },
  }

  // HANDLERS

  onPressDone = () => {
    const { permissions } = this.props
    const { permissionsSettings } = this.state

    let invalid = false
    if (permissions.required != null) {
      const { HTTPS_REQUEST, ...others } = permissions.required
      // Check expected values for basic keys (boolean)
      invalid = Object.keys(others).some(
        key => permissionsSettings[key] !== true,
      )
      if (invalid === false && HTTPS_REQUEST != null) {
        // Check special HTTPS_REQUEST case
        invalid = HTTPS_REQUEST.some(
          domain => permissionsSettings.HTTPS_REQUEST[domain] !== true,
        )
      }
    }

    if (invalid) {
      this.setState({ failedValidation: true })
    } else {
      this.props.onSubmit(formatSettings(permissionsSettings))
    }
  }

  onToggle = (
    key: PermissionKey,
    granted: PermissionGranted,
    option?: string,
  ) => {
    this.setState(({ permissionsSettings }) => {
      if (key === 'HTTPS_REQUEST') {
        if (option == null) {
          return null // Don't update state
        }
        permissionsSettings.HTTPS_REQUEST[option] = granted
      } else {
        permissionsSettings[key] = granted
      }
      return { permissionsSettings }
    })
  }

  // RENDER

  renderPermission = (
    key: PermissionKey,
    value: PermissionOptionValue,
    required: boolean,
  ) => {
    const permissionData = PERMISSION_NAMES[key]
    if (permissionData == null) {
      return (
        <View style={styles.permissionRow} key={key}>
          <Text style={styles.permissionName}>
            {`This app is asking for permission to an unknown permission key: ${key}`}
          </Text>
        </View>
      )
    }

    const { permissionsSettings } = this.state
    let options, rowStyle

    if (key === 'HTTPS_REQUEST') {
      if (Array.isArray(value)) {
        options = (
          <View key={key} style={styles.domains}>
            {value.map(domain => (
              <View style={styles.domainRow} key={domain}>
                <Text key={domain} style={styles.domainLabel}>
                  {domain}
                </Text>
                <View style={styles.switches}>
                  <Text style={styles.switchLabel}>YES</Text>
                  <Switch
                    value={permissionsSettings.HTTPS_REQUEST[domain] === true}
                    onValueChange={() =>
                      this.onToggle('HTTPS_REQUEST', true, domain)
                    }
                  />
                  <Text style={styles.switchLabel}>NO</Text>
                  <Switch
                    value={permissionsSettings.HTTPS_REQUEST[domain] === false}
                    onValueChange={() =>
                      this.onToggle('HTTPS_REQUEST', false, domain)
                    }
                  />
                </View>
              </View>
            ))}
          </View>
        )
      } else {
        // Bad data provided
        options = null
      }
      rowStyle = styles.permissionRowWithOptions
    } else {
      options = (
        <View style={styles.switches}>
          <Text style={styles.switchLabel}>YES</Text>
          <Switch
            // $FlowFixMe: missing key in Object
            value={permissionsSettings[key] === true}
            onValueChange={() => this.onToggle(key, true)}
            key={key + 'YES'}
          />
          <Text style={styles.switchLabel}>NO</Text>
          <Switch
            // $FlowFixMe: missing key in Object
            value={permissionsSettings[key] === false}
            onValueChange={() => this.onToggle(key, false)}
            key={key + 'NO'}
          />
        </View>
      )
      rowStyle = styles.permissionRow
    }

    return (
      <View style={rowStyle} key={key}>
        <View style={styles.permissionInfo}>
          <Text style={styles.permissionName}>{permissionData.name}</Text>
          <Text style={styles.permissionDescription}>
            {permissionData.description}
          </Text>
        </View>
        {options}
      </View>
    )
  }

  renderPermissionsOptions = () => {
    const { permissions } = this.props

    const required = permissions.required
      ? Object.keys(permissions.required).map(key => {
          return this.renderPermission(key, permissions.required[key], true)
        })
      : null
    const optional = permissions.optional
      ? Object.keys(permissions.optional).map(key => {
          return this.renderPermission(key, permissions.optional[key], false)
        })
      : null

    return required || optional ? (
      <ScrollView style={styles.scrollView}>
        <Text style={styles.header}>Required Permissions</Text>
        {required || <Text>No required permission</Text>}
        <Text style={styles.header}>Optional Permissions</Text>
        {optional || <Text>No additional permission</Text>}
      </ScrollView>
    ) : (
      <View>
        <Text style={styles.header}>No permission needed</Text>
      </View>
    )
  }

  render() {
    const failedValidation = this.state.failedValidation ? (
      <Text style={styles.errorMessage}>
        You have to accept all required permissions to continue.
      </Text>
    ) : null

    return (
      <View style={styles.container}>
        {this.renderPermissionsOptions()}
        {failedValidation}
        <Button title="Save Preferences" onPress={this.onPressDone} />
      </View>
    )
  }
}

const COLOR_WHITE = '#ffffff'
const COLOR_LIGHT_GREY = '#f0f0f0'
const COLOR_MF_RED = '#db0b56'

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_WHITE,
    flex: 1,
    maxHeight: 400,
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  permissionRow: {
    backgroundColor: COLOR_LIGHT_GREY,
    padding: 8,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionRowWithOptions: {
    backgroundColor: COLOR_LIGHT_GREY,
    padding: 8,
    marginBottom: 6,
    flexDirection: 'column',
  },
  permissionInfo: {
    flex: 1,
  },
  permissionName: {
    paddingBottom: 6,
    fontSize: 14,
    fontWeight: 'bold',
  },
  permissionDescription: {
    fontSize: 12,
    paddingRight: 20,
  },
  scrollView: {
    marginBottom: 10,
    flex: 1,
  },
  domains: {
    paddingTop: 5,
  },
  domainRow: {
    flexDirection: 'row',
    padding: 7,
    backgroundColor: COLOR_WHITE,
  },
  // domainOption: {
  //   borderRadius: 30,
  //   padding: 8,
  //   backgroundColor: COLOR_WHITE,
  //   textAlign: 'center',
  //   margin: 4,
  // },
  domainLabel: {
    flex: 1,
  },
  switches: {
    flexDirection: 'row',
  },
  switchLabel: {
    paddingHorizontal: 5,
  },
  errorMessage: {
    paddingBottom: 10,
    paddingTop: 5,
    color: COLOR_MF_RED,
  },
})
