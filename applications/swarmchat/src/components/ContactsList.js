// @flow

import type { hex } from '@mainframe/utils-hex'
import React, { PureComponent, Fragment } from 'react'
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native-web'

import type { Contact, Contacts } from '../types'

import Avatar from './Avatar'
import { COLORS } from './styles'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  titleView: {
    padding: 5,
  },
  titleText: {
    color: COLORS.TEXT_CONTRAST,
    fontSize: 20,
  },
  group: {
    paddingLeft: 5,
    marginBottom: 5,
  },
  groupTitleView: {
    padding: 5,
  },
  groupTitleText: {
    color: COLORS.TEXT_CONTRAST,
    fontSize: 16,
  },
  contactItem: {
    flexDirection: 'row',
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    padding: 2,
  },
  contactItemText: {
    color: COLORS.TEXT_CONTRAST,
    lineHeight: 32,
  },
  contactItemSelected: {
    backgroundColor: COLORS.BACKGROUND,
  },
  contactItemSelectedText: {
    color: COLORS.TEXT_ALT,
  },
  inviteButtonView: {
    padding: 5,
  },
})

type Props = {
  contacts: Contacts,
  onOpenInviteModal: () => void,
  onSelectKey: (publicKey: hex) => void,
  selectedKey?: ?hex,
}

export default class ContactsList extends PureComponent<Props> {
  renderGroup(title: string, contacts: Array<Contact>) {
    if (contacts.length === 0) {
      return null
    }

    const { onSelectKey, selectedKey } = this.props
    const items = contacts.map(c => {
      const isSelected = selectedKey === c.key
      return (
        <TouchableWithoutFeedback
          key={c.key}
          onPress={() => onSelectKey(c.key)}>
          <View
            style={[
              styles.contactItem,
              isSelected && styles.contactItemSelected,
            ]}>
            <Avatar publicKey={c.key} size="small" />
            <Text
              numberOfLines={1}
              style={[
                styles.contactItemText,
                isSelected && styles.contactItemSelectedText,
              ]}>
              &nbsp;
              {c.username || c.key}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      )
    })

    return (
      <View style={styles.group}>
        <View style={styles.groupTitleView}>
          <Text style={styles.groupTitleText}>{title}</Text>
        </View>
        {items}
      </View>
    )
  }

  render() {
    const { contacts, onOpenInviteModal } = this.props
    const contactsList = Object.values(contacts)

    let contents = null
    if (contactsList.length > 0) {
      const groups = {
        added: [],
        received: [],
        sent: [],
      }
      // $FlowFixMe: Object.values() losing type
      contactsList.forEach((c: Contact) => {
        const group = groups[c.type.split('_')[0]]
        if (group == null) {
          console.warn('Invalid contact type', c)
        } else {
          group.push(c)
        }
      })
      contents = (
        <Fragment>
          {this.renderGroup('Added', groups.added)}
          {this.renderGroup('Received', groups.received)}
          {this.renderGroup('Sent', groups.sent)}
        </Fragment>
      )
    }

    return (
      <ScrollView style={styles.root}>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>Contacts</Text>
        </View>
        {contents}
        <View style={styles.inviteButtonView}>
          <Button
            color={COLORS.BLUE_SWARM}
            onPress={onOpenInviteModal}
            title="Add contact"
          />
        </View>
      </ScrollView>
    )
  }
}
