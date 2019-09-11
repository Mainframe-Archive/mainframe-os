// @flow

import {
  Text,
  Button,
  Row,
  Column,
  TextField,
  Tooltip,
  RadioGroup,
  Radio,
} from '@morpheus-ui/core'
import { type FormSubmitPayload } from '@morpheus-ui/forms'
import PlusIcon from '@morpheus-ui/icons/PlusSymbolSm'
import SearchIcon from '@morpheus-ui/icons/SearchSm'
import { shell } from 'electron'
import { utils } from 'ethers'
import { debounce } from 'lodash'
import memoize from 'memoize-one'
import React, { Component } from 'react'
import styled from 'styled-components/native'
import {
  graphql,
  commitMutation,
  createFragmentContainer,
  // $FlowFixMe: requestSubscription not present in Flow definition but exported by library
  requestSubscription,
  type Disposable,
  type Environment,
} from 'react-relay'
import { fetchQuery } from 'relay-runtime'

import { isValidPeerID } from '../../../validation'

import Avatar from '../../UIComponents/Avatar'
import SvgSelectedPointer from '../../UIComponents/SVGSelectedPointer'
import FormModalView from '../../UIComponents/FormModalView'
import Loader from '../../UIComponents/Loader'
import CopyableBlock from '../CopyableBlock'
import { InformationBox } from '../identities/IdentitiesView'
import RelayRenderer from '../RelayRenderer'
import InviteContactModal, {
  type ContactInfo,
  type TransactionType,
} from './InviteContactModal'
import Notification from './Notification'

import type { ContactsScreen_user as User } from './__generated__/ContactsScreen_user.graphql'

type ItemType<U> = $Call<<T>($ReadOnlyArray<T>) => T, U>
type Contact = ItemType<$PropertyType<User, 'contacts'>>
type ContactRequest = ItemType<$PropertyType<User, 'contactRequests'>>
type EthWallets = $PropertyType<User, 'ethWallets'>

const SvgSmallClose = props => (
  <svg width="10" height="10" viewBox="0 0 10 10" {...props}>
    <path
      d="M8.54 8.538A4.977 4.977 0 0 1 5 10.004c-1.335 0-2.59-.52-3.533-1.463a5.014 5.014 0 0 1-.001-7.077A4.969 4.969 0 0 1 5 0c1.336 0 2.594.521 3.54 1.468a4.967 4.967 0 0 1 1.465 3.535A4.97 4.97 0 0 1 8.54 8.538zM6.839 3.165a.5.5 0 0 0-.707 0L4.985 4.312 3.838 3.165a.5.5 0 0 0-.707.707L4.278 5.02 3.13 6.166a.5.5 0 0 0 .707.707l1.147-1.147 1.147 1.147a.497.497 0 0 0 .707 0 .5.5 0 0 0 0-.707L5.692 5.02l1.147-1.147a.5.5 0 0 0 0-.707z"
      fill="#1F3464"
      fillRule="evenodd"
    />
  </svg>
)

const RevertNameButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const Container = styled.View`
  position: relative;
  flex-direction: row;
  padding: 0;
`

const ContactsListContainer = styled.View`
  position: relative;
  width: 260px;
  padding: 60px 0 0 10px;
  height: 100vh;
  position: absolute;
  z-index: 1;
`

const ContactCard = styled.TouchableOpacity`
  min-height: 50px;
  padding: 8px 10px 8px 10px;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #f5f5f5;

  ${props => props.selected && `background-color: #E8EBF0;`}
`

const SelectedPointer = styled.View`
  width: 21px;
  height: 42px;
  position: absolute;
  right: -3px;
  top: 50%;
  margin-top: -21px;
  z-index: 9;
`

const ContactCardText = styled.View`
  flex: 1;
  min-height: 34px;
  justify-content: space-around;
`

const ViewTransaction = styled.TouchableOpacity``

const RightContainer = styled.View`
  flex: 1;
  padding: 25px 25px 25px 40px;
  border-left-width: 1px;
  border-left-style: solid;
  border-left-color: #f5f5f5;
  height: 100vh;
  width: 100%;
  margin-left: 259px;
`

const ContactsListHeader = styled.View`
  position: absolute;
  top: 0;
  padding: 18px 3px;
  width: 100%;
  height: 60px;
  flex-direction: row;
  ${props =>
    props.hascontacts &&
    `
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #f5f5f5;`}
`

const ButtonContainer = styled.View`
  margin-right: 10px;
`
const NoContacts = styled.View`
  flex: 1;
  align-items: center;
  margin-top: 30vh;
  margin-left: -40px;
`
const ScrollView = styled.View`
  flex: 1;
  overflow-y: auto;
`

const FormContainer = styled.View`
  margin-top: 20px;
  max-width: 450px;

  ${props =>
    props.modal &&
    `
    flex: 1;
    width: 100%;
    align-self: center;
    align-items: center;
    justify-content: center;
    `}
`

const AvatarWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  ${props =>
    props.marginTop &&
    `  margin-bottom: 0px;
    margin-top: 10px;
  `}
`

const ContactName = styled.View``

const Blocky = styled.View`
  margin-right: 15px;
`

const RadioContainer = styled.View`
  width: 350px;
  flex-direction: row;
  align-items: center;
`

const RadioTextContainer = styled.View`
  flex: 1;
`

export type SubmitContactInput = {
  feedHash: string,
  name: String,
}

export type WalletBalances = {
  eth: utils.BigNumber,
  mft: utils.BigNumber,
}

export type WalletAccount = {
  address: string,
  balances: WalletBalances,
}

export type WalletAccounts = { [address: string]: WalletAccount }

const formatBalances = (balances: WalletBalances): string => {
  const eth = utils.formatEther(balances.eth)
  const mft = utils.formatEther(balances.mft)
  return `${eth} ETH | ${mft} MFT`
}

type GraphQLWalletAccount = {|
  +address: string,
  +balances: {|
    +eth: string,
    +mft: string,
  |},
|}

const toWalletAccount = (account: GraphQLWalletAccount): WalletAccount => {
  return {
    address: account.address,
    balances: {
      eth: utils.parseEther(account.balances.eth),
      mft: utils.parseEther(account.balances.mft),
    },
  }
}

type Props = {
  relay: {
    environment: Environment,
  },
  user: User,
}

type State = {
  searching?: boolean,
  searchTerm?: ?string,
  selectedContact: Object,
  selectedAddress: string,
  addModalState?: number,
  editModalOpen?: boolean,
  radio?: ?string,
  error?: ?string,
  inviteError?: ?string,
  peerLookupID?: ?string,
  queryInProgress?: ?boolean,
  addingContact?: ?boolean,
  inviteModalOpen?: ?{
    type: TransactionType,
    contactInfo: ContactInfo,
    invite?: any,
  },
  foundPeer?: {
    mainframeID: string,
    profile: {
      name: string,
      ethAddress?: ?string,
    },
    publicID: string,
    publicKey: string,
  },
  notification: string,
}

const CONTACT_CHANGED_SUBSCRIPTION = graphql`
  subscription ContactsScreenContactChangedSubscription {
    contactChanged {
      contact {
        localID
        peerID
        publicID
        connectionState
        invite {
          ...InviteContactModal_contactInvite
          ethNetwork
          fromAddress
          inviteTX
          stakeState
          stakeAmount
          reclaimedStakeTX
        }
        profile {
          name
          ethAddress
        }
      }
    }
  }
`

const CONTACTS_CHANGED_SUBSCRIPTION = graphql`
  subscription ContactsScreenContactsChangedSubscription {
    contactsChanged {
      viewer {
        ...ContactsScreen_user
      }
    }
  }
`

export const addContactMutation = graphql`
  mutation ContactsScreenAddContactMutation($input: AddContactInput!) {
    addContact(input: $input) {
      contact {
        localID
        publicID
        profile {
          name
          ethAddress
        }
        invite {
          ...InviteContactModal_contactInvite
        }
      }
      viewer {
        ...ContactsScreen_user
      }
    }
  }
`

export const acceptContactRequestMutation = graphql`
  mutation ContactsScreenAcceptContactRequestMutation(
    $input: AcceptContactRequestInput!
  ) {
    acceptContactRequest(input: $input) {
      viewer {
        ...ContactsScreen_user
      }
    }
  }
`

const peerLookupQuery = graphql`
  query ContactsScreenLookupPeerQuery($publicID: ID!) {
    lookup {
      peerByID(publicID: $publicID) {
        profile {
          name
        }
        publicID
        publicKey
      }
    }
  }
`

class ContactsView extends Component<Props, State> {
  _subscriptions: Array<Disposable> = []

  constructor(props: Props) {
    super(props)
    const { user } = this.props
    this.state = {
      selectedContact: user.localID,
      selectedAddress: user.profile.ethAddress || '',
      notification: '',
    }
  }

  componentDidMount() {
    this._subscriptions.push(
      requestSubscription(this.props.relay.environment, {
        subscription: CONTACT_CHANGED_SUBSCRIPTION,
      }),
    )
    this._subscriptions.push(
      requestSubscription(this.props.relay.environment, {
        subscription: CONTACTS_CHANGED_SUBSCRIPTION,
      }),
    )
  }

  componentWillUnmount() {
    this._subscriptions.forEach(sub => sub.dispose())
    this._subscriptions = []
  }

  getSelectedContact(): Contact | ContactRequest {
    const { selectedContact } = this.state
    return (
      this.getContact(selectedContact) ||
      this.getContactRequest(selectedContact) ||
      this.getIdentity()
    )
  }

  getContact = (id: string) => {
    return this.props.user.contacts.find(c => c.localID === id)
  }

  getContactRequest = (id: string) => {
    return this.props.user.contactRequests.find(c => c.localID === id)
  }

  startSearching = () => {
    this.setState({ searching: true })
  }

  closeSearch = () => {
    this.setState({ searching: false, searchTerm: '' })
  }

  searchTermChange = (value: string) => {
    this.setState({ searchTerm: value })
  }

  openAddModal = () => {
    this.setState({ addModalState: 1, radio: null, foundPeer: undefined })
  }

  openEditModal = () => {
    this.setState({ editModalOpen: true })
  }

  updateSelectedAddress = (selectedAddress: string) => {
    this.setState({ selectedAddress })
  }

  closeModal = () => {
    this.setState({
      addModalState: 0,
      foundPeer: undefined,
      editModalOpen: false,
      inviteModalOpen: undefined,
    })
  }

  lookupPeer = async (publicID: string) => {
    if (!isValidPeerID(publicID)) {
      this.setState({
        foundPeer: undefined,
        queryInProgress: false,
      })
      return
    }
    this.setState({
      queryInProgress: true,
    })

    const res = await fetchQuery(
      this.props.relay.environment,
      peerLookupQuery,
      { publicID },
    )
    this.setState({
      foundPeer: res.lookup.peerByID,
      queryInProgress: false,
    })
  }

  submitEditContact = (payload: FormSubmitPayload) => {
    // IMPLEMENT SAVE NAME
    if (payload.valid) {
      this.setState({ editModalOpen: false })
    }
  }

  sendInvite = async (contact: Contact) => {
    this.setState({
      inviteModalOpen: {
        contactInfo: {
          localID: contact.localID,
          publicID: contact.publicID,
          profile: contact.profile,
        },
        type: 'invite',
        invite: contact.invite,
      },
    })

    if (this.state.addModalState) {
      this.setState({ addModalState: 0 })
    }
  }

  submitNewContact = (payload: FormSubmitPayload) => {
    if (payload.valid) {
      this.setState({ error: null, addingContact: true })

      const requestComplete = error => {
        this.setState({
          error,
          addingContact: false,
          foundPeer: undefined,
        })
      }

      commitMutation(this.props.relay.environment, {
        mutation: addContactMutation,
        variables: {
          input: {
            publicID: payload.fields.peerLookupID,
          },
        },
        onCompleted: (response, errors) => {
          if (errors && errors.length) {
            requestComplete(errors[0].message)
          } else if (this.state.radio === 'blockchain') {
            const { contact } = response.addContact
            this.setState({
              addModalState: 2,
              inviteModalOpen: {
                contactInfo: {
                  localID: contact.localID,
                  publicID: contact.publicID,
                  profile: contact.profile,
                },
                type: 'invite',
                invite: contact.invite,
              },
            })
          } else {
            requestComplete()
          }
        },
        onError: err => {
          requestComplete(err.message)
        },
      })

      if (this.state.radio !== 'blockchain') {
        this.setState({ addModalState: 0 })
      }
    }
  }

  onFieldIDChange = debounce(
    (payload: string) => {
      //TODO: should fetch the user data.
      this.lookupPeer(payload)
      this.setState({
        peerLookupID: payload,
      })
    },
    250,
    { maxWait: 1000 },
  )

  selectContact = (id: string) => {
    this.setState({
      selectedContact: id,
      error: null,
      inviteError: null,
    })
  }

  acceptContact = (contactRequest: ContactRequest) => {
    this.setState({ error: null, addingContact: true })

    const requestComplete = error => {
      this.setState({
        error,
        addingContact: false,
      })
    }

    commitMutation(this.props.relay.environment, {
      mutation: acceptContactRequestMutation,
      variables: {
        input: {
          peerID: contactRequest.peerID,
        },
      },
      onCompleted: (contact, errors) => {
        if (errors && errors.length) {
          requestComplete(errors[0].message)
        } else {
          requestComplete()
        }
      },
      onError: err => {
        requestComplete(err.message)
      },
    })
  }

  withdrawStake = (contact: Contact) => {
    this.setState({
      inviteModalOpen: {
        contactInfo: {
          localID: contact.localID,
          publicID: contact.publicID,
          profile: contact.profile,
        },
        type: 'retrieveStake',
      },
    })
  }

  rejectContact = (contactRequest: ContactRequest) => {
    this.setState({
      inviteModalOpen: {
        contactInfo: {
          localID: contactRequest.localID,
          publicID: contactRequest.publicID,
          profile: contactRequest.profile,
        },
        type: 'declineInvite',
      },
    })
  }

  showNotification = (notification: string) => {
    this.setState({ notification })
  }

  closeNotification = () => {
    this.setState({ notification: '' })
  }

  getIdentity = () => {
    const { user } = this.props
    // $FlowFixMe Contact type
    return {
      connectionState: 'CONNECTED',
      localID: user.localID,
      peerID: user.localID,
      publicID: user.publicID,
      profile: user.profile,
    }
  }

  getWalletAccounts = memoize((ethWallets: EthWallets): WalletAccounts => {
    const wallets = {}
    ethWallets.hd.forEach(w => {
      w.accounts.forEach(a => {
        wallets[a.address] = toWalletAccount(a)
      })
    })
    ethWallets.ledger.forEach(w => {
      w.accounts.forEach(a => {
        wallets[a.address] = toWalletAccount(a)
      })
    })
    return wallets
  })

  isIdentitySelected = () => {
    return this.state.selectedContact === this.props.user.localID
  }

  validateID = () => {
    return !this.state.foundPeer ? 'Invalid Mainframe ID' : null
  }

  onChangeRadio = (value: string) => {
    this.setState({ radio: value })
  }

  // RENDER

  renderContactsList() {
    const selectedContact = this.getSelectedContact()
    const contacts = [
      this.getIdentity(),
      ...this.props.user.contacts,
      ...this.props.user.contactRequests,
    ]
    const list = this.state.searchTerm
      ? contacts.filter(
          cont =>
            cont.profile.name &&
            cont.profile.name.indexOf(this.state.searchTerm || '') > -1,
        )
      : contacts
    return (
      <ContactsListContainer>
        <ContactsListHeader hascontacts={contacts.length > 0}>
          <ButtonContainer>
            {this.state.searching ? (
              <TextField
                IconLeft={SearchIcon}
                onPressIcon={this.closeSearch}
                variant="search"
                autoFocus
                onChange={this.searchTermChange}
              />
            ) : (
              <Button
                onPress={this.startSearching}
                variant={['xSmallIconOnly', 'completeOnboarding', 'noTitle']}
                Icon={SearchIcon}
              />
            )}
          </ButtonContainer>
          <ButtonContainer>
            <Button
              variant={[
                'completeOnboarding',
                'redOutline',
                'xSmallIconOnly',
                'noTitle',
              ]}
              Icon={PlusIcon}
              onPress={this.openAddModal}
            />
          </ButtonContainer>
        </ContactsListHeader>
        {contacts.length === 0 ? (
          <NoContacts>
            <Text variant={['grey', 'small']}>No Contacts</Text>
          </NoContacts>
        ) : list.length === 0 ? (
          <NoContacts>
            <Text variant={['grey', 'small']}>No Match</Text>
          </NoContacts>
        ) : (
          list.map(contact => {
            const selected =
              selectedContact && selectedContact.localID === contact.localID
            return (
              <ContactCard
                key={contact.localID}
                onPress={() => this.selectContact(contact.localID)}
                selected={selected}>
                <ContactCardText>
                  <Text variant={['greyMed', 'ellipsis']} bold size={13}>
                    {contact.profile.name || contact.publicID}
                    {this.props.user.localID === contact.localID
                      ? ' (me)'
                      : null}
                  </Text>
                  {this.renderConnectionStateLabel(contact, true)}
                </ContactCardText>
                {selected && (
                  <SelectedPointer>
                    <SvgSelectedPointer />
                  </SelectedPointer>
                )}
              </ContactCard>
            )
          })
        )}
      </ContactsListContainer>
    )
  }

  renderAcceptIgnore = (contactRequest: ContactRequest) => {
    if (contactRequest.connectionState === 'RECEIVED') {
      return (
        <Row size={2}>
          <Column>
            <Button
              variant={['mediumUppercase', 'redOutline']}
              theme={{ minWidth: '100%' }}
              title="ACCEPT"
              onPress={() => this.acceptContact(contactRequest)}
            />
          </Column>
          <Column>
            <Button
              variant={['mediumUppercase', 'hoverShadow']}
              theme={{ minWidth: '100%' }}
              title="DECLINE & CLAIM MFT"
              onPress={() => this.rejectContact(contactRequest)}
            />
          </Column>
        </Row>
      )
    }
    return null
  }

  renderDelete = (contact: Contact) => {
    if (contact.connectionState === 'DECLINED') {
      return (
        <Row size={1}>
          <Column>
            <Button
              variant={['mediumUppercase', 'redOutline']}
              theme={{ minWidth: '100%' }}
              title="DELETE CONTACT"
            />
          </Column>
        </Row>
      )
    }
    return null
  }

  renderPeerLookup() {
    const { foundPeer, queryInProgress } = this.state
    const hasName = foundPeer && foundPeer.profile.name
    return queryInProgress ? (
      <Loader />
    ) : (
      foundPeer && (
        <Column>
          <AvatarWrapper>
            <Blocky>
              <Avatar id={foundPeer.publicID} size="small" />
            </Blocky>
            <Text
              variant="greyDark23"
              theme={{ fontStyle: hasName ? 'normal' : 'italic' }}
              size={13}>
              {foundPeer.profile.name || 'This user has a private profile'}
            </Text>
          </AvatarWrapper>
        </Column>
      )
    )
  }

  renderAddNewContactForm() {
    const { addModalState } = this.state

    switch (addModalState) {
      case 1:
        return this.renderAddNewContactFormStep1()
      case 2:
        return this.renderInviteModal()
      default:
        return null
    }
  }

  renderAddNewContactFormStep1() {
    const { error, radio } = this.state

    const errorMsg = error ? (
      <Row size={1}>
        <Column>
          <Text variant="error">{error}</Text>
        </Column>
      </Row>
    ) : null

    const MutualOption = (
      <RadioContainer>
        <RadioTextContainer>
          <Text size={12} color="#232323">
            Mutual invitation .{' '}
            <Text size={12} color="#DA1157">
              Free
            </Text>
          </Text>
          <Text color="#585858" size={11}>
            Both users need to add each other
          </Text>
        </RadioTextContainer>
        <Tooltip top>
          <Text variant="tooltipTitle">What is a Mutual Invitation?</Text>
          <Text variant="tooltipText">
            Both users must add each other’s Mainframe ID manually to establish
            the connection. Until then the contact remains {'"Pending"'} and
            cannot interact.
          </Text>
        </Tooltip>
      </RadioContainer>
    )

    const BlockchainOption = (
      <RadioContainer>
        <RadioTextContainer>
          <Text size={12} color="#232323">
            Blockchain invitation .{' '}
            <Text size={12} color="#DA1157">
              Stake {this.props.user.contactInviteStake} MFT
            </Text>
          </Text>
          <Text color="#585858" size={11}>
            Send an invitation. Retrieve your stake when it is accepted.
          </Text>
        </RadioTextContainer>
        <Tooltip top>
          <Text variant="tooltipTitle">What is a Blockchain Invitation?</Text>
          <Text variant="tooltipText">
            With a Blockchain invitation, you can send a notification to the
            other user that you want to connect and they can choose to accept or
            reject the invitation. If the invitation is accepted, your MFT stake
            will be released back to you. If they reject the invitation, they
            can claim and keep the stake.
          </Text>
        </Tooltip>
      </RadioContainer>
    )

    return (
      <FormModalView
        title="ADD A NEW CONTACT"
        confirmButton={radio === 'blockchain' ? 'NEXT' : 'ADD'}
        dismissButton="CANCEL"
        onRequestClose={this.closeModal}
        onSubmitForm={this.submitNewContact}>
        <FormContainer modal>
          <Row size={1}>
            <Column>
              <Text
                variant="greyMid"
                size={12}
                theme={{ textAlign: 'center', marginBottom: 50 }}>
                Connect with other Mainframe users by entering their Mainframe
                ID.
                {/*  or scanning their QR code */}
              </Text>
            </Column>
            <Column>
              <TextField
                name="peerLookupID"
                onChange={this.onFieldIDChange}
                required
                validation={this.validateID}
                label="Mainframe ID"
              />
            </Column>
            {this.renderPeerLookup()}
          </Row>

          {this.state.foundPeer && (
            <RadioGroup
              onChange={this.onChangeRadio}
              required
              name="inviteType">
              <Row size={1}>
                <Column>
                  {/*$FlowFixMe */}
                  <Radio value="mutual" label={MutualOption} />
                </Column>
              </Row>
              <Row size={1}>
                <Column>
                  {/*$FlowFixMe */}
                  <Radio value="blockchain" label={BlockchainOption} />
                </Column>
              </Row>
            </RadioGroup>
          )}
          <Row>{errorMsg}</Row>
        </FormContainer>
      </FormModalView>
    )
  }

  renderSendInviteState(contact: Contact) {
    if (contact.profile.ethAddress) {
      return (
        <Row size={1}>
          <Column>
            <Button
              title={'SEND BLOCKCHAIN INVITE'}
              variant={['mediumUppercase', 'redOutline']}
              theme={{ minWidth: '100%' }}
              onPress={() => this.sendInvite(contact)}
            />
          </Column>
        </Row>
      )
    }
  }

  renderInviteArea(contact: Contact) {
    switch (contact.connectionState) {
      case 'SENDING_FEED':
        return <Loader />
      case 'SENT_FEED': {
        return this.renderSendInviteState(contact)
      }
      case 'SENDING_BLOCKCHAIN': {
        return <Loader />
      }
      case 'CONNECTED': {
        if (contact.invite != null) {
          if (contact.invite.stakeState === 'STAKED') {
            return (
              <Row size={1}>
                <Column>
                  <Button
                    title={'WITHDRAW YOUR MFT'}
                    variant={['mediumUppercase', 'redOutline']}
                    theme={{ minWidth: '100%' }}
                    onPress={() => this.withdrawStake(contact)}
                  />
                </Column>
              </Row>
            )
          } else if (contact.invite.stakeState === 'RECLAIMING') {
            return (
              <Row size={1}>
                <Column>
                  <Text color="#303030">
                    Stake withdraw transaction processing...
                  </Text>
                </Column>
              </Row>
            )
          }
        }
        return null
      }
      default:
        return null
    }
  }

  openTransaction = (inviteTX: ?string, ethNetwork: ?string) => {
    if (inviteTX && ethNetwork) {
      const url =
        ethNetwork === 'mainnet'
          ? `https://etherscan.io/tx/${inviteTX}`
          : `https://ropsten.etherscan.io/tx/${inviteTX}`
      shell.openExternal(url)
    }
  }

  renderConnectionStateLabel(contact: Contact, forListItem: boolean) {
    switch (contact.connectionState) {
      case 'DECLINED':
        return (
          <Text color="#DA1157" size={10}>
            Has declined your invitation
          </Text>
        )
      case 'SENDING_FEED':
        return (
          <Text color="#DA1157" size={10}>
            Pending
          </Text>
        )
      case 'SENT_FEED': {
        return (
          <Text color="#DA1157" size={10}>
            Pending
          </Text>
        )
      }
      case 'SENDING_BLOCKCHAIN': {
        return (
          <Text color="#DA1157" size={10}>
            Pending confirmation
          </Text>
        )
      }
      case 'SENT_BLOCKCHAIN': {
        return (
          contact.invite &&
          contact.invite.inviteTX && (
            <Text color="#DA1157" size={10}>
              Pending confirmation
              {!forListItem ? (
                <ViewTransaction
                  onPress={() =>
                    this.openTransaction(
                      // $FlowFixMe already checked
                      contact.invite.inviteTX,
                      // $FlowFixMe already checked
                      contact.invite.ethNetwork,
                    )
                  }>
                  <Text color="#303030" size={10}>
                    {'  '}(view transaction)
                  </Text>
                </ViewTransaction>
              ) : null}
            </Text>
          )
        )
      }
      case 'RECEIVED': {
        return (
          <Text color="#DA1157" size={10}>
            Request
          </Text>
        )
      }
      case 'CONNECTED': {
        if (
          contact &&
          contact.connectionState === 'CONNECTED' &&
          contact.invite
        ) {
          if (
            contact.invite.stakeAmount &&
            !contact.invite.reclaimedStakeTX &&
            contact.invite.stakeState !== 'RECLAIMING'
          ) {
            return (
              <Text color="#DA1157" size={10}>
                Has accepted your invitation
              </Text>
            )
          } else if (contact.invite.reclaimedStakeTX && !forListItem) {
            return (
              contact.invite &&
              contact.invite.inviteTX && (
                <Text color="#DA1157" size={10}>
                  Stake Retrieved
                  <ViewTransaction
                    onPress={() =>
                      this.openTransaction(
                        // $FlowFixMe already checked
                        contact.invite.reclaimedStakeTX,
                        // $FlowFixMe already checked
                        contact.invite.ethNetwork,
                      )
                    }>
                    <Text color="#303030" size={10}>
                      {'  '}(view transaction)
                    </Text>
                  </ViewTransaction>
                </Text>
              )
            )
          }
        }
        return null
      }
      default:
        return null
    }
  }

  renderRightSide() {
    const selectedContact = this.getSelectedContact()
    const inviteAction = this.renderInviteArea(selectedContact)

    const connectionStateLabel = this.renderConnectionStateLabel(
      selectedContact,
      false,
    )

    const inviteError = this.state.inviteError && (
      <Text styles="margin-top:10px;" variant="error">
        {this.state.inviteError}
      </Text>
    )

    return (
      <RightContainer>
        <ScrollView>
          <Row size={1}>
            <Column>
              <AvatarWrapper>
                <Blocky>
                  <Avatar id={selectedContact.publicID} size="large" />
                </Blocky>
                <ContactName>
                  <Text bold size={24}>
                    {selectedContact.profile.name}
                  </Text>
                  {connectionStateLabel}
                </ContactName>
              </AvatarWrapper>
            </Column>
          </Row>
          {this.renderAcceptIgnore(selectedContact)}
          {this.renderDelete(selectedContact)}
          {inviteAction}

          {selectedContact.connectionState === 'SENT_BLOCKCHAIN' &&
            selectedContact.invite &&
            selectedContact.invite.inviteTX && (
              <Row size={1}>
                <Column>
                  <InformationBox
                    content={
                      'This person needs to accept your request in order to connect and retrieve your MFT stake.'
                    }
                    full
                  />
                </Column>
              </Row>
            )}
          {selectedContact.connectionState === 'SENT_FEED' && (
            <Row size={1}>
              <Column>
                <InformationBox
                  content={
                    'This person needs to add you back to connect. Make sure to give them your Mainframe ID.'
                  }
                  full
                />
              </Column>
            </Row>
          )}
          {this.isIdentitySelected() ? (
            <>
              <Row size={1}>
                <Column>
                  <Text
                    variant="smallTitle"
                    theme={{ padding: '20px 0 10px 0' }}>
                    Mainframe ID
                  </Text>
                  <CopyableBlock value={selectedContact.publicID} />
                </Column>
              </Row>
              <Row size={1}>
                <Column>
                  <InformationBox
                    content={
                      'Share your Mainframe ID with your contacts and let your friends add you on Mainframe OS.'
                    }
                    full
                  />
                </Column>
              </Row>
            </>
          ) : (
            <Row size={1}>
              <Column>
                <Text variant="smallTitle" theme={{ padding: '20px 0 10px 0' }}>
                  Mainframe ID
                </Text>
                <Text variant="addressLarge">{selectedContact.publicID}</Text>
              </Column>
            </Row>
          )}
          {selectedContact.profile.ethAddress && (
            <Row size={1}>
              <Column>
                <Text variant="smallTitle" theme={{ padding: '20px 0 10px 0' }}>
                  ETH Address
                </Text>
                <Text variant="addressLarge">
                  {selectedContact.profile.ethAddress}
                </Text>
              </Column>
            </Row>
          )}
          <Row size={1}>
            <Column>{inviteError}</Column>
          </Row>
          {/* <Row size={1}>
              <Column styles="margin-top: 10px;">
            <Button
            onPress={this.openEditModal}
            variant={['small', 'completeOnboarding']}
            title="EDIT"
            />
              </Column>
          </Row> */}
        </ScrollView>
      </RightContainer>
    )
  }

  renderNotificationModal() {
    const { user } = this.props
    const { selectedAddress, notification } = this.state
    const deletedContact = this.state.inviteModalOpen
      ? this.state.inviteModalOpen.contactInfo.profile
      : null

    if (notification === 'withdraw' || notification === 'decline') {
      const wallets = this.getWalletAccounts(user.ethWallets)
      const balances = formatBalances(wallets[selectedAddress].balances)

      return (
        <Notification
          message={`${user.contactInviteStake} MFT have been added to your wallet.`}
          address={selectedAddress}
          firstLine={selectedAddress}
          secondLine={balances}
          onRequestClose={this.closeNotification}
        />
      )
    } else if (this.state.notification === 'delete' && deletedContact) {
      const name = deletedContact.name ? deletedContact.name : 'Contact'
      const ethAddress = deletedContact.ethAddress
        ? deletedContact.ethAddress
        : ''
      return (
        <Notification
          message={name + ' has been deleted.'}
          address={ethAddress}
          firstLine={name}
          secondLine={ethAddress}
          onRequestClose={this.closeNotification}
        />
      )
    }
  }

  renderInviteModal() {
    const { inviteModalOpen, selectedAddress } = this.state
    const { user } = this.props
    const wallets = this.getWalletAccounts(user.ethWallets)

    return inviteModalOpen == null ? null : (
      // $FlowFixMe: Relay fragment type
      <InviteContactModal
        closeModal={this.closeModal}
        showNotification={this.showNotification}
        contactInfo={inviteModalOpen.contactInfo}
        contactInvite={inviteModalOpen.invite}
        // $FlowFixMe: Relay fragment type
        user={user}
        type={inviteModalOpen.type}
        updateSelectedAddress={this.updateSelectedAddress}
        selectedAddress={selectedAddress}
        wallets={wallets}
      />
    )
  }

  renderEditModal() {
    const selectedContact = this.getSelectedContact()
    if (!this.state.editModalOpen || !selectedContact) {
      return null
    }

    const { error } = this.state
    const errorMsg = error ? (
      <Row size={1}>
        <Column>
          <Text variant="error">{error}</Text>
        </Column>
      </Row>
    ) : null

    return (
      <FormModalView
        title="EDIT CONTACT"
        confirmButton="SAVE"
        dismissButton="CANCEL"
        onRequestClose={this.closeModal}
        onSubmitForm={this.submitEditContact}>
        <FormContainer modal={true}>
          <Row size={1}>
            <Column styles="align-items:center; justify-content: center; flex-direction: row; margin-bottom: 30px;">
              <Avatar id={selectedContact.publicID} size="large" />
            </Column>
            <Column>
              <TextField
                name="name"
                defaultValue={selectedContact.profile.name}
                required
                label="Name"
              />
            </Column>
            <Column>
              <RevertNameButton>
                <SvgSmallClose />
                <Text size={11} theme={{ marginLeft: '5px' }}>
                  Reset to the original name “{selectedContact.profile.name}”
                </Text>
              </RevertNameButton>
            </Column>
          </Row>
          {errorMsg}
        </FormContainer>
      </FormModalView>
    )
  }

  render() {
    return (
      <Container>
        {this.renderContactsList()}
        {this.renderRightSide()}
        {this.renderAddNewContactForm()}
        {this.renderEditModal()}
        {this.renderInviteModal()}
        {this.renderNotificationModal()}
      </Container>
    )
  }
}

const RelayContainer = createFragmentContainer(ContactsView, {
  user: graphql`
    fragment ContactsScreen_user on User {
      ...InviteContactModal_user
      localID
      publicID
      profile {
        name
        ethAddress
      }
      contactInviteStake
      contactRequests {
        localID
        publicID
        peerID
        profile {
          name
          ethAddress
        }
        connectionState
        ethNetwork
        stakeAmount
        receivedAddress
        senderAddress
      }
      contacts {
        localID
        peerID
        publicID
        connectionState
        invite {
          ...InviteContactModal_contactInvite
          ethNetwork
          fromAddress
          inviteTX
          stakeState
          stakeAmount
          reclaimedStakeTX
        }
        profile {
          name
          ethAddress
        }
      }
      ethWallets {
        hd {
          name
          localID
          accounts {
            address
            balances {
              eth
              mft
            }
          }
        }
        ledger {
          name
          localID
          accounts {
            address
            balances {
              eth
              mft
            }
          }
        }
      }
    }
  `,
})

export default function ContactsScreen() {
  return (
    <RelayRenderer
      render={({ props }) => (props ? <RelayContainer {...props} /> : null)}
      query={graphql`
        query ContactsScreenQuery {
          user: viewer {
            ...ContactsScreen_user
          }
        }
      `}
    />
  )
}
