//@flow

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

type PermissionOption = string | Array<string>
type PermissionSetting = string | { string?: 'accepted' | 'rejected' }

export type PermissionSettings = {
  required: { string?: PermissionSetting },
  optional: { string?: PermissionSetting },
}

type Props = {
  permissions: {
    required: { string: PermissionOption },
    optional: { string: PermissionOption },
  },
  onSubmit: (permissionSettings: PermissionSettings) => void,
}

type State = {
  permissionSettings: PermissionSettings,
  failedValidation?: boolean,
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
  NOTIFICATIONS_DISPLAY: {
    name: 'Display Notifications',
    description: 'Allow this app to display notifications',
  },
  LOCATION_GET: {
    name: 'Read Location',
    description: 'Allow this app to read your current location',
  },
}

export default class PermissionsView extends Component {
  state: State = {
    permissionSettings: {
      required: {
        HTTPS_REQUEST: {},
      },
      optional: {
        HTTPS_REQUEST: {},
      },
    },
  }

  // HANDLERS

  onPressDone = () => {
    const invalid = Object.keys(this.props.permissions.required).some(key => {
      if (key === 'HTTPS_REQUEST') {
        const nonAcceptedDomain = this.props.permissions.required[key].some(
          domain => {
            return (
              this.state.permissionSettings.required[key][domain] !== 'accepted'
            )
          },
        )
        return nonAcceptedDomain
      } else if (this.state.permissionSettings.required[key] !== 'accepted') {
        return true
      }
      return false
    })
    if (invalid) {
      this.setState({ failedValidation: true })
    } else {
      this.props.onSubmit(this.state.permissionSettings)
    }
  }

  onToggle = (
    key: string,
    requiredType: 'required' | 'optional',
    accept: boolean,
    option: ?string,
  ) => {
    const permissionSettings = this.state.permissionSettings
    if (key === 'HTTPS_REQUEST') {
      let acceptedDomains = this.state.permissionSettings[requiredType][key]
      if (accept) {
        permissionSettings[requiredType][key][option] =
          acceptedDomains[option] === 'accepted' ? undefined : 'accepted'
      } else {
        permissionSettings[requiredType][key][option] =
          acceptedDomains[option] === 'rejected' ? undefined : 'rejected'
      }
    } else {
      if (accept) {
        permissionSettings[requiredType][key] =
          permissionSettings[requiredType][key] === 'accepted'
            ? undefined
            : 'accepted'
      } else {
        permissionSettings[requiredType][key] =
          permissionSettings[requiredType][key] === 'rejected'
            ? undefined
            : 'rejected'
      }
    }
    this.setState({ permissionSettings })
  }

  // RENDER

  renderPermission = (
    key: string,
    option: PermissionOption,
    required: boolean,
  ) => {
    const { permissionSettings } = this.state
    const type = required ? 'required' : 'optional'
    let options
    if (PERMISSION_NAMES[key]) {
      if (key === 'HTTPS_REQUEST') {
        options = (
          <View key={key} style={styles.domains}>
            {option.map(domain => {
              const accepted =
                permissionSettings[type][key][domain] === 'accepted'
              const rejected =
                permissionSettings[type][key][domain] === 'rejected'
              const style = [styles.domainOption]
              return (
                <View style={styles.domainRow} key={domain}>
                  <Text key={domain} style={styles.domainLabel}>
                    {domain}
                  </Text>
                  <View style={styles.switches}>
                    <Text style={styles.switchLabel}>YES</Text>
                    <Switch
                      value={accepted}
                      onValueChange={() =>
                        this.onToggle(key, type, true, domain)
                      }
                    />
                    <Text style={styles.switchLabel}>NO</Text>
                    <Switch
                      value={rejected}
                      onValueChange={() =>
                        this.onToggle(key, type, false, domain)
                      }
                    />
                  </View>
                </View>
              )
            })}
          </View>
        )
      } else {
        const accepted = permissionSettings[type][key] === 'accepted'
        const rejected = permissionSettings[type][key] === 'rejected'
        options = (
          <View style={styles.switches}>
            <Text style={styles.switchLabel}>YES</Text>
            <Switch
              value={accepted}
              onValueChange={() => this.onToggle(key, type, true)}
              key={key + 'YES'}
            />
            <Text style={styles.switchLabel}>NO</Text>
            <Switch
              value={rejected}
              onValueChange={() => this.onToggle(key, type, false)}
              key={key + 'NO'}
            />
          </View>
        )
      }
      const hasOptions = key === 'HTTPS_REQUEST'
      const rowStyle = hasOptions
        ? styles.permissionRowWithOptions
        : styles.permissionRow
      return (
        <View style={rowStyle} key={key}>
          <View style={styles.permissionInfo}>
            <Text style={styles.permissionName}>
              {PERMISSION_NAMES[key].name}
            </Text>
            <Text style={styles.permissionDescription}>
              {PERMISSION_NAMES[key].description}
            </Text>
          </View>
          {options}
        </View>
      )
    } else {
      return (
        <View style={styles.permissionRow} key={key}>
          <Text style={styles.permissionName}>
            {`This app is asking for permission to an unknown permission key: ${key}`}
          </Text>
        </View>
      )
    }
  }

  renderPermissionsOptions = () => {
    const required = Object.keys(this.props.permissions.required).map(key => {
      const options = this.props.permissions.required[key]
      return this.renderPermission(key, options, true)
    })
    const optional = Object.keys(this.props.permissions.optional).map(key => {
      const options = this.props.permissions.optional[key]
      return this.renderPermission(key, options, false)
    })
    return (
      <ScrollView style={styles.scrollView}>
        <Text style={styles.header}>Required Permissions</Text>
        {required}
        <Text style={styles.header}>Optional Permissions</Text>
        {optional}
      </ScrollView>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    maxHeight: 400,
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  permissionRow: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionRowWithOptions: {
    backgroundColor: '#f0f0f0',
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
    backgroundColor: '#ffffff',
  },
  domainOption: {
    borderRadius: 30,
    padding: 8,
    backgroundColor: '#ffffff',
    textAlign: 'center',
    margin: 4,
  },
  domainLabel: {
    flex: 1,
  },
  grantedDomain: {
    backgroundColor: '#ffffff',
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
    color: '#db0b56',
  },
})
