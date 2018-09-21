// @flow

import { hexType, type hex } from '@mainframe/utils-hex'
import sum from 'hash-sum'
import React, { Component } from 'react'
import Modal from 'react-modal'
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native-web'
import type { Subscription } from 'rxjs'

import { getAppData, setAppData } from '../store'
import type { Chats, Contact, Contacts } from '../types'

import type {
  default as SwarmChat,
  IncomingChatEvent,
  IncomingContactEvent,
} from '../lib/SwarmChat'

import Avatar from './Avatar'
import ContactScreen from './ContactScreen'
import ContactsList from './ContactsList'
import FormError from './FormError'
import FormInput from './FormInput'
import Loader from './Loader'
import { COLORS } from './styles'

const PUBLIC_KEY_RE = /^0x[0-9a-f]{130}$/

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 200,
    flexDirection: 'column',
    backgroundColor: COLORS.BACKGROUND_CONTRAST,
  },
  sidebarHeader: {
    padding: 5,
    flexDirection: 'row',
  },
  sidebarHeaderText: {
    fontSize: 18,
    lineHeight: 48,
    color: COLORS.TEXT_CONTRAST,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  },
  modalSection: {
    paddingVertical: 5,
  },
  spacer: {
    height: 10,
  },
})

type Props = {
  client: SwarmChat,
}

type State = {
  chats: Chats,
  contactKey: string,
  contacts: Contacts,
  inviteErrorMessage: ?string,
  inviteModalOpen: boolean,
  publicKey: ?hex,
  selectedKey: ?hex,
  settingsModalOpen: boolean,
  username: string,
}

const DEFAULT_STATE: State = {
  chats: {},
  contactKey: '',
  contacts: {},
  inviteErrorMessage: undefined,
  inviteModalOpen: false,
  publicKey: undefined,
  selectedKey: undefined,
  settingsModalOpen: false,
  username: '',
}

export default class App extends Component<Props, State> {
  _chatSubs: { [key: string]: Subscription } = {}
  _contactSub: ?Subscription

  state = DEFAULT_STATE

  async setup() {
    const { client } = this.props
    const { publicKey } = await client.getOwnInfo()
    const [appData, contactsSub] = await Promise.all([
      getAppData(publicKey),
      client.createContactSubscription(),
    ])
    this.setState({ ...appData, publicKey }, () => {
      this._contactSub = contactsSub.subscribe(this.onReceiveContactEvent)
      this.createChatSubscriptions()
    })
  }

  createChatSubscriptions = async () => {
    await Promise.all(
      Object.values(this.state.contacts)
        // $FlowFixMe: Object.values() losing type
        .filter(c => c.type === 'added')
        // $FlowFixMe: Object.values() losing type
        .map(this.createChatSubscription),
    )
  }

  createChatSubscription = async (c: Contact): Subscription => {
    const chat = await this.props.client.createChatSubscription(c.key, c.topic)
    const subscription = chat.subscribe(this.onReceiveChatEvent)
    this._chatSubs[c.key] = subscription
    return subscription
  }

  async saveAppData() {
    const { chats, contacts, publicKey, selectedKey, username } = this.state
    if (publicKey == null) {
      console.warn('Cannot save app data before public key is known')
    } else {
      try {
        await setAppData(publicKey, { chats, contacts, selectedKey, username })
      } catch (err) {
        console.warn(err)
      }
    }
  }

  componentDidMount() {
    this.setup()
  }

  componentDidUpdate() {
    this.saveAppData()
  }

  componentWillUnmount() {
    // $FlowFixMe: Object.values() losing type
    Object.values(this._chatSubs).map(sub => sub.unsubscribe())
    if (this._contactSub != null) {
      this._contactSub.unsubscribe()
    }
  }

  onResetAppData = () => {
    const { publicKey } = this.state
    this.setState({ ...DEFAULT_STATE, publicKey }, () => {
      setAppData(publicKey)
    })
  }

  onReceiveChatEvent = (ev: IncomingChatEvent) => {
    this.setState(({ chats }) => {
      const id = sum(ev)
      const existing = chats[ev.key]
      if (existing == null) {
        return {
          chats: {
            ...chats,
            [ev.key]: {
              messages: [
                {
                  id,
                  sender: ev.key,
                  text: ev.payload.text,
                  timestamp: ev.utc_timestamp,
                },
              ],
              pointer: 0,
            },
          },
        }
      } else {
        if (existing.messages.some(msg => msg.id === id)) {
          console.warn('duplicate message', ev)
          return null
        }
        return {
          chats: {
            ...chats,
            [ev.key]: {
              ...existing,
              messages: [
                ...existing.messages,
                {
                  id,
                  sender: ev.key,
                  text: ev.payload.text,
                  timestamp: ev.utc_timestamp,
                },
              ],
            },
          },
        }
      }
    })
  }

  onReceiveContactEvent = (ev: IncomingContactEvent) => {
    let createChat
    this.setState(
      ({ contacts }) => {
        const existing = contacts[ev.key]
        if (
          ev.type === 'contact_request' &&
          (existing == null || existing.type === 'received_pending')
        ) {
          // New contact or update existing with new payload
          return {
            contacts: {
              ...contacts,
              [ev.key]: {
                key: ev.key,
                type: 'received_pending',
                topic: ev.payload.topic,
                username: ev.payload.username,
                address: ev.payload.overlay_address,
              },
            },
          }
        } else if (
          ev.type === 'contact_response' &&
          existing != null &&
          (existing.type === 'sent_declined' ||
            existing.type === 'sent_pending')
        ) {
          // Response from contact, set type to "added" or "sent_declined" accordingly
          const contact = {
            ...existing,
            type: ev.payload.contact === true ? 'added' : 'sent_declined',
            username: ev.payload.username,
            address: ev.payload.overlay_address,
          }
          if (contact.type === 'added') {
            createChat = contact
          }
          return {
            contacts: { ...contacts, [ev.key]: contact },
          }
        }
        return null
      },
      async () => {
        if (createChat != null) {
          await this.createChatSubscription(createChat)
        }
      },
    )
  }

  onChangeContactKey = (value: string) => {
    this.setState({ contactKey: value })
  }

  onChangeUsername = (value: string) => {
    this.setState({ username: value })
  }

  onSendChatMessage = async (contactKey: hex, text: string) => {
    const contact = this.state.contacts[(contactKey: string)]
    if (contact == null) {
      throw new Error('Unknown contact')
    }
    if (contact.type !== 'added') {
      throw new Error('Cannot send message until contact is added')
    }
    if (this._chatSubs[contactKey] == null) {
      throw new Error('Chat subscription does not exist')
    }

    await this.props.client.sendChatMessage(contactKey, contact.topic, { text })

    this.setState(({ chats, publicKey }) => {
      const chat = chats[contactKey] || { messages: [], pointer: 0 }

      const message = {
        id: undefined,
        sender: publicKey,
        text,
        timestamp: Date.now(),
      }
      message.id = sum(message)

      return {
        chats: {
          ...chats,
          [contactKey]: {
            ...chat,
            messages: [...chat.messages, message],
          },
        },
      }
    })
  }

  onSubmitContactRequest = async () => {
    const { contactKey, publicKey, username } = this.state
    if (contactKey.length === 0) {
      return
    }

    if (contactKey === publicKey) {
      this.setState({
        inviteErrorMessage: 'Invalid contact key: this is your own key',
      })
    } else if (!PUBLIC_KEY_RE.test(contactKey)) {
      this.setState({
        inviteErrorMessage:
          'Invalid contact key: must be an hexadecimal string prefixed with "0x"',
      })
    } else {
      this.setState({ inviteModalOpen: false })
      const data = username.length > 0 ? { username } : undefined
      const topic = await this.props.client.sendContactRequest(
        hexType(contactKey),
        data,
      )
      this.setState(({ contacts }) => ({
        contactKey: '',
        contacts: {
          ...contacts,
          [contactKey]: {
            key: contactKey,
            type: 'sent_pending',
            topic,
          },
        },
      }))
    }
  }

  sendContactResponse = async (key: hex, accepted: boolean) => {
    await this.props.client.sendContactResponse(key, accepted, {
      username: this.state.username,
    })

    this.setState(
      ({ contacts }) => {
        const existing = contacts[(key: string)]
        return {
          contacts: {
            ...contacts,
            [key]: {
              ...existing,
              type: accepted ? 'added' : 'received_declined',
            },
          },
        }
      },
      async () => {
        if (accepted) {
          await this.createChatSubscription(this.state.contacts[(key: string)])
        }
      },
    )
  }

  onOpenInviteModal = () => {
    this.setState({ inviteModalOpen: true })
  }

  onCloseInviteModal = () => {
    this.setState({ inviteModalOpen: false })
  }

  onOpenSettingsModal = () => {
    this.setState({ settingsModalOpen: true })
  }

  onCloseSettingsModal = () => {
    this.setState({ settingsModalOpen: false })
  }

  onSelectKey = (selectedKey: hex) => {
    this.setState({ selectedKey })
  }

  onAcceptContact = async () => {
    const { selectedKey } = this.state
    if (selectedKey != null) {
      await this.sendContactResponse(selectedKey, true)
    }
  }

  onDeclineContact = async () => {
    const { selectedKey } = this.state
    if (selectedKey != null) {
      await this.sendContactResponse(selectedKey, false)
    }
  }

  onResendContactRequest = async () => {
    const { selectedKey, username } = this.state
    if (selectedKey != null) {
      const data = username ? { username } : undefined
      await this.props.client.sendContactRequest(selectedKey, data)
    }
  }

  render() {
    const {
      chats,
      contactKey,
      contacts,
      inviteErrorMessage,
      inviteModalOpen,
      publicKey,
      selectedKey,
      settingsModalOpen,
      username,
    } = this.state

    if (publicKey == null) {
      return <Loader />
    }

    let content = null // TODO: default screen
    if (selectedKey != null) {
      const keyStr: string = selectedKey
      content = (
        <ContactScreen
          chat={chats[keyStr]}
          contact={contacts[keyStr]}
          onAcceptContact={this.onAcceptContact}
          onDeclineContact={this.onDeclineContact}
          onResendContactRequest={this.onResendContactRequest}
          onSendChatMessage={this.onSendChatMessage}
        />
      )
    }

    return (
      <View style={styles.root}>
        <View style={styles.sidebar}>
          <TouchableOpacity
            onPress={this.onOpenSettingsModal}
            style={styles.sidebarHeader}>
            <Avatar publicKey={publicKey} size="large" />
            <Text numberOfLines={1} style={styles.sidebarHeaderText}>
              &nbsp;
              {username || publicKey}
            </Text>
          </TouchableOpacity>
          <ContactsList
            contacts={contacts}
            onOpenInviteModal={this.onOpenInviteModal}
            onSelectKey={this.onSelectKey}
            selectedKey={selectedKey}
          />
        </View>
        <View style={styles.content}>{content}</View>
        <Modal
          isOpen={inviteModalOpen}
          onRequestClose={this.onCloseInviteModal}>
          <FormError message={inviteErrorMessage} />
          <View>
            <Text>Contact public key:</Text>
            <FormInput
              onChangeText={this.onChangeContactKey}
              onSubmitEditing={this.onSubmitContactRequest}
              value={contactKey}
            />
          </View>
          <View>
            <Text>Your username (optional):</Text>
            <FormInput
              onChangeText={this.onChangeUsername}
              onSubmitEditing={this.onSubmitContactRequest}
              value={username}
            />
          </View>
          <Button
            color={COLORS.BUTTON_PRIMARY}
            disabled={contactKey.length === 0}
            onPress={this.onSubmitContactRequest}
            title="Invite contact"
          />
        </Modal>
        <Modal
          isOpen={settingsModalOpen}
          onRequestClose={this.onCloseSettingsModal}>
          <View style={styles.modalSection}>
            <Text>Your public key: {publicKey}</Text>
          </View>
          <View style={styles.modalSection}>
            <Text>Your username (optional):</Text>
            <FormInput onChangeText={this.onChangeUsername} value={username} />
          </View>
          <Button
            color={COLORS.BUTTON_PRIMARY}
            onPress={this.onCloseSettingsModal}
            title="Close"
          />
          <View style={styles.spacer} />
          <Button
            color={COLORS.BLUE_SWARM}
            onPress={this.onResetAppData}
            title="Reset application data"
          />
          <View style={styles.spacer} />
        </Modal>
      </View>
    )
  }
}
