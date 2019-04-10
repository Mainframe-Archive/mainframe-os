// @flow

import type { ContactResult } from '@mainframe/client'
import type { App, OwnApp } from '../app'
import type { SharedAppData } from '../contact'
import type { Contact, OwnUserIdentity, PeerUserIdentity } from '../identity'

export type AppCreatedEvent = {|
  type: 'app_created',
  app: OwnApp,
|}
export type AppChangedEvent = {|
  type: 'app_changed',
  app: OwnApp,
  change: 'versionCreated' | 'versionPublished',
|}
export type AppInstalledEvent = {|
  type: 'app_installed',
  app: App,
  userID: string,
|}
export type AppUpdateEvent = {|
  type: 'app_update',
  app: App,
  version: string,
  status: 'updateAvailable' | 'updateDownloading' | 'updateApplied',
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
    | 'feedRequestSent'
    | 'remoteFeed'
    | 'localFeed'
    | 'profile'
    | 'inviteAccepted'
    | 'inviteDeclined'
    | 'inviteFailed'
    | 'inviteReceived'
    | 'inviteSent'
    | 'stakeError'
    | 'stakeReclaimMined'
    | 'stakeReclaimProcessing',
|}
export type ContactDeletedEvent = {|
  type: 'contact_deleted',
  contactID: string,
  userID: string,
|}

export type EthNetworkChangedEvent = {|
  type: 'eth_network_changed',
  network: string,
|}

export type EthAccountsChangedEvent = {|
  type: 'eth_accounts_changed',
  userID: string,
  change: 'userDefault' | 'accountAdded' | 'appUserDefault',
|}

export type InvitesChangedEvent = {|
  type: 'invites_changed',
  userID: string,
  contact: ContactResult,
  change: 'inviteReceived' | 'inviteRejected',
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
  | AppChangedEvent
  | AppDataChangedEvent
  | AppInstalledEvent
  | AppUpdateEvent
  | ContactCreatedEvent
  | ContactChangedEvent
  | ContactDeletedEvent
  | EthAccountsChangedEvent
  | EthNetworkChangedEvent
  | InvitesChangedEvent
  | PeerCreatedEvent
  | PeerChangedEvent
  | PeerDeletedEvent
  | UserCreatedEvent
  | UserChangedEvent
  | UserDeletedEvent
  | VaultCreatedEvent
  | VaultOpenedEvent

export type ContextEventType = $PropertyType<ContextEvent, 'type'>
