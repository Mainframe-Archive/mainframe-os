// @flow

import { MANIFEST_SCHEMA_MESSAGES } from '@mainframe/app-manifest'
import createHandler from '@mainframe/rpc-handler'
import { uniqueID } from '@mainframe/utils-id'
import { ipcRenderer } from 'electron'
import React, { Component } from 'react'
import { View, StyleSheet, Switch } from 'react-native-web'
import type { Subscription } from 'rxjs'
import type { WalletSignTxParams } from '@mainframe/client'

import { APP_TRUSTED_REQUEST_CHANNEL } from '../../constants'

import colors from '../colors'
import Text from '../UIComponents/Text'
import Button from '../UIComponents/Button'
import WalletTxRequestView from './WalletTxRequestView'

import rpc from './rpc'
import type { AppSessionData } from './AppContainer'

type PermissionGrantData = {
  key: string,
  domain?: string,
  params?: WalletSignTxParams,
}
type PermissionGrantResult = {
  granted: boolean,
  persist: boolean,
  data?: ?Object,
}
type PermissionDeniedNotif = {
  key: string,
  domain?: string,
}

const methods = {
  permission_ask: (
    ctx,
    params: PermissionGrantData,
  ): Promise<PermissionGrantResult> => {
    return new Promise(resolve => {
      ctx.setState(({ permissionRequests }) => ({
        permissionRequests: {
          ...permissionRequests,
          [uniqueID()]: {
            data: params,
            resolve,
          },
        },
      }))
    })
  },
}
const validatorOptions = { messages: MANIFEST_SCHEMA_MESSAGES }
const handleMessage = createHandler({ methods, validatorOptions })

const permissionDescriptions = {
  BLOCKCHAIN_SEND: 'Ethereum blockchain transaction',
}
const getPermissionDescription = (key: string, input?: ?string): ?string => {
  if (key === 'WEB_REQUEST' && input) {
    return `web request to ${input}`
  }
  if (permissionDescriptions[key]) {
    return permissionDescriptions[key]
  }
  return null
}

type Props = {
  appSession: AppSessionData,
}

type State = {
  permissionDeniedNotifs: Array<PermissionDeniedNotif>,
  permissionRequests: {
    [id: string]: {
      data: PermissionGrantData,
      resolve: (result: PermissionGrantResult) => void,
    },
  },
  persistGrant: boolean,
}

export default class PermissionsManagerView extends Component<Props, State> {
  state = {
    permissionDeniedNotifs: [],
    permissionRequests: {},
    persistGrant: false,
  }

  _onRPCMessage: (Object, Object) => Promise<void>
  _permissionDeniedSubscription: ?Subscription

  constructor(props: Props) {
    super(props)
    this.handleNotifications()
    this.handlePermissionRequest()
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(APP_TRUSTED_REQUEST_CHANNEL, this._onRPCMessage)
    if (this._permissionDeniedSubscription != null) {
      this._permissionDeniedSubscription.unsubscribe()
    }
  }

  async handleNotifications() {
    const notifications = await rpc.createPermissionDeniedSubscription()
    this._permissionDeniedSubscription = notifications.subscribe(
      (data: PermissionDeniedNotif) => {
        this.setState(
          ({ permissionDeniedNotifs }) => ({
            permissionDeniedNotifs: [...permissionDeniedNotifs, data],
          }),
          () => {
            setTimeout(() => {
              this.setState(({ permissionDeniedNotifs: notifs }) => {
                const index = notifs.indexOf(data)
                if (index > -1) {
                  notifs.splice(index, 1)
                  return {
                    permissionDeniedNotifs: notifs,
                  }
                }
              })
            }, 3000)
          },
        )
      },
    )
  }

  handlePermissionRequest() {
    const context = { setState: this.setState.bind(this) }
    this._onRPCMessage = async (event: Object, incoming: Object) => {
      const outgoing = await handleMessage(context, incoming)
      if (outgoing != null) {
        ipcRenderer.send(APP_TRUSTED_REQUEST_CHANNEL, outgoing)
      }
    }
    ipcRenderer.on(APP_TRUSTED_REQUEST_CHANNEL, this._onRPCMessage)
  }

  onSetPermissionGrant = (id: string, granted: boolean, data?: ?Object) => {
    const request = this.state.permissionRequests[id]

    if (request != null) {
      request.resolve({
        granted,
        data,
        persist: this.state.persistGrant,
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
    const alerts = this.state.permissionDeniedNotifs.map((data, i) => (
      <Text key={`alert${i}`} style={styles.permissionDeniedLabel}>
        <Text style={styles.boldText}>Blocked:</Text>{' '}
        {getPermissionDescription(data.key, data.domain)}
      </Text>
    ))
    return alerts.length ? (
      <View style={styles.permissionDeniedAlerts}>{alerts}</View>
    ) : null
  }

  renderTxSignRequest(permissionData: PermissionGrantData) {
    if (permissionData.params == null) {
      // TODO display error
      return null
    }
    return (
      <WalletTxRequestView
        transaction={permissionData.params.transactionData}
      />
    )
  }

  renderPermission(persistGrant: boolean, permissionLabel: string) {
    return (
      <View>
        <Text style={styles.headerText}>Permission Required</Text>
        <Text
          style={
            styles.descriptionText
          }>{`This app is asking permission to make a ${permissionLabel}.`}</Text>
        <View style={styles.persistOption}>
          <Text style={styles.persistLabel}>{`Don't ask me again?`}</Text>
          <Switch value={persistGrant} onValueChange={this.onTogglePersist} />
        </View>
      </View>
    )
  }

  renderPermissionRequest = () => {
    const { persistGrant, permissionRequests } = this.state
    const keys = Object.keys(permissionRequests)

    if (keys.length === 0) {
      return null
    }

    const id = keys[0]
    const permissionData = permissionRequests[id].data
    const permissionLabel = getPermissionDescription(
      permissionData.key,
      permissionData.domain,
    )

    const declineButton = (
      <Button
        title="DECLINE"
        onPress={() => this.declinePermission(id)}
        style={styles.declineButton}
      />
    )

    if (permissionLabel == null) {
      return (
        <View style={styles.container}>
          <View style={styles.requestContainer}>
            <Text style={styles.headerText}>Unknown Permission</Text>
            <Text style={styles.descriptionText}>
              This app is asking for permission to perform an unknown request
            </Text>
            <View style={styles.buttonsContainer}>{declineButton}</View>
          </View>
        </View>
      )
    }

    let content

    if (permissionData.key === 'BLOCKCHAIN_SEND') {
      content = this.renderTxSignRequest(permissionData)
    } else {
      content = this.renderPermission(persistGrant, permissionLabel)
    }

    return (
      <View style={styles.container}>
        <View style={styles.requestContainer}>
          {content}
          <View style={styles.buttonsContainer}>
            <Button
              title="ACCEPT"
              onPress={() => this.acceptPermission(id)}
              style={styles.acceptButton}
            />
            {declineButton}
          </View>
        </View>
      </View>
    )
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
    flex: 1,
    backgroundColor: colors.PRIMARY_LIGHT_BLUE,
  },
  declineButton: {
    flex: 1,
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
