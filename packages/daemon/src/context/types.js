// @flow

import type { OwnApp } from '../app'
import type { SharedAppData } from '../contact'
import type { Contact, OwnUserIdentity, PeerUserIdentity } from '../identity'

export type AppCreatedEvent = {|
  type: 'app_created',
  app: OwnApp,
|}

export type AppDataChangedEvent = {|
  type: 'app_data_changed',
  sharedData: SharedAppData,
  appID: string,
  contactID: string,
|}

export type ContactCreatedEvent = {|
  type: 'contact_created',
  contact: Contact,
  userID: string,
|}
export type ContactChangedEvent = {|
  type: 'contact_changed',
  contact: Contact,
  userID: string,
  change:
    | 'peerChanged'
    | 'requestSent'
    | 'remoteFeed'
    | 'localFeed'
    | 'profile',
|}
export type ContactDeletedEvent = {|
  type: 'contact_deleted',
  contactID: string,
  userID: string,
|}

export type PeerCreatedEvent = {|
  type: 'peer_created',
  peer: PeerUserIdentity,
|}
export type PeerChangedEvent = {|
  type: 'peer_changed',
  peer: PeerUserIdentity,
|}
export type PeerDeletedEvent = {|
  type: 'peer_deleted',
  peerID: string,
|}

export type UserCreatedEvent = {|
  type: 'user_created',
  user: OwnUserIdentity,
|}
export type UserChangedEvent = {|
  type: 'user_changed',
  user: OwnUserIdentity,
  change: string,
|}
export type UserDeletedEvent = {|
  type: 'user_deleted',
  userID: string,
|}

export type VaultCreatedEvent = {|
  type: 'vault_created',
|}
export type VaultOpenedEvent = {|
  type: 'vault_opened',
|}

export type ContextEvent =
  | AppCreatedEvent
  | AppDataChangedEvent
  | ContactCreatedEvent
  | ContactChangedEvent
  | ContactDeletedEvent
  | PeerCreatedEvent
  | PeerChangedEvent
  | PeerDeletedEvent
  | UserCreatedEvent
  | UserChangedEvent
  | UserDeletedEvent
  | VaultCreatedEvent
  | VaultOpenedEvent

export type ContextEventType = $PropertyType<ContextEvent, 'type'>
