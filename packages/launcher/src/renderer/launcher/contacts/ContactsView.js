// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Text, Button, Row, Column, TextField } from '@morpheus-ui/core'
import { Form, type FormSubmitPayload } from '@morpheus-ui/forms'
import PlusIcon from '@morpheus-ui/icons/PlusSymbolSm'
import SearchIcon from '@morpheus-ui/icons/SearchSm'
import CircleArrowRight from '@morpheus-ui/icons/CircleArrowRight'
import CircleArrowDown from '@morpheus-ui/icons/CircleArrowDownMd'
import CircleArrowUp from '@morpheus-ui/icons/CircleArrowUpMd'
import CloseIcon from '@morpheus-ui/icons/Close'

const Container = styled.View`
  position: relative;
  flex-direction: row;
`

const ContactsListContainer = styled.View`
  width: 260px;
  border-right: 1px solid #f5f5f5;
  height: calc(100vh - 40px);
`

const ContactCard = styled.TouchableOpacity`
  min-height: 50px;
  padding: 8px 10px 8px 0;
  flex-direction: row;
  border-bottom: 1px solid #f5f5f5;
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
  border-left: 3px solid ${props => props.theme.colors.PRIMARY_BLUE};
  border-radius: 3px;
  ${props =>
    props.status === 'received' &&
    `border-left: 3px solid ${props.theme.colors.PRIMARY_RED};`}
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
  ${props => props.hascontacts && `border-bottom: 1px solid #f5f5f5;`}
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
  border-bottom: 1px solid #f5f5f5;
  height: 35px;
  margin-top: 5px;
  align-items: center;
  justify-content: flex-start;
`

type Contact = {
  id: string,
  name?: string,
  status: 'sent' | 'received' | 'accepted',
}

type Props = {
  data: Array<Contact>,
  acceptContact: (contact: Contact) => void,
  ignoreContact: (contact: Contact) => void,
  onSubmitNewContact: (payload: Contact) => void,
}

type State = {
  modalOpen: boolean,
}

export default class ContactsView extends Component<Props, State> {
  state = {
    modalOpen: false,
  }

  openModal = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

  submitNewContact = (payload: FormSubmitPayload) => {
    // eslint-disable-next-line no-console
    console.log(payload)
    if (payload.valid) {
      this.props.onSubmitNewContact({
        id: payload.fields.publicKey,
        name: payload.fields.name,
        status: 'sent',
      })
      if (this.state.modalOpen) {
        this.setState({ modalOpen: false })
      }
    }
  }

  renderContactsList() {
    return (
      <ContactsListContainer>
        <ContactsListHeader hascontacts={this.props.data.length > 0}>
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
        {this.props.data.length === 0 ? (
          <NoContacts>
            <Text variant={['grey', 'small']}>No Contacts</Text>
          </NoContacts>
        ) : (
          <ScrollView>
            {this.props.data.map(contact => {
              return (
                <ContactCard key={contact.id}>
                  <ContactCardText>
                    <Text variant={['greyMed', 'elipsis']} size={13}>
                      {contact.name || contact.id}
                    </Text>
                    {contact.status === 'sent' ? (
                      <Text variant={['grey']} size={10}>
                        Pending
                      </Text>
                    ) : null}
                  </ContactCardText>
                  {contact.status === 'received'
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
    return (
      <FormContainer modal={modal}>
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
      </FormContainer>
    )
  }

  renderRightSide() {
    if (this.props.data.length === 0) {
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

    const invites = this.props.data.filter(
      contact => contact.status !== 'accepted',
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
              <InviteCard key={contact.id} status={contact.status}>
                <InviteCardIcon>
                  {contact.status === 'sent' ? (
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
                    {contact.name || 'Unknown user'}
                  </Text>
                  <Text variant={['greyDark', 'elipsis']} size={11}>
                    {contact.id}
                  </Text>
                </InviteCardText>
                <InviteCardStatus>
                  {contact.status === 'received' ? (
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
