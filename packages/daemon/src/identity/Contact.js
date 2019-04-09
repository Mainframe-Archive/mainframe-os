// @flow

import { uniqueID } from '@mainframe/utils-id'

import {
  BidirectionalFeed,
  type BidirectionalFeedSerialized,
  type bzzHash,
} from '../swarm/feed'

export type ContactProfile = {
  name?: ?string,
  avatar?: ?string,
  ethAddress?: ?string,
}

export type FirstContactPayload = {
  version: string,
  privateFeed: bzzHash,
}

export type ContactAppsPayload = { [sharedAppID: string]: bzzHash }

export type ContactPayload = {
  version: string,
  profile?: ContactProfile,
  apps?: ContactAppsPayload,
  acceptanceSignature?: string,
}

export type InviteData = {
  chain?: number,
  inviteTX: string,
  fromAddress: string,
  toAddress: string,
  acceptedSignature?: string,
  ethNetwork: string,
  stake: {
    amount: string,
    state: 'sending' | 'staked' | 'reclaiming' | 'reclaimed' | 'seized',
    reclaimedTX?: ?string,
  },
}

export type ContactSerialized = {
  localID: string,
  peerID: string,
  profile: ContactProfile,
  aliasName: ?string,
  sharedFeed: BidirectionalFeedSerialized,
  feedRequestSent: boolean,
  invite?: ?InviteData,
  acceptanceSignature?: ?string,
}

export type ConnectionState =
  | 'connected'
  | 'sent_feed'
  | 'sending_feed'
  | 'declined'
  | 'sending_blockchain'
  | 'sent_blockchain'

export default class Contact {
  static create = (
    peerID: string,
    optional?: {
      aliasName?: string,
      profile?: ContactProfile,
      contactFeed?: string,
      localID?: string,
      acceptanceSignature?: string,
    },
  ): Contact => {
    const sharedFeed = BidirectionalFeed.create({
      remoteFeed: optional && optional.contactFeed,
    })
    sharedFeed.localFeedData = Contact._generateContactPayload(
      optional && optional.acceptanceSignature,
    )
    return new Contact(
      (optional && optional.localID) || uniqueID(),
      peerID,
      (optional && optional.profile) || {},
      optional && optional.aliasName,
      sharedFeed,
      false,
      optional && optional.acceptanceSignature,
    )
  }

  static _generateContactPayload(
    acceptanceSignature?: ?string,
  ): ContactPayload {
    const payload: ContactPayload = {
      version: '1.0.0',
      apps: {},
    }
    if (acceptanceSignature) {
      payload.acceptanceSignature = acceptanceSignature
    }
    return payload
  }

  static fromJSON = (contactSerialized: ContactSerialized): Contact => {
    return new Contact(
      contactSerialized.localID,
      contactSerialized.peerID,
      contactSerialized.profile,
      contactSerialized.aliasName,
      BidirectionalFeed.fromJSON(contactSerialized.sharedFeed),
      contactSerialized.feedRequestSent,
      contactSerialized.acceptanceSignature,
      contactSerialized.invite,
    )
  }

  static toJSON = (contact: Contact): ContactSerialized => ({
    localID: contact.localID,
    peerID: contact.peerID,
    profile: contact.profile,
    aliasName: contact._aliasName,
    sharedFeed: BidirectionalFeed.toJSON(contact.sharedFeed),
    feedRequestSent: contact._feedRequestSent,
    acceptanceSignature: contact.acceptanceSignature,
    invite: contact._invite,
  })

  _localID: string
  _peerID: string
  _sharedFeed: BidirectionalFeed
  _feedRequestSent: boolean
  _aliasName: ?string
  _acceptanceSignature: ?string
  _invite: ?InviteData
  _profile: {
    name: ?string,
    avatar: ?string,
    ethAddress: ?string,
  }

  constructor(
    localID: string,
    peerID: string,
    profile: ContactProfile,
    aliasName: ?string,
    sharedFeed: BidirectionalFeed,
    feedRequestSent?: boolean,
    acceptanceSignature?: ?string,
    invite?: ?InviteData,
  ) {
    this._localID = localID
    this._peerID = peerID
    this._profile = profile
    this._aliasName = aliasName
    this._sharedFeed = sharedFeed
    this._feedRequestSent = !!feedRequestSent
    this._acceptanceSignature = acceptanceSignature
    this._invite = invite
  }

  get localID(): string {
    return this._localID
  }

  get peerID(): string {
    return this._peerID
  }

  get sharedFeed(): BidirectionalFeed {
    return this._sharedFeed
  }

  get profile(): ContactProfile {
    return this._profile
  }

  set profile(profile: ContactProfile) {
    this._profile = profile
  }

  get name(): ?string {
    return this._aliasName || this._profile.name
  }

  set aliasName(aliasName: ?string): void {
    this._aliasName = aliasName
  }

  set feedRequestSent(feedRequestSent: boolean): void {
    this._feedRequestSent = feedRequestSent
  }

  get connectionState(): ConnectionState {
    if (!this._feedRequestSent) return 'sending_feed'
    if (this.sharedFeed.remoteFeed) return 'connected'
    if (this.invite) {
      switch (this.invite.stake.state) {
        case 'sending':
          return 'sending_blockchain'
        case 'staked':
          return 'sent_blockchain'
        case 'seized':
          return 'declined'
      }
    }
    return 'sent_feed'
  }

  get acceptanceSignature(): ?string {
    return this._acceptanceSignature
  }

  set acceptanceSignature(signature: ?string): void {
    this._acceptanceSignature = signature
  }

  get invite(): ?InviteData {
    return this._invite
  }

  generatefirstContactPayload(): FirstContactPayload {
    if (!this.sharedFeed.localFeed.feedHash) {
      throw new Error('Contact feed manifest has not been synced')
    }
    return {
      version: '1.0.0',
      privateFeed: this.sharedFeed.localFeed.feedHash,
    }
  }
}
