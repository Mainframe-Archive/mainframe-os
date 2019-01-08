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

const Container = styled.View`
  flex-direction: row;
`

const ContactsListContainer = styled.View`
  width: 260px;
  border-right: 1px solid #f5f5f5;
  height: calc(100vh - 40px);
`

const ContactCard = styled.TouchableOpacity`
  min-height: 50px;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
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
}

type State = {}

export default class ContactsView extends Component<Props, State> {
  submitNewContact = (payload: FormSubmitPayload) => {
    // eslint-disable-next-line no-console
    console.log(payload)
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
              const status =
                contact.status === 'accepted' ? 'Accepted' : 'Pending'
              return (
                <ContactCard key={contact.id}>
                  <Text variant={['greyMed']} size={13}>
                    {contact.name || contact.id}
                  </Text>
                  <Text variant={['grey']} size={10}>
                    {status}
                  </Text>
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

  renderAddNewContactForm() {
    return (
      <>
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
              You have no contacts in your address book. Invite someone to join
              you by entering their Public Key or scanning their QR code.
            </Text>
          </Column>
        </Row>
        <FormContainer>
          <Form onSubmit={this.submitNewContact}>
            <Row size={1}>
              <Column>
                <TextField name="publicKey" required label="Publick Key" />
              </Column>
              <Column>
                <TextField name="name" label="Name" />
              </Column>
            </Row>
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
          </Form>
        </FormContainer>
      </>
    )
  }

  renderRightSide() {
    if (this.props.data.length === 0) {
      return <RightContainer>{this.renderAddNewContactForm()}</RightContainer>
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
                  <Text variant="greyDark" size={11}>
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
      </Container>
    )
  }
}
