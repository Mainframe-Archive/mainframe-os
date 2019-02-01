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
import ContactPickerView, { type SelectedContactIDs } from './ContactPickerView'

import rpc from './rpc'
import type { AppSessionData } from './AppContainer'

type ContactSelectParams = {
  multi: boolean,
}

type GrantedData = {
  selectedContactIDs?: SelectedContactIDs,
}

type Request = {
  key: string,
  domain?: string,
  params?: WalletSignTxParams | ContactSelectParams,
  params: {
    BLOCKCHAIN_SEND?: WalletSignTxParams,
    CONTACTS_SELECT?: ContactSelectParams,
  },
}
type PermissionGrantResult = {
  granted: boolean,
  persist: boolean,
  data?: GrantedData,
}
type PermissionDeniedNotif = {
  key: string,
  domain?: string,
}

type Props = {
  appSession: AppSessionData,
}

type State = {
  permissionDeniedNotifs: Array<PermissionDeniedNotif>,
  permissionRequests: {
    [id: string]: {
      data: Request,
      responseRequired?: boolean,
      resolve: (result: PermissionGrantResult) => void,
    },
  },
  persistGrant: boolean,
}

const methods = {
  user_request: (ctx, request: Request): Promise<PermissionGrantResult> => {
    return new Promise(resolve => {
      ctx.setState(({ permissionRequests }) => ({
        permissionRequests: {
          ...permissionRequests,
          [uniqueID()]: {
            data: request,
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
  BLOCKCHAIN_SEND: 'make an Ethereum blockchain transaction',
  CONTACTS_READ: 'access contacts',
  CONTACTS_SELECT: 'select contacts',
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

export default class PermissionRequestView extends Component<Props, State> {
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

  onSetPermissionGrant = (id: string, granted: boolean, data?: GrantedData) => {
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

  onSelectedContacts = (id: string, selectedContactIDs: SelectedContactIDs) => {
    this.onSetPermissionGrant(id, true, { selectedContactIDs })
  }

  // RENDER

  renderDeniedNotifs() {
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

  renderTxSignRequest(requestID: string, request: Request) {
    const { params } = request
    const txView =
      !params || !params.BLOCKCHAIN_SEND ? (
        <Text>Invalid transaction data</Text>
      ) : (
        <WalletTxRequestView
          transaction={params.BLOCKCHAIN_SEND.transactionData}
        />
      )
    return (
      <>
        {txView}
        <View style={styles.buttonsContainer}>
          <Button
            title="ACCEPT"
            onPress={() => this.acceptPermission(requestID)}
            style={styles.acceptButton}
          />
          <Button
            title="DECLINE"
            onPress={() => this.declinePermission(requestID)}
            style={styles.declineButton}
          />
        </View>
      </>
    )
  }

  renderContactPicker(requestID: string, request: Request) {
    const { params } = request
    const { id } = this.props.appSession.user
    const multi =
      params && params.CONTACTS_SELECT ? params.CONTACTS_SELECT.multi : false
    return (
      <ContactPickerView
        userID={id}
        multiSelect={multi}
        onSelectedContacts={contacts =>
          this.onSelectedContacts(requestID, contacts)
        }
      />
    )
  }

  renderPermission(
    requestID: string,
    persistGrant: boolean,
    permissionLabel: string,
  ) {
    return (
      <View>
        <Text style={styles.headerText}>Permission Required</Text>
        <Text
          style={
            styles.descriptionText
          }>{`This app is asking permission to ${permissionLabel}.`}</Text>
        <View style={styles.persistOption}>
          <Text style={styles.persistLabel}>{`Don't ask me again?`}</Text>
          <Switch value={persistGrant} onValueChange={this.onTogglePersist} />
        </View>
        <View style={styles.buttonsContainer}>
          <Button
            title="ACCEPT"
            onPress={() => this.acceptPermission(requestID)}
            style={styles.acceptButton}
          />
          <Button
            title="DECLINE"
            onPress={() => this.declinePermission(requestID)}
            style={styles.declineButton}
          />
        </View>
      </View>
    )
  }

  renderContent = () => {
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

    if (permissionLabel == null) {
      return (
        <View style={styles.container}>
          <View style={styles.requestContainer}>
            <Text style={styles.headerText}>Unknown Permission</Text>
            <Text style={styles.descriptionText}>
              This app is asking for permission to perform an unknown request
            </Text>
            <View style={styles.buttonsContainer}>
              <Button
                title="DECLINE"
                onPress={() => this.declinePermission(id)}
                style={styles.declineButton}
              />
            </View>
          </View>
        </View>
      )
    }

    let content
    switch (permissionData.key) {
      case 'BLOCKCHAIN_SEND':
        content = this.renderTxSignRequest(id, permissionData)
        break
      case 'CONTACTS_SELECT':
        content = this.renderContactPicker(id, permissionData)
        break
      default:
        content = this.renderPermission(id, persistGrant, permissionLabel)
        break
    }

    return (
      <View style={styles.container}>
        <View style={styles.requestContainer}>{content}</View>
      </View>
    )
  }

  render() {
    const deniedNotifs = this.renderDeniedNotifs()
    const permissionRequest = this.renderContent()
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
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'fixed',
    backgroundColor: colors.TRANSPARENT_BLACK_50,
    height: '100%',
  },
  requestContainer: {
    backgroundColor: colors.GREY_DARK_3C,
    position: 'absolute',
    top: -30,
    right: 20,
    maxWidth: 360,
    minWidth: 280,
    padding: 20,
    marginLeft: 40,
    borderRadius: 3,
    shadowColor: colors.BLACK,
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  headerText: {
    fontWeight: 'bold',
    color: colors.LIGHT_GREY_CC,
    fontSize: 15,
  },
  descriptionText: {
    marginVertical: 6,
    fontSize: 13,
    color: colors.WHITE,
  },
  persistOption: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  persistLabel: {
    marginRight: 15,
    color: colors.LIGHT_GREY_CC,
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
