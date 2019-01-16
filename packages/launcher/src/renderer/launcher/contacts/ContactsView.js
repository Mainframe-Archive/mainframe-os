// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'
import { graphql, commitMutation, createFragmentContainer } from 'react-relay'
import { Text, Button, Row, Column, TextField } from '@morpheus-ui/core'
import { Form, type FormSubmitPayload } from '@morpheus-ui/forms'

import PlusIcon from '@morpheus-ui/icons/PlusSymbolSm'
import SearchIcon from '@morpheus-ui/icons/SearchSm'
import CircleArrowRight from '@morpheus-ui/icons/CircleArrowRight'
import CircleArrowDown from '@morpheus-ui/icons/CircleArrowDownMd'
import CircleArrowUp from '@morpheus-ui/icons/CircleArrowUpMd'
import CloseIcon from '@morpheus-ui/icons/Close'
import { EnvironmentContext } from '../RelayEnvironment'

const Container = styled.View`
  position: relative;
  flex-direction: row;
`

const ContactsListContainer = styled.View`
  width: 260px;
  border-right-width: 1px;
  border-right-style: solid;
  border-right-color: #f5f5f5;
  height: calc(100vh - 40px);
`

const ContactCard = styled.TouchableOpacity`
  min-height: 50px;
  padding: 8px 10px 8px 0;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #f5f5f5;
`
const ContactCardText = styled.View`
  flex: 1;
  min-height: 34px;
  justify-content: space-around;
`

const InviteCard = styled.TouchableOpacity`
  min-height: 50px;
  padding: 10px;
  background-color: ${props => props.theme.colors.LIGHT_GREY_F9};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
  border-left-width: 3px;
  border-left-style: solid;
  border-left-color: ${props => props.theme.colors.PRIMARY_BLUE};
  border-radius: 3px;
  ${props =>
    props.connectionState === 'RECEIVED' &&
    `
      border-left-width: 3px;
      border-left-style: solid;
      border-left-color: ${props.theme.colors.PRIMARY_RED};
    `}
`

const InviteCardIcon = styled.View`
  padding: 5px 10px 5px 0;
  width: 80px;
  align-items: center;
  justify-content: center;
`
const InviteCardText = styled.View`
  flex: 1;
`
const InviteCardStatus = styled.View`
  padding: 10px;
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
  padding-bottom: 10px;
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
const ScrollView = styled.ScrollView``

const FormContainer = styled.View`
  margin-top: 20px;
  max-width: 450px;

  ${props =>
    props.modal &&
    `
    flex: 1;
    align-self: center;
    align-items: center;
    justify-content: space-between;
    margin-top: 15vh;`}
`

const InternalModal = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
`

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  top: 0;
  width: 24px;
  height: 24px;
  z-index: 1;
`

const ModalTitle = styled.View`
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #f5f5f5;
  height: 35px;
  margin-top: 5px;
  align-items: center;
  justify-content: flex-start;
`

export type Contact = {
  localID: string,
  peerID: string,
  profile: {
    name?: string,
  },
  connectionState: 'SENT' | 'RECEIVED' | 'CONNECTED',
}

export type SubmitContactInput = {
  feedHash: string,
  name: String,
}

type Props = {
  userID: string,
  contacts: {
    userContacts: Array<Contact>,
  },
  acceptContact: (contact: Contact) => void,
  ignoreContact: (contact: Contact) => void,
}

type State = {
  modalOpen: boolean,
  error?: ?string,
}

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

export class ContactsView extends Component<Props, State> {
  static contextType = EnvironmentContext

  state = {
    modalOpen: false,
  }

  openModal = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

  submitNewContact = async (payload: FormSubmitPayload) => {
    if (payload.valid) {
      this.setState({ error: null })
      const input = {
        userID: this.props.userID,
        publicFeed: payload.fields.publicKey,
        profile: {
          name: payload.fields.name,
        },
      }

      commitMutation(this.context, {
        mutation: addContactMutation,
        variables: { input, userID: this.props.userID },
        onCompleted: (contact, errors) => {
          if (errors && errors.length) {
            this.setState({ error: errors[0].message })
          } else {
            if (this.state.modalOpen) {
              this.setState({ modalOpen: false })
            }
          }
        },
        onError: err => {
          this.setState({ error: err.message })
        },
      })

      if (this.state.modalOpen) {
        this.setState({ modalOpen: false })
      }
    }
  }

  renderContactsList() {
    const { userContacts } = this.props.contacts
    return (
      <ContactsListContainer>
        <ContactsListHeader hascontacts={userContacts.length > 0}>
          <ButtonContainer>
            <Button
              variant={['xSmall', 'completeOnboarding']}
              Icon={SearchIcon}
            />
          </ButtonContainer>
          <ButtonContainer>
            <Button
              variant={['xSmall', 'completeOnboarding']}
              Icon={PlusIcon}
              onPress={this.openModal}
            />
          </ButtonContainer>
        </ContactsListHeader>
        {userContacts.length === 0 ? (
          <NoContacts>
            <Text variant={['grey', 'small']}>No Contacts</Text>
          </NoContacts>
        ) : (
          <ScrollView>
            {userContacts.map(contact => {
              return (
                <ContactCard key={contact.localID}>
                  <ContactCardText>
                    <Text variant={['greyMed', 'elipsis']} size={13}>
                      {contact.profile.name || contact.localID}
                    </Text>
                    {contact.connectionState === 'SENT' ? (
                      <Text variant={['grey']} size={10}>
                        Pending
                      </Text>
                    ) : null}
                  </ContactCardText>
                  {contact.connectionState === 'RECEIVED'
                    ? this.renderAcceptIgnore(contact)
                    : null}
                </ContactCard>
              )
            })}
          </ScrollView>
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
          onPress={() => this.props.ignoreContact(contact)}
        />
        <Button
          variant={['no-border', 'xSmall', 'red']}
          title="ACCEPT"
          onPress={() => this.props.acceptContact(contact)}
        />
      </AcceptIgnore>
    )
  }

  renderAddNewContactForm(modal: boolean) {
    const errorMsg = this.state.error ? (
      <Row size={1}>
        <Column>
          <Text variant="error">{this.state.error}</Text>
        </Column>
      </Row>
    ) : null
    return (
      <FormContainer modal={modal}>
        {/* $FlowFixMe submit return type */}
        <Form onSubmit={this.submitNewContact}>
          <Row size={1}>
            {modal && (
              <Column>
                <Text
                  variant="greyMid"
                  size={12}
                  theme={{ textAlign: 'center', marginBottom: 50 }}>
                  Lorem ipsum dolor amet sitim opsos calibri
                  <br />
                  dos ipsum dolor amet sitimus.
                </Text>
              </Column>
            )}
            <Column>
              <TextField name="publicKey" required label="Publick Key" />
            </Column>
            <Column>
              <TextField name="name" label="Name" />
            </Column>
          </Row>
          {modal ? (
            <Row size={1}>
              <Column styles="align-items:center; justify-content: center; flex-direction: row;">
                <Button
                  title="CANCEL"
                  variant={['no-border', 'grey', 'modalButton']}
                  onPress={this.closeModal}
                />
                <Button title="SEND" variant={['red', 'modalButton']} submit />
              </Column>
            </Row>
          ) : (
            <Row size={2} top>
              <Column styles="align-items:flex-end;" smOffset={1}>
                <Button
                  title="SEND INVITATION"
                  variant="onboarding"
                  Icon={CircleArrowRight}
                  submit
                />
              </Column>
            </Row>
          )}
        </Form>
        {errorMsg}
      </FormContainer>
    )
  }

  renderRightSide() {
    const { userContacts } = this.props.contacts
    if (userContacts.length === 0) {
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
                You have no contacts in your address book. Invite someone to
                join you by entering their Public Key or scanning their QR code.
              </Text>
            </Column>
          </Row>
          {this.renderAddNewContactForm(false)}
        </RightContainer>
      )
    }

    const invites = userContacts.filter(
      contact => contact.connectionState !== 'CONNECTED',
    )
    return (
      <RightContainer>
        <ScrollView>
          <Row size={1}>
            <Column>
              <Text variant={['smallTitle', 'blue', 'noPadding', 'bold']}>
                INVITATIONS
              </Text>
            </Column>
          </Row>
          {invites.map(contact => {
            return (
              <InviteCard
                key={contact.localID}
                connectionState={contact.connectionState}>
                <InviteCardIcon>
                  {contact.connectionState === 'SENT' ? (
                    <>
                      <Text variant="blue">
                        <CircleArrowUp width={24} height={24} />
                      </Text>
                      <Text variant="blue" size={9}>
                        Sent
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text variant="red">
                        <CircleArrowDown width={24} height={24} />
                      </Text>
                      <Text variant="red" size={9}>
                        Received
                      </Text>
                    </>
                  )}
                </InviteCardIcon>
                <InviteCardText>
                  <Text variant={['greyMed', 'bold']}>
                    {contact.profile.name || 'Unknown user'}
                  </Text>
                  <Text variant={['greyDark', 'elipsis']} size={11}>
                    {contact.localID}
                  </Text>
                </InviteCardText>
                <InviteCardStatus>
                  {contact.connectionState === 'RECEIVED' ? (
                    this.renderAcceptIgnore(contact)
                  ) : (
                    <Text variant="grey" size={10}>
                      Pending
                    </Text>
                  )}
                </InviteCardStatus>
              </InviteCard>
            )
          })}
        </ScrollView>
      </RightContainer>
    )
  }

  render() {
    return (
      <Container>
        {this.renderContactsList()}
        {this.renderRightSide()}
        {this.state.modalOpen && (
          <InternalModal>
            <ModalTitle>
              <Text variant={['smallTitle', 'blue', 'noPadding', 'bold']}>
                INVITE A NEW CONTACT
              </Text>
              <CloseButton onPress={this.closeModal}>
                <CloseIcon color="#808080" width={12} height={12} />
              </CloseButton>
            </ModalTitle>

            {this.renderAddNewContactForm(true)}
          </InternalModal>
        )}
      </Container>
    )
  }
}

export default createFragmentContainer(ContactsView, {
  contacts: graphql`
    fragment ContactsView_contacts on ContactsQuery
      @argumentDefinitions(userID: { type: "String!" }) {
      userContacts(userID: $userID) {
        peerID
        localID
        connectionState
        profile {
          name
        }
      }
    }
  `,
})
