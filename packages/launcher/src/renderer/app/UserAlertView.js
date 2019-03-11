// @flow

import { MANIFEST_SCHEMA_MESSAGES } from '@mainframe/app-manifest'
import createHandler from '@mainframe/rpc-handler'
import { uniqueID } from '@mainframe/utils-id'
import { ipcRenderer } from 'electron'
import React, { Component } from 'react'
import { View, StyleSheet, Switch } from 'react-native-web'
import type { Subscription } from 'rxjs'
import type { WalletSignTxParams } from '@mainframe/client'
import { type EthClient } from '@mainframe/eth'

import { APP_TRUSTED_REQUEST_CHANNEL } from '../../constants'

import colors from '../colors'
import Text from '../UIComponents/Text'
import Button from '../UIComponents/Button'
import WalletTxRequestView from './WalletTxRequestView'
import ContactPickerView, { type SelectedContactIDs } from './ContactPickerView'
import WalletPickerView from './WalletPickerView'

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

type PersistOption = 'always' | 'session'

type PermissionGrantResult = {
  granted: boolean,
  persist: ?PersistOption,
  data?: GrantedData,
}
type PermissionDeniedNotif = {
  key: string,
  domain?: string,
}

type Props = {
  appSession: AppSessionData,
  ethClient: EthClient,
}

type PendingRequest = {
  id: string,
  data: Request,
  responseRequired?: boolean,
  resolve: (result: PermissionGrantResult) => void,
}

type State = {
  permissionDeniedNotifs: Array<PermissionDeniedNotif>,
  requests: {
    [id: string]: PendingRequest,
  },
  persistGrant: boolean,
}

const methods = {
  user_request: (ctx, request: Request): Promise<PermissionGrantResult> => {
    return new Promise(resolve => {
      const id = uniqueID()
      ctx.setState(({ requests }) => ({
        requests: {
          ...requests,
          [id]: {
            id,
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
  WALLET_ACCOUNT_SELECT: 'select wallets',
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

export default class UserAlertView extends Component<Props, State> {
  state = {
    permissionDeniedNotifs: [],
    requests: {},
    persistGrant: false,
  }

  _onRPCMessage: (Object, Object) => Promise<void>
  _permissionDeniedSubscription: ?Subscription

  constructor(props: Props) {
    super(props)
    this.handleNotifications()
    this.handleRequest()
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

  handleRequest() {
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
    const request = this.state.requests[id]
    if (request != null) {
      let requestsToResolve = [request]
      if (request.data.key === 'WEB_REQUEST') {
        // Resolve web requests with same domain
        // $FlowFixMe mixed type
        const requests: Array<PendingRequest> = Object.values(
          this.state.requests,
        )
        const duplicateRequests = requests.filter(
          r =>
            r.data.key === 'WEB_REQUEST' &&
            r.data.domain === request.data.domain &&
            r.id !== id,
        )
        requestsToResolve = requestsToResolve.concat(duplicateRequests)
      }
      requestsToResolve.forEach(r => {
        r.resolve({
          granted,
          data,
          persist: this.state.persistGrant ? 'always' : 'session',
        })
      })

      this.setState(({ requests }) => {
        requestsToResolve.forEach(r => {
          delete requests[r.id]
        })
        return { requests, persistGrant: false }
      })
    }
  }

  resolveRequest(id: string, response: Object) {
    const request = this.state.requests[id]

    if (request != null) {
      request.resolve(response)
      this.setState(({ requests }) => {
        const { [id]: _ignore, ...nextRequests } = requests
        return { requests: nextRequests, persistGrant: false }
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

  onSelectedWalletAccount = (id: string, address: string) => {
    this.resolveRequest(id, {
      data: { address },
    })
  }

  onPressBG = () => {
    Object.keys(this.state.requests).forEach(id => {
      this.resolveRequest(id, {})
    })
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
          ethClient={this.props.ethClient}
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

  renderWalletPicker(requestID: string) {
    return (
      <WalletPickerView
        onSelectedWalletAccount={address =>
          this.onSelectedWalletAccount(requestID, address)
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
    const { persistGrant, requests } = this.state
    const keys = Object.keys(requests)

    if (keys.length === 0) {
      return null
    }

    const id = keys[0]
    const requestData = requests[id].data
    const permissionLabel = getPermissionDescription(
      requestData.key,
      requestData.domain,
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
    switch (requestData.key) {
      case 'BLOCKCHAIN_SEND':
        content = this.renderTxSignRequest(id, requestData)
        break
      case 'CONTACTS_SELECT':
        content = this.renderContactPicker(id, requestData)
        break
      case 'WALLET_ACCOUNT_SELECT':
        content = this.renderWalletPicker(id)
        break
      default:
        content = this.renderPermission(id, persistGrant, permissionLabel)
        break
    }

    return (
      <>
        <View style={styles.container} onClick={this.onPressBG} />
        <View style={styles.requestContainer}>{content}</View>
      </>
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
    top: -35,
    right: 5,
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
    maxWidth: 300,
  },
  permissionDeniedLabel: {
    fontSize: 11,
    backgroundColor: colors.TRANSPARENT_BLACK_80,
    color: colors.LIGHT_GREY_E5,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  boldText: {
    fontWeight: 'bold',
  },
})
