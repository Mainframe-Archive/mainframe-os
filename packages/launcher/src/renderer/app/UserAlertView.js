// @flow

import { MANIFEST_SCHEMA_MESSAGES } from '@mainframe/app-manifest'
import createHandler from '@mainframe/rpc-handler'
import { uniqueID } from '@mainframe/utils-id'
import { ipcRenderer } from 'electron'
import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Text, Button, Checkbox } from '@morpheus-ui/core'

import type { Subscription } from 'rxjs'
import type { WalletSignTxParams } from '@mainframe/client'
import { type EthClient } from '@mainframe/eth'

import ContactsIcon from '@morpheus-ui/icons/ContactsMd'

import { APP_TRUSTED_REQUEST_CHANNEL } from '../../constants'

import BellIcon from '../UIComponents/Icons/BellIcon'
import WalletIcon from '../UIComponents/Icons/Wallet'
import LockerIcon from '../UIComponents/Icons/LockerIcon'

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

const Container = styled.View`
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  background-color: ${props => props.theme.colors.TRANSPARENT_BLACK_50};
  height: 100%;
`

const RequestContainer = styled.View`
  background-color: ${props => props.theme.colors.GREY_DARK_3C};
  position: absolute;
  top: 25px;
  right: 45px;
  width: 250px;
  border-radius: 3px;
  shadow-color: ${props => props.theme.colors.BLACK};
  shadow-opacity: 0.2;
  shadow-radius: 8;
  ${props => props.wallet && 'right: 5px'};
`

const ContentContainer = styled.View`
  padding: 0 20px 20px 20px;
`

const IconContainer = styled.Text`
  display: flex;
  flex-direction: column;
  color: #f1f0f0;
  width: 100%;
  padding: 3px;
  align-items: flex-end;
`

const TitleContainer = styled.Text`
  display: flex;
  color: #808080;
  width: 100%;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`

const ButtonsContainer = styled.View`
  margin-top: 20px;
  flex-direction: row;
  justify-content: center;
`

const PermissionDeniedAlert = styled.View`
  top: 60px;
  right: 0;
  bottom: 0;
  position: absolute;
  max-width: 300px;
`
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
      <Text key={`alert${i}`} variant="TuiPermissionDeniedLabel">
        <Text size={11} color="white" bold>
          Blocked:
        </Text>{' '}
        {getPermissionDescription(data.key, data.domain)}
      </Text>
    ))
    return alerts.length ? (
      <PermissionDeniedAlert>{alerts}</PermissionDeniedAlert>
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
        <ButtonsContainer>
          <Button
            variant={['TuiButton', 'TuiButtonDismiss']}
            title="REJECT"
            onPress={() => this.declinePermission(requestID)}
          />
          <Button
            variant={['TuiButton']}
            title="AUTHORIZE"
            onPress={() => this.acceptPermission(requestID)}
          />
        </ButtonsContainer>
      </>
    )
  }

  renderContactPicker(requestID: string, request: Request) {
    const { params } = request
    const { id } = this.props.appSession.user
    const multi =
      params && params.CONTACTS_SELECT ? params.CONTACTS_SELECT.multi : false
    return (
      <ContentContainer>
        <TitleContainer>
          <ContactsIcon width={26} height={24} />
          <Text variant={['marginHorizontal10', 'TuiHeader']}>Contacts</Text>
        </TitleContainer>
        <ContactPickerView
          userID={id}
          multiSelect={multi}
          onReject={() => this.declinePermission(requestID)}
          onSelectedContacts={contacts =>
            this.onSelectedContacts(requestID, contacts)
          }
        />
      </ContentContainer>
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
      <>
        <ContentContainer>
          <TitleContainer>
            <LockerIcon width={17} height={24} />
            <Text variant={['marginHorizontal10', 'TuiHeader']}>
              App Permissions
            </Text>
          </TitleContainer>
          <Text color="#FFF" size={13}>
            {`${
              this.props.appSession.app.manifest.name
            } is requesting access to ${permissionLabel}.`}
          </Text>
          <Checkbox
            variant="TrustedUI"
            defaultValue={persistGrant}
            onChange={this.onTogglePersist}
            label="Don't ask me again?"
          />
          <ButtonsContainer>
            <Button
              variant={['TuiButton', 'TuiButtonDismiss']}
              title="REJECT"
              onPress={() => this.declinePermission(requestID)}
            />
            <Button
              variant={['TuiButton']}
              title="AUTHORIZE"
              onPress={() => this.acceptPermission(requestID)}
            />
          </ButtonsContainer>
        </ContentContainer>
      </>
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

    let content, wallet
    if (permissionLabel == null) {
      content = (
        <ContentContainer>
          <TitleContainer>
            <LockerIcon width={17} height={24} />
            <Text variant={['marginHorizontal10', 'TuiHeader']}>
              App Permissions
            </Text>
          </TitleContainer>
          <Text color="#FFF" size={13}>
            {`${
              this.props.appSession.app.manifest.name
            } is asking for permission to perform an unknown request`}
          </Text>
          <ButtonsContainer>
            <Button
              variant={['TuiButton']}
              title="DECLINE"
              onPress={() => this.declinePermission(id)}
            />
          </ButtonsContainer>
        </ContentContainer>
      )
    } else {
      switch (requestData.key) {
        case 'BLOCKCHAIN_SEND':
          content = this.renderTxSignRequest(id, requestData)
          break
        case 'CONTACTS_SELECT':
          content = this.renderContactPicker(id, requestData)
          break
        case 'WALLET_ACCOUNT_SELECT':
          content = this.renderWalletPicker(id)
          wallet = true
          break
        default:
          content = this.renderPermission(id, persistGrant, permissionLabel)
          break
      }
    }

    return (
      <>
        <Container onClick={this.onPressBG} />
        <RequestContainer wallet={wallet}>
          <IconContainer>
            {wallet ? (
              <WalletIcon width={33} height={33} />
            ) : (
              <BellIcon width={33} height={33} />
            )}
          </IconContainer>
          {content}
        </RequestContainer>
      </>
    )
  }

  render() {
    const deniedNotifs = this.renderDeniedNotifs()
    const permissionRequest = this.renderContent()
    return (
      <>
        {permissionRequest}
        {deniedNotifs}
      </>
    )
  }
}
