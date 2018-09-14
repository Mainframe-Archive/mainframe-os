// @flow

import type { hex } from '@mainframe/utils-hex'

export type SystemMessageType = 'chat_joined' | 'chat_left'

export type SystemMessage = {
  id: string,
  sender: hex,
  timestamp: number,
  type: SystemMessageType,
}

export type UserMessage = {
  id: string,
  sender: hex,
  text: string,
  timestamp: number,
}

export type Message = SystemMessage | UserMessage

export type Chat = {
  messages: Array<UserMessage>,
  pointer: number,
}

export type Chats = { [key: string]: Chat }

export type ContactState =
  | 'added'
  | 'received_declined'
  | 'received_pending'
  | 'sent_declined'
  | 'sent_pending'

export type Contact = {
  key: hex,
  type: ContactState,
  topic: hex,
  username?: ?string,
  address?: ?hex,
}

export type Contacts = { [key: string]: Contact }
