// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Button, Text, Checkbox } from '@morpheus-ui/core'
import Avatar from '../UIComponents/Avatar'
import rpc from './rpc'

import { condenseAddress } from './WalletPickerView'

export type SelectedContactIDs = Array<string>

type Contact = {
  localID: string,
  publicFeed: string,
  profile: {
    name: string,
    ethAddress?: ?string,
  },
}

type Props = {
  userID: string,
  multiSelect?: ?boolean,
  onSelectedContacts: (contactIDs: SelectedContactIDs) => void,
  onReject: () => void,
}

type State = {
  contacts: Array<Contact>,
  selectedContacts: Set<string>,
  hover: ?string,
}

const Container = styled.View``

const ContactRow = styled.View`
  padding-vertical: 10px;
  padding-right: 20px;
  padding-left: 20px;
  border-color: #303030;
  border-bottom-width: 1px;

  ${props => props.last && 'border-bottom-width: 0;'}
  flex-direction: row;
  align-items: center;
`

const ContactData = styled.View`
  flex: 1;
  padding: 0 20px 0 10px;
`

const ScrollViewStyled = styled.ScrollView`
  max-height: 250px;
`

const ButtonsContainer = styled.View`
  flex-direction: row;
  margin-top: 20px;
  padding: 0 20px 20px 20px;
`

const TouchableOpacity = styled.TouchableOpacity`
  ${props => props.hover && `background-color: #2C2C2C;`}
`

export default class ContactPickerView extends Component<Props, State> {
  state = {
    contacts: [],
    selectedContacts: new Set(),
    hover: null,
  }

  componentDidMount() {
    this.fetchContacts()
  }

  async fetchContacts() {
    const { contacts } = await rpc.getUserContacts(this.props.userID)
    this.setState({ contacts })
  }

  checkContact(contact: Contact) {
    const { selectedContacts } = this.state
    if (selectedContacts.has(contact.localID)) {
      selectedContacts.delete(contact.localID)
    } else {
      selectedContacts.add(contact.localID)
    }
    this.setState({ selectedContacts })
  }

  onSubmit = () => {
    this.props.onSelectedContacts(Array.from(this.state.selectedContacts))
  }

  releaseHover = () => {
    this.setState({ hover: null })
  }

  setHover = (id: string) => {
    this.setState({ hover: id })
  }

  render() {
    const rows = this.state.contacts.map((c, i) => {
      const onPress = () => this.props.onSelectedContacts([c.localID])
      const selected = this.state.selectedContacts.has(c.localID)
      const content = (
        <ContactRow key={c.localID} last={i === this.state.contacts.length - 1}>
          <Avatar id={c.publicFeed} size="xSmall" />
          <ContactData selected={selected}>
            <Text size={13} color="#FFF">
              {c.profile.name}
            </Text>
            <Text size={10} color="#F9F9F9" variant="mono">
              {condenseAddress(c.profile.ethAddress)}
            </Text>
          </ContactData>
          {this.props.multiSelect && (
            <Checkbox
              variant="TrustedUI"
              onChange={() => this.checkContact(c)}
            />
          )}
        </ContactRow>
      )

      if (this.props.multiSelect) {
        return content
      }

      const setHover = () => this.setHover(c.localID)
      return (
        <TouchableOpacity
          className="transition"
          hover={this.state.hover === c.localID}
          onFocus={setHover}
          onBlur={this.releaseHover}
          onMouseOver={setHover}
          onMouseOut={this.releaseHover}
          key={c.localID}
          onPress={onPress}>
          {content}
        </TouchableOpacity>
      )
    })
    const submitButton = this.props.multiSelect ? (
      <ButtonsContainer>
        <Button
          variant={['TuiButton', 'TuiButtonDismiss']}
          title="REJECT"
          onPress={this.props.onReject}
        />
        <Button
          disabled={!this.state.selectedContacts.size}
          variant={['TuiButton']}
          title="CONFIRM"
          onPress={this.onSubmit}
        />
      </ButtonsContainer>
    ) : null

    return (
      <Container>
        <ScrollViewStyled>{rows}</ScrollViewStyled>
        {submitButton}
      </Container>
    )
  }
}
