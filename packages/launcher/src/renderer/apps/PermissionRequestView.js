// @flow

import React, { Component } from 'react'
import { View, StyleSheet, Switch } from 'react-native-web'
import { ipcRenderer } from 'electron'
import createHandler from '@mainframe/rpc-handler'
import { MANIFEST_SCHEMA_MESSAGES } from '@mainframe/app-manifest'

import type { Notification } from '../../types'
import colors from '../colors'
import Text from '../UIComponents/Text'
import Button from '../UIComponents/Button'
import type { AppSessionData } from './AppContainer'

type Props = {
  appSession: AppSessionData,
}

type State = {
  permissionRequests: {
    [id: string]: {
      id: string,
      data: Object,
      sender: Object,
    },
  },
  permissionDeniedNotifs: {
    [string]: ?{
      key: string,
      input: ?string,
    },
  },
  persistGrant?: boolean,
}

const permissionDescriptions = {
  BLOCKCHAIN_SEND: 'Ethereum blockchain transaction',
}

const getPermissionDescription = (key: string, input: ?string): ?string => {
  if (key === 'WEB_REQUEST' && input) {
    return `web request to ${input}`
  }
  if (permissionDescriptions[key]) {
    return permissionDescriptions[key]
  }
  return null
}

export default class PermissionsManagerView extends Component<Props, State> {
  state: State = {
    permissionDeniedNotifs: {},
    permissionRequests: {},
  }
  notifListener: (Object, Notification) => void
  mainProcListener: (Object, Object) => Promise<any>

  componentDidMount() {
    this.handlePermissionRequest()
    this.handleNotifications()
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('notify-app', this.notifListener)
    ipcRenderer.removeListener('rpc-trusted', this.mainProcListener)
  }

  handleNotifications() {
    this.notifListener = (event: Object, msg: Notification) => {
      if (msg.type === 'permission-denied') {
        const notifs = this.state.permissionDeniedNotifs
        notifs[msg.id] = msg.data
        this.setState(
          ({ permissionDeniedNotifs }) => ({
            permissionDeniedNotifs: {
              ...permissionDeniedNotifs,
              [msg.id]: msg.data,
            },
          }),
          () => {
            setTimeout(() => {
              this.setState(({ permissionDeniedNotifs }) => {
                const { [msg.id]: _ignore, ...notifs } = permissionDeniedNotifs
                return { permissionDeniedNotifs: notifs }
              })
            }, 3000)
          },
        )
      }
    }
    ipcRenderer.on('notify-app', this.notifListener)
  }

  async handlePermissionRequest() {
    const methods = {
      permissionsAsk: (ctx, data) => {
        this.setState(({ permissionRequests }) => ({
          permissionRequests: {
            ...permissionRequests,
            [ctx.requestID]: {
              id: ctx.requestID,
              data: data,
              sender: ctx.sender,
            },
          },
        }))
      },
    }
    const validatorOptions = { messages: MANIFEST_SCHEMA_MESSAGES }

    const handleMessage = createHandler({ methods, validatorOptions })

    this.mainProcListener = async (event: Object, incoming: Object) => {
      await handleMessage(
        {
          sender: event.sender,
          requestID: incoming.id,
        },
        incoming,
      )
    }

    ipcRenderer.on('rpc-trusted', this.mainProcListener)
  }

  onSetPermissionGrant = (id: string, granted: boolean) => {
    const { permissionRequests } = this.state
    const request = permissionRequests[id]
    if (request) {
      request.sender.send('rpc-trusted', {
        id: request.id,
        result: {
          granted,
          persist: !!this.state.persistGrant,
        },
      })
      this.setState(({ permissionRequests }) => {
        const { [id]: _ignore, ...requests } = permissionRequests
        return { permissionRequests: requests, persistGrant: false }
      })
    }
  }

  acceptPermission = (id: string) => {
    this.onSetPermissionGrant(id, true)
  }

  declinePermission = (id: string) => {
    this.onSetPermissionGrant(id, false)
  }

  onTogglePersist = (value: boolean) => {
    this.setState({
      persistGrant: value,
    })
  }

  renderDeniedNotifs = () => {
    const { permissionDeniedNotifs } = this.state
    const alerts = Object.keys(permissionDeniedNotifs).map(k => {
      const notif = permissionDeniedNotifs[k]
      if (notif) {
        const label = getPermissionDescription(notif.key, notif.input)
        return (
          <Text key={k} style={styles.permissionDeniedLabel}>
            <Text style={styles.boldText}>Blocked:</Text> {label}
          </Text>
        )
      }
      return null
    })
    return alerts.length ? (
      <View style={styles.permissionDeniedAlerts}>{alerts}</View>
    ) : null
  }

  renderPermissionRequest = () => {
    const { persistGrant, permissionRequests } = this.state
    const keys = Object.keys(permissionRequests)
    let request
    if (keys.length) {
      const permissionRequest = this.state.permissionRequests[keys[0]]
      const key = permissionRequest.data.key
      const input = permissionRequest.data.input
      const permissionLabel = getPermissionDescription(key, input)
      const accept = () => this.acceptPermission(permissionRequest.id)
      const decline = () => this.declinePermission(permissionRequest.id)
      if (permissionLabel) {
        const message = `This app is asking permission to make a ${permissionLabel}.`
        request = (
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
                  onPress={accept}
                  style={styles.acceptButton}
                />
                <Button
                  title="DECLINE"
                  onPress={decline}
                  style={styles.declineButton}
                />
              </View>
            </View>
          </View>
        )
      } else {
        request = (
          <View style={styles.container}>
            <View style={styles.requestContainer}>
              <Text style={styles.headerText}>Unknown Permission</Text>
              <Text style={styles.descriptionText}>
                This app is asking for permission to perform an unknown request
              </Text>
              <View style={styles.buttonsContainer}>
                <Button
                  title="DECLINE"
                  onPress={decline}
                  style={styles.declineButton}
                />
              </View>
            </View>
          </View>
        )
      }
    }
    return request
  }

  render() {
    const deniedNotifs = this.renderDeniedNotifs()
    const permissionRequest = this.renderPermissionRequest()
    return (
      <View>
        {permissionRequest}
        {deniedNotifs}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    top: 25,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'fixed',
    backgroundColor: colors.TRANSPARENT_BLUE_BG,
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
  permissionDeniedAlerts: {
    top: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
  },
  permissionDeniedLabel: {
    fontSize: 11,
    backgroundColor: colors.TRANSPARENT_BLUE_BG,
    color: colors.LIGHT_GREY_BLUE,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  boldText: {
    fontWeight: 'bold',
  },
})
