//@flow

import {
  type StrictPermissionsRequirements,
  type PermissionRequirement,
  type PermissionKey,
  type PermissionKeyBasic,
  isValidWebHost,
} from '@mainframe/app-permissions'
import React, { Component } from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native-web'

import colors from '../../colors'
import Text from '../../UIComponents/Text'
import Button from '../../UIComponents/Button'
import TextInput from '../../UIComponents/TextInput'
import globalStyles from '../../styles'

type Props = {
  onSetPermissions: (permissions: StrictPermissionsRequirements) => void,
  permissionRequirements?: StrictPermissionsRequirements,
}

type State = {
  isHovering?: boolean,
  hostInput: string,
  errorMsg?: ?string,
  permissionSettings: {
    WEB_REQUEST: {
      [string]: PermissionRequirement,
    },
    [PermissionKeyBasic]: PermissionRequirement,
  },
}

export const PERMISSIONS_DESCRIPTIONS = {
  SWARM_UPLOAD: 'Upload files to Swarm',
  SWARM_DOWNLOAD: 'Download files from Swarm',
  BLOCKCHAIN_SEND: 'Make transactions to Ethereum Blockchain',
  WEB_REQUEST: 'Set required web request hosts',
}

export default class PermissionsRequirementsView extends Component<
  Props,
  State,
> {
  constructor(props: Props) {
    super(props)
    const permissionSettings = {
      WEB_REQUEST: {},
    }
    const requirements = props.permissionRequirements
    if (requirements) {
      Object.keys(requirements).forEach(requirement => {
        Object.keys(requirements[requirement]).forEach(key => {
          if (
            key === 'WEB_REQUEST' &&
            Array.isArray(requirements.optional[key])
          ) {
            requirements.optional[key].forEach(host => {
              permissionSettings[host] = requirement
            })
          } else {
            // @$FlowFixMe missing keys
            permissionSettings[key] = requirement
          }
        })
      })
    }
    this.state = {
      hostInput: '',
      permissionSettings,
    }
  }

  onPressAddHost = () => {
    const { hostInput } = this.state
    if (!hostInput) {
      return
    }
    if (!isValidWebHost(hostInput)) {
      this.setState({
        errorMsg: 'Please provide a valid domain, e.g. mainframe.com',
      })
      return
    }
    this.setState(({ permissionSettings }) => {
      permissionSettings.WEB_REQUEST[hostInput] = 'required'
      return {
        permissionSettings,
        errorMsg: undefined,
        hostInput: '',
      }
    })
  }

  onChangeHostInput = (value: string) => {
    this.setState({
      errorMsg: undefined,
      hostInput: value,
    })
  }

  onPressSave = () => {
    const { permissionSettings } = this.state
    const formattedPermissions: StrictPermissionsRequirements = {
      optional: {
        WEB_REQUEST: [],
      },
      required: {
        WEB_REQUEST: [],
      },
    }
    const keys: Array<PermissionKey> = Object.keys(permissionSettings)
    keys.forEach((key: PermissionKey) => {
      if (key === 'WEB_REQUEST') {
        Object.keys(permissionSettings.WEB_REQUEST).forEach(host => {
          const requirement = permissionSettings.WEB_REQUEST[host]
          formattedPermissions[requirement].WEB_REQUEST.push(host)
        })
      } else {
        const requirement = permissionSettings[key]
        formattedPermissions[requirement][key] = true
      }
    })
    this.props.onSetPermissions(formattedPermissions)
  }

  onToggle = (
    key: PermissionKey,
    newState: PermissionRequirement,
    host?: string,
  ) => {
    this.setState(({ permissionSettings }) => {
      if (key === 'WEB_REQUEST' && host) {
        if (newState === permissionSettings.WEB_REQUEST[host]) {
          delete permissionSettings.WEB_REQUEST[host]
        } else {
          permissionSettings.WEB_REQUEST[host] = newState
        }
        return { permissionSettings }
      } else {
        if (newState === permissionSettings[key]) {
          delete permissionSettings[key]
        } else {
          // @$FlowFixMe non web request
          permissionSettings[key] = newState
        }
        return { permissionSettings }
      }
    })
  }

  // RENDER

  renderToggle = (
    key: PermissionKey,
    state: PermissionRequirement,
    onToggle: (
      key: PermissionKey,
      type: PermissionRequirement,
      host?: string,
    ) => void,
    host?: string,
  ) => {
    const leftToggleStyle = [styles.toggleLabel, styles.labelLeft]
    const rightToggleStyle = [styles.toggleLabel, styles.labelRight]
    if (state === 'optional') {
      leftToggleStyle.push(styles.activeToggle)
    } else if (state === 'required') {
      rightToggleStyle.push(styles.activeToggle)
    }

    return (
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={styles.leftToggle}
          onPress={() => onToggle(key, 'optional', host)}>
          <Text style={leftToggleStyle}>OPTIONAL</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onToggle(key, 'required', host)}>
          <Text style={rightToggleStyle}>REQUIRED</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { permissionSettings } = this.state
    const permissionOptions = Object.keys(PERMISSIONS_DESCRIPTIONS).map(key => {
      if (key === 'WEB_REQUEST') {
        const hostRequirements = Object.keys(
          permissionSettings.WEB_REQUEST,
        ).map(host => {
          return (
            <View key={host} style={styles.webHostRow}>
              <Text style={styles.webHostLabel}>{host}</Text>
              {this.renderToggle(
                key,
                permissionSettings.WEB_REQUEST[host],
                this.onToggle,
                host,
              )}
            </View>
          )
        })
        return (
          <View style={styles.webRequestsContainer}>
            <Text style={styles.permissonDescription}>
              {PERMISSIONS_DESCRIPTIONS[key]}
            </Text>
            <View style={styles.addWebHost}>
              <TextInput
                value={this.state.hostInput}
                onChangeText={this.onChangeHostInput}
                placeholder="Add domain (e.g. mainframe.com)"
              />
              <TouchableOpacity
                style={styles.addWebHostButton}
                onPress={this.onPressAddHost}>
                <Text style={styles.addWebHostButtonLabel}>Add</Text>
              </TouchableOpacity>
            </View>
            {hostRequirements}
          </View>
        )
      }

      return (
        <View style={styles.permissionRow} key={key}>
          <Text style={styles.permissonDescription}>
            {PERMISSIONS_DESCRIPTIONS[key]}
          </Text>
          {this.renderToggle(key, permissionSettings[key], this.onToggle)}
        </View>
      )
    })

    const errorLabel = this.state.errorMsg ? (
      <Text style={[styles.errorLabel, globalStyles.errorText]}>
        {this.state.errorMsg}
      </Text>
    ) : null

    return (
      <View>
        <Text>Set permission requirements for your App</Text>
        <ScrollView style={styles.listContainer}>
          {permissionOptions}
        </ScrollView>
        {errorLabel}
        <Button
          testID="set-permission-requirements"
          title="Save"
          onPress={this.onPressSave}
        />
      </View>
    )
  }
}

const PADDING = 10

const styles = StyleSheet.create({
  listContainer: {
    marginVertical: PADDING,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.LIGHT_GREY_E8,
    maxHeight: 350,
  },
  permissionRow: {
    flexDirection: 'row',
    padding: PADDING,
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GREY_E8,
    alignItems: 'center',
  },
  permissonDescription: {
    fontSize: 13,
    flex: 1,
    paddingRight: PADDING,
    color: colors.GREY_DARK_48,
  },
  toggleContainer: {
    flexDirection: 'row',
  },
  toggleLabel: {
    fontSize: 11,
    letterSpacing: 1,
    paddingVertical: 6,
    backgroundColor: colors.LIGHT_GREY_E8,
    color: colors.LIGHT_GREY_AE,
  },
  labelRight: {
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    paddingLeft: 6,
    paddingRight: 12,
  },
  labelLeft: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    paddingRight: 6,
    paddingLeft: 12,
  },
  leftToggle: {
    borderRightWidth: 1,
    borderRightColor: colors.LIGHT_GREY_F7,
  },
  activeToggle: {
    backgroundColor: colors.PRIMARY_BLUE,
    color: colors.WHITE,
  },
  webRequestsContainer: {
    padding: PADDING,
  },
  addWebHost: {
    flexDirection: 'row',
    marginTop: PADDING,
  },
  addWebHostButton: {
    padding: PADDING,
    marginLeft: PADDING,
    backgroundColor: colors.PRIMARY_BLUE,
    borderRadius: 3,
  },
  addWebHostButton: {
    color: colors.WHITE,
  },
  webHostRow: {
    padding: PADDING,
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GREY_E8,
    flexDirection: 'row',
  },
  webHostLabel: {
    flex: 1,
  },
  errorLabel: {
    paddingBottom: PADDING,
  },
})
