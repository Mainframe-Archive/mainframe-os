// @flow

import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native-web'
import ContactsIcon from '@morpheus-ui/icons/ContactsMd'
import styled from 'styled-components/native'
import { Text, Button } from '@morpheus-ui/core'

import colors from '../colors'
import rpc from './rpc'

export type SelectedContactIDs = Array<string>

type Contact = {
  localID: string,
  profile: {
    name: string,
    ethAddress?: ?string,
  },
}

type Props = {
  userID: string,
  multiSelect?: ?boolean,
  onSelectedContacts: (contactIDs: SelectedContactIDs) => void,
}

type State = {
  contacts: Array<Contact>,
  selectedContacts: Set<string>,
}

const Header = styled.View`
  padding-vertical: 12px;
  flex-direction: row;
`

const ContactRow = styled.View`
  padding: 10px;
  border-color: ${colors.GREY_DARK_48};
  border-bottom-width: 1px;
  background-color: ${props =>
    props.selected ? colors.GREY_DARK_48 : colors.GREY_DARK_3C};
`

const ScrollViewStyled = styled.ScrollView`
  max-height: 250px;
`

const ButtonsContainer = styled.View`
  flex-direction: row;
  margin-top: 10px;
`

export default class ContactPickerView extends Component<Props, State> {
  state = {
    contacts: [],
    selectedContacts: new Set(),
  }

  componentDidMount() {
    this.fetchContacts()
  }

  async fetchContacts() {
    const { contacts } = await rpc.getUserContacts(this.props.userID)
    this.setState({ contacts })
  }

  onSelectContact(contact: Contact) {
    if (this.props.multiSelect) {
      const { selectedContacts } = this.state
      if (selectedContacts.has(contact.localID)) {
        selectedContacts.delete(contact.localID)
      } else {
        selectedContacts.add(contact.localID)
      }
      this.setState({ selectedContacts })
    } else {
      this.props.onSelectedContacts([contact.localID])
    }
  }

  onSubmit = () => {
    this.props.onSelectedContacts(Array.from(this.state.selectedContacts))
  }

  onPressCancel = () => {
    this.props.onSelectedContacts([])
  }

  render() {
    const rows = this.state.contacts.map(c => {
      const onPress = () => this.onSelectContact(c)
      const selected = this.state.selectedContacts.has(c.localID)
      return (
        <TouchableOpacity key={c.localID} onPress={onPress}>
          <ContactRow selected={selected}>
            <Text styles="color:#eee">{c.profile.name}</Text>
          </ContactRow>
        </TouchableOpacity>
      )
    })
    const submitButton = this.props.multiSelect ? (
      <Button title="DONE" onPress={() => this.onSubmit()} />
    ) : null

    const title = this.props.multiSelect ? 'Select Contacts' : 'Select Contact'
    return (
      <>
        <Header>
          <ContactsIcon width={25} height={25} color="#ccc" />
          <Text styles="padding-left: 15px; color:#ccc; font-size:13px; font-weight: bold;">
            {title}
          </Text>
        </Header>
        <ScrollViewStyled>{rows}</ScrollViewStyled>
        <ButtonsContainer>
          {submitButton}
          <Button title="CANCEL" onPress={() => this.onPressCancel()} />
        </ButtonsContainer>
      </>
    )
  }
}
