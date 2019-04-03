// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'
import {
  graphql,
  commitMutation,
  createFragmentContainer,
  requestSubscription,
  type Disposable,
  type Environment,
} from 'react-relay'
import { fetchQuery } from 'relay-runtime'
import { debounce } from 'lodash'
import { Text, Button, Row, Column, TextField } from '@morpheus-ui/core'
import { Form, type FormSubmitPayload } from '@morpheus-ui/forms'

import PlusIcon from '@morpheus-ui/icons/PlusSymbolSm'
import SearchIcon from '@morpheus-ui/icons/SearchSm'
import CircleArrowRight from '@morpheus-ui/icons/CircleArrowRight'

import { type CurrentUser } from '../LauncherContext'
import { EnvironmentContext } from '../RelayEnvironment'
import Avatar from '../../UIComponents/Avatar'
import SvgSelectedPointer from '../../UIComponents/SVGSelectedPointer'

import FormModalView from '../../UIComponents/FormModalView'
import Loader from '../../UIComponents/Loader'

import type Identity from './__generated__/ContactsView_identities.graphql'

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
`

const ContactsListContainer = styled.View`
  position: relative;
  width: 260px;
  padding-top: 40px;
  border-right-width: 1px;
  border-right-style: solid;
  border-right-color: #f5f5f5;
  height: calc(100vh - 40px);
  overflow-y: auto;
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

const AcceptIgnore = styled.View`
  padding-left: 10px;
  width: 110px;
  flex-direction: row;
  justify-content: space-between;
`

const RightContainer = styled.View`
  flex: 1;
  height: calc(100vh - 40px);
  padding-left: 40px;
`

const ContactsListHeader = styled.View`
  position: absolute;
  top: 0;
  padding: 3px 0 10px 10px;
  width: 100%;
  height: 45px;
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
    justify-content: space-between;
    margin-top: 15vh;`}
`

const AvatarWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`

const Blocky = styled.View`
  margin-right: 15px;
`

export type Contact = {
  localID: string,
  peerID: string,
  publicFeed: string,
  ethAddress?: string,
  invite?: {
    inviteTX?: ?string,
    stake: {
      amount: string,
      state: string,
      reclaimedTX?: ?string,
    },
  },
  profile: {
    name?: string,
    ethAddress?: ?string,
  },
  connectionState: 'SENT' | 'RECEIVED' | 'CONNECTED',
}

export type SubmitContactInput = {
  feedHash: string,
  name: String,
}

type Props = {
  relay: {
    environment: Environment,
  },
  user: CurrentUser,
  contacts: {
    userContacts: Array<Contact>,
  },
  identities: {
    ownUsers: Array<Identity>,
  },
  acceptContact: (contact: Contact) => void,
  ignoreContact: (contact: Contact) => void,
}

type State = {
  searching?: boolean,
  searchTerm?: ?string,
  selectedContact?: Object,
  addModalOpen?: boolean,
  editModalOpen?: boolean,
  error?: ?string,
  inviteError?: ?string,
  peerLookupHash?: ?string,
  queryInProgress?: ?boolean,
  addingContact?: ?boolean,
  invitingContact?: ?string,
  withdrawingStake?: ?boolean,
  rejectingInvite?: ?string,
  foundPeer?: {
    profile: {
      name: string,
      ethAddress?: ?string,
    },
    publicFeed: string,
    publicKey: string,
  },
}

const CONTACTS_CHANGED_SUBSCRIPTION = graphql`
  subscription ContactsViewContactsChangedSubscription($userID: String!) {
    contactsChanged {
      contact {
        invite {
          inviteTX
        }
      }
      viewer {
        contacts {
          ...ContactsView_contacts @arguments(userID: $userID)
        }
      }
    }
  }
`

export const inviteContactMutation = graphql`
  mutation ContactsViewInviteContactMutation(
    $input: InviteContactInput!
    $userID: String!
  ) {
    inviteContact(input: $input) {
      contact {
        invite {
          inviteTX
        }
      }
      viewer {
        contacts {
          ...ContactsView_contacts @arguments(userID: $userID)
        }
      }
    }
  }
`

export const retrieveInviteStakeMutation = graphql`
  mutation ContactsViewRetrieveInviteStakeMutation(
    $input: RetrieveInviteStakeInput!
    $userID: String!
  ) {
    retrieveInviteStake(input: $input) {
      viewer {
        contacts {
          ...ContactsView_contacts @arguments(userID: $userID)
        }
      }
    }
  }
`

export const rejectContactMutation = graphql`
  mutation ContactsViewRejectContactMutation(
    $input: RejectContactInput!
    $userID: String!
  ) {
    rejectContact(input: $input) {
      viewer {
        contacts {
          ...ContactsView_contacts @arguments(userID: $userID)
        }
      }
    }
  }
`

export const addContactMutation = graphql`
  mutation ContactsViewAddContactMutation(
    $input: AddContactInput!
    $userID: String!
  ) {
    addContact(input: $input) {
      viewer {
        contacts {
          ...ContactsView_contacts @arguments(userID: $userID)
        }
      }
    }
  }
`

export const acceptContactRequestMutation = graphql`
  mutation ContactsViewAcceptContactRequestMutation(
    $input: AcceptContactRequestInput!
    $userID: String!
  ) {
    acceptContactRequest(input: $input) {
      viewer {
        contacts {
          ...ContactsView_contacts @arguments(userID: $userID)
        }
      }
    }
  }
`

const peerLookupQuery = graphql`
  query ContactsViewQuery($feedHash: String!) {
    peers {
      peerLookupByFeed(feedHash: $feedHash) {
        profile {
          name
        }
        publicFeed
        publicKey
      }
    }
  }
`

class ContactsViewComponent extends Component<Props, State> {
  static contextType = EnvironmentContext
  _subscription: ?Disposable

  constructor(props: Props) {
    super(props)
    this.state = {
      selectedContact: props.contacts.userContacts.length
        ? this.getIdentity()
        : null,
    }
  }

  componentDidMount() {
    this._subscription = requestSubscription(this.props.relay.environment, {
      subscription: CONTACTS_CHANGED_SUBSCRIPTION,
      variables: {
        userID: this.props.user.localID,
      },
    })
  }

  componentWillUnmount() {
    if (this._subscription != null) {
      this._subscription.dispose()
    }
  }

  componentDidUpdate() {
    if (
      !this.state.selectedContact &&
      this.props.contacts.userContacts.length
    ) {
      this.setState({
        selectedContact: this.getIdentity(),
      })
    }
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
    this.setState({ addModalOpen: true })
  }

  openEditModal = () => {
    this.setState({ editModalOpen: true })
  }

  closeModal = () => {
    this.setState({ addModalOpen: false, editModalOpen: false })
  }

  lookupPeer = async (feedHash: string) => {
    if (!feedHash || feedHash.length !== 64) {
      this.setState({
        foundPeer: undefined,
        queryInProgress: false,
      })
      return
    }
    this.setState({
      queryInProgress: true,
    })

    const peerQueryResult = await fetchQuery(this.context, peerLookupQuery, {
      feedHash,
    })
    this.setState({
      foundPeer: peerQueryResult.peers.peerLookupByFeed,
      queryInProgress: false,
    })
  }

  submitEditContact = (payload: FormSubmitPayload) => {
    // IMPLEMENT SAVE NAME
    if (payload.valid) {
      this.setState({ editModalOpen: false })
    }
  }

  sendInvite = (contact: Contact) => {
    const { user } = this.props
    this.setState({ inviteError: null, invitingContact: contact.localID })
    const input = {
      userID: user.localID,
      contactID: contact.localID,
    }

    const requestComplete = error => {
      this.setState({
        inviteError: error,
        invitingContact: undefined,
        foundPeer: undefined,
      })
    }

    commitMutation(this.context, {
      mutation: inviteContactMutation,
      variables: { input, userID: user.localID },
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

    if (this.state.addModalOpen) {
      this.setState({ addModalOpen: false })
    }
  }

  submitNewContact = (payload: FormSubmitPayload) => {
    const { user } = this.props
    if (payload.valid) {
      this.setState({ error: null, addingContact: true })
      const input = {
        userID: user.localID,
        publicFeed: payload.fields.peerLookupHash,
      }

      const requestComplete = error => {
        this.setState({
          error,
          addingContact: false,
          foundPeer: undefined,
        })
      }

      commitMutation(this.context, {
        mutation: addContactMutation,
        variables: { input, userID: user.localID },
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

      if (this.state.addModalOpen) {
        this.setState({ addModalOpen: false })
      }
    }
  }

  onFormChange = debounce(
    (payload: FormSubmitPayload) => {
      //TODO: should fetch the user data.
      this.lookupPeer(payload.fields.peerLookupHash)
      this.setState({
        peerLookupHash: payload.fields.peerLookupHash,
      })
    },
    250,
    { maxWait: 1000 },
  )

  selectContact = (contact: Contact) => {
    this.setState({ selectedContact: contact })
  }

  acceptContact = (contact: Contact) => {
    const { user } = this.props
    this.setState({ error: null, addingContact: true })
    const input = {
      userID: user.localID,
      peerID: contact.peerID,
    }

    const requestComplete = error => {
      this.setState({
        error,
        addingContact: false,
      })
    }

    commitMutation(this.context, {
      mutation: acceptContactRequestMutation,
      variables: { input, userID: user.localID },
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
    const { user } = this.props
    this.setState({ error: null, withdrawingStake: true })
    const input = {
      userID: user.localID,
      contactID: contact.localID,
    }

    const requestComplete = error => {
      this.setState({
        error,
        withdrawingStake: false,
      })
    }

    commitMutation(this.context, {
      mutation: retrieveInviteStakeMutation,
      variables: { input, userID: user.localID },
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

  rejectContact = (contact: Contact) => {
    const { user } = this.props
    this.setState({ error: null, rejectingInvite: contact.peerID })
    const input = {
      userID: user.localID,
      peerID: contact.peerID,
    }

    const requestComplete = error => {
      this.setState({
        error,
        rejectingInvite: undefined,
      })
    }

    commitMutation(this.context, {
      mutation: rejectContactMutation,
      variables: { input, userID: user.localID },
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

  getIdentity = () => {
    const { ownUsers } = this.props.identities

    if (ownUsers.length) {
      const id = ownUsers[0]
      return {
        connectionState: 'CONNECTED',
        localID: id.localID,
        peerID: id.localID,
        publicFeed: id.feedHash,
        profile: {
          name: `${id.profile.name} (Me)`,
        },
      }
    } else {
      return {}
    }
  }

  // RENDER

  renderContactsList() {
    const { userContacts } = this.props.contacts

    const contacts = [this.getIdentity(), ...userContacts]
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
              variant={['xSmallIconOnly', 'completeOnboarding', 'noTitle']}
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
              this.state.selectedContact &&
              this.state.selectedContact.localID === contact.localID
            return (
              <ContactCard
                key={contact.localID}
                onPress={() => this.selectContact(contact)}
                selected={selected}>
                <ContactCardText>
                  <Text variant={['greyMed', 'ellipsis']} bold size={13}>
                    {contact.profile.name || contact.publicFeed}
                  </Text>
                  {contact.connectionState === 'SENT' ||
                  contact.connectionState === 'SENDING' ? (
                    <Text variant={['grey']} size={10}>
                      Pending
                    </Text>
                  ) : null}
                </ContactCardText>
                {contact.connectionState === 'RECEIVED'
                  ? this.renderAcceptIgnore(contact)
                  : null}
                {contact.connectionState === 'DECLINED' ? (
                  <ContactCardText>
                    <Text variant={['red']} size={10}>
                      Declined
                    </Text>
                  </ContactCardText>
                ) : null}
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

  renderAcceptIgnore = (contact: Contact) => {
    return (
      <AcceptIgnore>
        <Button
          variant={['no-border', 'xSmall', 'grey']}
          title="IGNORE"
          onPress={() => this.rejectContact(contact)}
        />
        <Button
          variant={['no-border', 'xSmall', 'red']}
          title="ACCEPT"
          onPress={() => this.acceptContact(contact)}
        />
      </AcceptIgnore>
    )
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
              <Avatar id={foundPeer.publicFeed} size="small" />
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

  renderAddNewContactForm(modal: boolean) {
    const { error, addingContact } = this.state
    const errorMsg = error ? (
      <Row size={1}>
        <Column>
          <Text variant="error">{error}</Text>
        </Column>
      </Row>
    ) : null

    const innerContent = (
      <>
        <Row size={1}>
          {modal && (
            <Column>
              <Text
                variant="greyMid"
                size={12}
                theme={{ textAlign: 'center', marginBottom: 50 }}>
                Connect with other Mainframe users by entering their Mainframe
                Contact ID. Be sure to have them add your Mainframe Contact ID
                too.
                {/*  or scanning their QR code */}
              </Text>
            </Column>
          )}
          <Column>
            <TextField name="peerLookupHash" required label="Contact ID" />
          </Column>
          {this.renderPeerLookup()}
        </Row>
        <Row>{errorMsg}</Row>
      </>
    )

    if (modal) {
      return innerContent
    }

    return (
      <FormContainer modal={modal}>
        <Form onChange={this.onFormChange} onSubmit={this.submitNewContact}>
          {innerContent}
          <Row size={2} top>
            <Column styles="align-items:flex-end;" smOffset={1}>
              <Button
                disabled={addingContact}
                title="ADD"
                variant="onboarding"
                Icon={CircleArrowRight}
                submit
              />
            </Column>
          </Row>
        </Form>
      </FormContainer>
    )
  }

  renderRightSide() {
    const { selectedContact } = this.state
    if (!selectedContact) {
      return (
        <RightContainer>
          <Row size={1}>
            <Column>
              <Text variant={['smallTitle', 'blue', 'noPadding', 'bold']}>
                ADD A NEW CONTACT
              </Text>
            </Column>
          </Row>
          <Row size={1}>
            <Column>
              <Text variant="greyMed" size={12}>
                You have no contacts in your address book. Add a contact by
                entering their Mainframe Contact ID below.
              </Text>
            </Column>
          </Row>
          {this.renderAddNewContactForm(false)}
        </RightContainer>
      )
    }

    let inviteAction
    if (
      selectedContact &&
      selectedContact.connectionState === 'SENT' &&
      selectedContact.profile.ethAddress
    ) {
      if (this.state.invitingContact === selectedContact.localID) {
        inviteAction = <Loader />
      } else if (selectedContact.invite && selectedContact.invite.inviteTX) {
        inviteAction = (
          <Text>{`Invite request sent: ${
            selectedContact.invite.inviteTX
          }`}</Text>
        )
      } else {
        inviteAction = (
          <Button
            title="Send Invite"
            variant={['marginTop10', 'redOutline']}
            onPress={() => this.sendInvite(selectedContact)}
          />
        )
      }
    } else if (
      selectedContact &&
      selectedContact.connectionState === 'CONNECTED' &&
      selectedContact.invite
    ) {
      if (selectedContact.invite.stake.reclaimedTX) {
        inviteAction = (
          <Text>{`Stake withdrawn: ${
            selectedContact.invite.stake.reclaimedTX
          }`}</Text>
        )
      } else if (selectedContact.invite.stake.state === 'RECLAIMING') {
        inviteAction = <Text>Stake withdraw transaction processing...</Text>
      } else {
        if (this.state.withdrawingStake) {
          inviteAction = <Loader />
        } else {
          inviteAction = (
            <Button
              title="Withdraw Stake"
              variant={['marginTop10', 'redOutline']}
              onPress={() => this.withdrawStake(selectedContact)}
            />
          )
        }
      }
    }
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
                  <Avatar id={selectedContact.publicFeed} size="large" />
                </Blocky>
                <Text bold size={24}>
                  {selectedContact.profile.name}
                </Text>
              </AvatarWrapper>
            </Column>
          </Row>
          <Row size={1}>
            <Column>
              <Text variant="smallTitle" theme={{ padding: '20px 0 10px 0' }}>
                Mainframe ID
              </Text>
              <Text variant="addressLarge">{selectedContact.publicFeed}</Text>
            </Column>
          </Row>
          {selectedContact.profile.ethAddress && (
            <Row size={1}>
              <Column>
                <Text variant="smallTitle" theme={{ padding: '20px 0 10px 0' }}>
                  ETH Address
                </Text>
                <Text variant="addressLarge">
                  {selectedContact.profile.ethAddress}
                </Text>
                {inviteAction}
                {inviteError}
              </Column>
            </Row>
          )}
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

  renderAddModal() {
    return (
      this.state.addModalOpen && (
        <FormModalView
          title="ADD A NEW CONTACT"
          confirmButton="ADD"
          dismissButton="CANCEL"
          onRequestClose={this.closeModal}
          onChangeForm={this.onFormChange}
          onSubmitForm={this.submitNewContact}>
          <FormContainer modal>
            {this.renderAddNewContactForm(true)}
          </FormContainer>
        </FormModalView>
      )
    )
  }

  renderEditModal() {
    if (!this.state.editModalOpen || !this.state.selectedContact) {
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
              <Avatar id={this.state.selectedContact.publicFeed} size="large" />
            </Column>
            <Column>
              <TextField
                name="name"
                defaultValue={this.state.selectedContact.profile.name}
                required
                label="Name"
              />
            </Column>
            <Column>
              <RevertNameButton>
                <SvgSmallClose />
                <Text size={11} theme={{ marginLeft: '5px' }}>
                  Reset to the original name “
                  {this.state.selectedContact.profile.name}”
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
        {this.renderAddModal()}
        {this.renderEditModal()}
      </Container>
    )
  }
}

const ContactsView = createFragmentContainer(ContactsViewComponent, {
  contacts: graphql`
    fragment ContactsView_contacts on Contacts
      @argumentDefinitions(userID: { type: "String!" }) {
      userContacts(userID: $userID) {
        peerID
        localID
        connectionState
        publicFeed
        invite {
          inviteTX
          stake {
            reclaimedTX
            amount
            state
          }
        }
        profile {
          name
          ethAddress
        }
      }
    }
  `,
  identities: graphql`
    fragment ContactsView_identities on Identities {
      ownUsers {
        localID
        feedHash
        profile {
          name
        }
      }
    }
  `,
})

export default ContactsView
