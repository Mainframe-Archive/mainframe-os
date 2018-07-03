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
  const domains = Object.keys(HTTPS_REQUEST)
  const granted = domains.filter(k => HTTPS_REQUEST[k])
  const denied = domains.filter(k => !HTTPS_REQUEST[k])
  return {
    ...others,
    HTTPS_REQUEST: HTTPS_REQUEST
      ? createHTTPSRequestGrant(granted, denied)
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
    const settings = formatSettings(permissionsSettings)
    const requiredDomains = permissions.required['HTTPS_REQUEST']
    if (requiredDomains && requiredDomains.length) {
      settings['HTTPS_REQUEST'].granted.push(...requiredDomains)
      delete permissions.required['HTTPS_REQUEST']
    }
    this.props.onSubmit({ ...settings, ...permissions.required })
  }

  onSetPermissionGrant = (
    key: PermissionKey,
    granted: ?PermissionGranted,
    option?: string,
  ) => {
    this.setState(({ permissionsSettings }) => {
      if (key === 'HTTPS_REQUEST') {
        if (option == null) {
          return null // Don't update state
        }
        if (granted == null) {
          delete permissionsSettings.HTTPS_REQUEST[option]
        } else {
          permissionsSettings.HTTPS_REQUEST[option] = granted
        }
      } else {
        if (granted == null) {
          delete permissionsSettings[key]
        } else {
          permissionsSettings[key] = granted
        }
      }
      return { permissionsSettings }
    })
  }

  // RENDER

  renderRequired() {
    return (
      <View style={[styles.toggleItem, styles.selectedToggle]}>
        <Text style={styles.toggleLabel}>Always</Text>
      </View>
    )
  }

  renderToggle(key: PermissionKey, value: ?boolean, option?: string) {
    const options = [
      {
        label: 'Ask',
        grant: undefined,
      },
      {
        label: 'Always',
        grant: true,
      },
      {
        label: 'Never',
        grant: false,
      },
    ]
    let selectedIndex = 0
    if (value) {
      selectedIndex = 1
    } else if (value === false) {
      selectedIndex = 2
    }
    return (
      <View style={styles.toggle}>
        {options.map((o, i) => {
          const toggleStyles = [styles.toggleItem]
          if (i === selectedIndex) {
            toggleStyles.push(styles.selectedToggle)
          }
          const onPress = () => this.onSetPermissionGrant(key, o.grant, option)
          return (
            <TouchableOpacity key={i} onPress={onPress} style={toggleStyles}>
              <Text style={styles.toggleLabel}>{o.label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

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
                  {required
                    ? this.renderRequired()
                    : this.renderToggle(
                        'HTTPS_REQUEST',
                        permissionsSettings.HTTPS_REQUEST[domain],
                        domain,
                      )}
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
          {required
            ? this.renderRequired()
            : // $FlowFixMe
              this.renderToggle(key, permissionsSettings[key])}
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
const COLOR_LIGHTEST_GREY = '#f0f0f0'
const COLOR_LIGHT_GREY = '#e5e5e5'
const COLOR_MF_RED = '#db0b56'
const COLOR_MF_BLUE = '#102043'

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
    backgroundColor: COLOR_LIGHTEST_GREY,
    padding: 8,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionRowWithOptions: {
    backgroundColor: COLOR_LIGHTEST_GREY,
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
  errorMessage: {
    paddingBottom: 10,
    paddingTop: 5,
    color: COLOR_MF_RED,
  },
  toggle: {
    flexDirection: 'row',
  },
  toggleItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: COLOR_LIGHT_GREY,
  },
  selectedToggle: {
    color: COLOR_WHITE,
    backgroundColor: COLOR_MF_BLUE,
  },
  toggleLabel: {
    fontSize: 11,
  },
})
