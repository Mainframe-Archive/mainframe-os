// @flow

import { MANIFEST_SCHEMA_MESSAGES } from '@mainframe/app-manifest'
import createHandler from '@mainframe/rpc-handler'
import { uniqueID } from '@mainframe/utils-id'
import { ipcRenderer } from 'electron'
import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Text, Button, Checkbox } from '@morpheus-ui/core'
import { hexToUtf8, isHex } from 'web3-utils'
import { type EthClient, truncateAddress } from '@mainframe/eth'

import type { Subscription } from 'rxjs'
import type {
  WalletEthSignTxParams,
  WalletEthSignParams,
} from '@mainframe/client'

import ContactsIcon from '@morpheus-ui/icons/ContactsFilledMd'

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
  params?: WalletEthSignTxParams | ContactSelectParams,
  params: {
    BLOCKCHAIN_SEND?: WalletEthSignTxParams,
    BLOCKCHAIN_SIGN?: WalletEthSignParams,
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
  multipleWallets?: ?boolean,
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
  BLOCKCHAIN_SIGN: 'sign a message with Ethereum wallet',
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  background-color: transparent;
  height: 100%;
`

const RequestContainer = styled.View`
  background-color: ${props => props.theme.colors.GREY_DARK_3C};
  position: absolute;
  top: 30px;
  right: 102px;
  width: 250px;
  border-radius: 3px;
  shadow-color: ${props => props.theme.colors.BLACK};
  shadow-opacity: 0.2;
  shadow-radius: 8;
  overflow: hidden;
  ${props => props.wallet && 'right: 5px'};
  ${props => props.large && 'width: 340px'};
`

const ContentContainer = styled.View`
  padding: 20px;
`

const TitleContainer = styled.Text`
  display: flex;
  color: #808080;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #303030;
  padding: 0 20px;
  height: 47px;
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

const MessageSignContainer = styled.ScrollView`
  background-color: #585858;
  border-radius: 3px;
  padding: 10px;
  max-height: 200px;
  margin-top: 12px;
`

const FromContainer = styled.View`
  flex-direction: 'row';
`

const ErrorMsgContainer = styled.View`
  padding: 10px;
  background-color: #303030;
`

export default class UserAlertView extends Component<Props, State> {
  state = {
    permissionDeniedNotifs: [],
    requests: {},
    persistGrant: false,
    multipleWallets: false,
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

  renderButtons(requestID: string, acceptEnabled: boolean) {
    const acceptButton = acceptEnabled ? (
      <Button
        variant={['TuiButton']}
        title="AUTHORIZE"
        onPress={() => this.acceptPermission(requestID)}
      />
    ) : null
    return (
      <ButtonsContainer>
        <Button
          variant={['TuiButton', 'TuiButtonDismiss']}
          title="REJECT"
          onPress={() => this.declinePermission(requestID)}
        />
        {acceptButton}
      </ButtonsContainer>
    )
  }

  renderSignMessageRequest(requestID: string, request: Request) {
    const { params } = request
    let valid = false
    let content
    if (!params || !params.BLOCKCHAIN_SIGN) {
      content = (
        <ErrorMsgContainer>
          <Text variant="error">No data to sign</Text>
        </ErrorMsgContainer>
      )
    } else if (!isHex(params.BLOCKCHAIN_SIGN.data)) {
      content = (
        <ErrorMsgContainer>
          <Text variant="error">
            Invalid hex value for message signing: {params.BLOCKCHAIN_SIGN.data}
          </Text>
        </ErrorMsgContainer>
      )
    } else {
      // $FlowFixMe null checked above
      const address = truncateAddress(params.BLOCKCHAIN_SIGN.address)
      // $FlowFixMe null checked above
      const message = hexToUtf8(params.BLOCKCHAIN_SIGN.data)
      valid = true
      content = (
        <>
          <FromContainer>
            <Text color="#9A9A9A" variant={['size13', 'bold']}>
              From:{' '}
            </Text>
            <Text color="#9A9A9A" variant={['size13']}>
              {address}
            </Text>
          </FromContainer>
          <Text color="#9A9A9A" variant={['size13', 'bold', 'marginTop10']}>
            Message:
          </Text>
          <MessageSignContainer>
            <Text color="#FFF">{message}</Text>
          </MessageSignContainer>
        </>
      )
    }
    return (
      <>
        <TitleContainer>
          <Text variant="TuiHeader">Sign Message</Text>
          <BellIcon width={24} height={24} />
        </TitleContainer>
        <ContentContainer>
          {content}
          {this.renderButtons(requestID, valid)}
        </ContentContainer>
      </>
    )
  }

  renderTxSignRequest(requestID: string, request: Request) {
    const { params } = request
    const txView =
      !params || !params.BLOCKCHAIN_SEND ? (
        <Text>Invalid transaction data</Text>
      ) : (
        <WalletTxRequestView
          transaction={params.BLOCKCHAIN_SEND}
          ethClient={this.props.ethClient}
        />
      )
    return (
      <>
        <TitleContainer>
          <Text variant="TuiHeader">Sign Transaction</Text>
          <BellIcon width={24} height={24} />
        </TitleContainer>
        <ContentContainer>
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
        </ContentContainer>
      </>
    )
  }

  renderContactPicker(requestID: string, request: Request) {
    const { params } = request
    const { id } = this.props.appSession.user
    const multi =
      params && params.CONTACTS_SELECT ? params.CONTACTS_SELECT.multi : false
    return (
      <>
        <TitleContainer>
          <Text variant="TuiHeader">Contacts</Text>
          <ContactsIcon width={26} height={24} />
        </TitleContainer>
        <ContactPickerView
          userID={id}
          multiSelect={multi}
          onReject={() => this.declinePermission(requestID)}
          onSelectedContacts={contacts =>
            this.onSelectedContacts(requestID, contacts)
          }
        />
      </>
    )
  }

  renderWalletPicker(requestID: string) {
    return this.props.multipleWallets ? (
      <>
        <TitleContainer>
          <Text variant="TuiHeader">Wallets</Text>
          <WalletIcon width={24} height={24} />
        </TitleContainer>
        <WalletPickerView
          onSelectedWalletAccount={address =>
            this.onSelectedWalletAccount(requestID, address)
          }
        />
      </>
    ) : null
  }

  renderPermission(
    requestID: string,
    persistGrant: boolean,
    permissionLabel: string,
  ) {
    return (
      <>
        <TitleContainer>
          <Text variant="TuiHeader">App Permissions</Text>
          <LockerIcon width={17} height={24} color="#808080" />
        </TitleContainer>
        <ContentContainer>
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

    let content, wallet, large
    if (permissionLabel == null) {
      content = (
        <>
          <TitleContainer>
            <Text variant="TuiHeader">App Permissions</Text>
            <BellIcon width={24} height={24} color="#808080" />
          </TitleContainer>
          <ContentContainer>
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
        </>
      )
    } else {
      switch (requestData.key) {
        case 'BLOCKCHAIN_SEND':
          large = true
          content = this.renderTxSignRequest(id, requestData)
          break
        case 'BLOCKCHAIN_SIGN':
          large = true
          content = this.renderSignMessageRequest(id, requestData)
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
        <RequestContainer
          large={large}
          wallet={wallet || !this.props.multipleWallets}>
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
