// @flow

import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native-web'
import styled from 'styled-components/native'
import { Text, Button } from '@morpheus-ui/core'

import rpc from './rpc'

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
  onSelectedContacts: (id: Array<string>) => void,
}

type State = {
  contacts: Array<Contact>,
  selectedContacts: Set<string>,
}

const ContactRow = styled.View`
  padding: 10px;
  border-color: #eee;
  border-bottom-width: 1px;
  background-color: ${props => (props.selected ? '#eee' : '#fff')};
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
            <Text>{c.profile.name}</Text>
          </ContactRow>
        </TouchableOpacity>
      )
    })
    const submitButton = this.props.multiSelect ? (
      <Button title="DONE" onPress={() => this.onSubmit()} />
    ) : null
    return (
      <>
        <ScrollViewStyled>{rows}</ScrollViewStyled>
        <ButtonsContainer>
          {submitButton}
          <Button title="CANCEL" onPress={() => this.onPressCancel()} />
        </ButtonsContainer>
      </>
    )
  }
}
