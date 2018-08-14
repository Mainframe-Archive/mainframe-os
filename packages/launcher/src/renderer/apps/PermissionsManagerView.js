// @flow

import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Switch } from 'react-native-web'
import { ipcRenderer } from 'electron'

import colors from '../colors'
import ModalView from '../UIComponents/ModalView'
import Text from '../UIComponents/Text'
import Button from '../UIComponents/Button'
import { channels, IPC_ERRORS } from '../../ipcRequest'
import type { AppSessionData } from './AppContainer'

type Props = {
  appSession: AppSessionData,
}

type State = {
  permissionRequest?: {
    id: string,
    data: Object,
    sender: Object,
  },
  persistGrant?: boolean,
}

const permissionDescriptions = {
  WEB3_SEND: 'make a transaction to Ethereum blockchain',
}

export default class PermissionsManagerView extends Component<Props, State> {
  state = {}

  componentDidMount() {
    this.handlePermissionRequest()
  }

  async handlePermissionRequest() {
    ipcRenderer.on(channels.mainToApp.request, (event, msg) => {
      if (!msg.data || !msg.data.method || !msg.data.args) {
        return {
          error: IPC_ERRORS.invalidRequest,
          id: msg.id,
        }
      }
      if (msg.data.method === 'permissions-ask') {
        this.setState({
          permissionRequest: {
            id: msg.id,
            data: msg.data,
            sender: event.sender,
          },
        })
      }
    })
  }

  onSetPermissionGrant = (granted: boolean) => {
    const { permissionRequest } = this.state
    if (permissionRequest) {
      ipcRenderer.send(channels.mainToApp.response, {
        id: permissionRequest.id,
        result: {
          granted,
          persist: !!this.state.persistGrant, // TODO
        },
      })
      this.setState({
        permissionRequest: undefined,
      })
    }
  }

  acceptPermission = () => {
    this.onSetPermissionGrant(true)
  }

  declinePermission = () => {
    this.onSetPermissionGrant(false)
  }

  onTogglePersist = (value: boolean) => {
    this.setState({
      persistGrant: value,
    })
  }

  render() {
    console.log(this.state.permissionRequest)
    const { permissionRequest, persistGrant } = this.state
    let content
    if (permissionRequest) {
      const key = permissionRequest.data.args[0]
      if (permissionDescriptions[key]) {
        const message = `This app is requesting to ${
          permissionDescriptions[key]
        }.`
        content = (
          <View style={styles.container}>
            <View style={styles.requestContainer}>
              <Text style={styles.headerText}>Permission Required</Text>
              <Text style={styles.descriptionText}>{message}</Text>
              <View style={styles.persistOption}>
                <Text style={styles.persistLabel}>{`Don't ask me again?`}</Text>
                <Switch
                  value={persistGrant}
                  onValueChange={this.onTogglePersist}
                />
              </View>
              <View style={styles.buttonsContainer}>
                <Button
                  title="ACCEPT"
                  onPress={this.acceptPermission}
                  style={styles.acceptButton}
                />
                <Button
                  title="DECLINE"
                  onPress={this.declinePermission}
                  style={styles.declineButton}
                />
              </View>
            </View>
          </View>
        )
      } else {
        content = (
          <View style={styles.container}>
            <View style={styles.requestContainer}>
              <Text style={styles.headerText}>Unknown Permission</Text>
              <Text style={styles.descriptionText}>
                This app is asking for permission to perform an unknown request
              </Text>
              <View style={styles.buttonsContainer}>
                <Button
                  title="DECLINE"
                  onPress={this.acceptPermission}
                  style={styles.declineButton}
                />
              </View>
            </View>
          </View>
        )
      }
    }
    return content || <View />
  }
}

const blueBGColor = 'rgba(14, 18, 28, 0.85)'

const styles = StyleSheet.create({
  container: {
    top: 25,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'fixed',
    backgroundColor: blueBGColor,
    height: '100%',
  },
  requestContainer: {
    backgroundColor: colors.LIGHT_GREY_F7,
    maxWidth: 300,
    padding: 15,
    marginLeft: 40,
  },
  headerText: {
    fontWeight: 'bold',
    color: colors.PRIMARY_BLUE,
    fontSize: 15,
  },
  descriptionText: {
    marginVertical: 6,
    fontSize: 13,
    color: colors.GREY_DARK_54,
  },
  persistOption: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  persistLabel: {
    marginRight: 15,
  },
  buttonsContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  acceptButton: {
    marginRight: 10,
    backgroundColor: colors.PRIMARY_LIGHT_BLUE,
  },
  declineButton: {
    backgroundColor: colors.GREY_MED_81,
  },
})
