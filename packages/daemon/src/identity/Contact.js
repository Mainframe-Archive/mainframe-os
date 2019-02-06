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

export type ContactPayload = {
  version: string,
  profile?: ContactProfile,
  apps?: { [appPubKey: string]: bzzHash },
}

export type ContactSerialized = {
  localID: string,
  peerID: string,
  profile: ContactProfile,
  aliasName: ?string,
  sharedFeed: BidirectionalFeedSerialized,
  requestSent: boolean,
}

export type ConnectionState = 'connected' | 'sent' | 'sending'

export default class Contact {
  static create = (
    peerID: string,
    optional?: {
      aliasName?: string,
      profile?: ContactProfile,
      contactFeed?: string,
      localID?: string,
    },
  ): Contact => {
    const sharedFeed = BidirectionalFeed.create({
      remoteFeed: optional && optional.contactFeed,
    })
    sharedFeed.localFeedData = Contact._generateContactPayload()
    return new Contact(
      (optional && optional.localID) || uniqueID(),
      peerID,
      (optional && optional.profile) || {},
      optional && optional.aliasName,
      sharedFeed,
      false,
    )
  }

  static _generateContactPayload(): ContactPayload {
    return {
      version: '1.0.0',
      apps: {},
    }
  }

  static fromJSON = (contactSerialized: ContactSerialized): Contact =>
    new Contact(
      contactSerialized.localID,
      contactSerialized.peerID,
      contactSerialized.profile,
      contactSerialized.aliasName,
      BidirectionalFeed.fromJSON(contactSerialized.sharedFeed),
      contactSerialized.requestSent,
    )

  static toJSON = (contact: Contact): ContactSerialized => ({
    localID: contact.localID,
    peerID: contact.peerID,
    profile: contact.profile,
    aliasName: contact._aliasName,
    sharedFeed: BidirectionalFeed.toJSON(contact.sharedFeed),
    requestSent: contact._requestSent,
  })

  _localID: string
  _peerID: string
  _sharedFeed: BidirectionalFeed
  _requestSent: boolean
  _aliasName: ?string
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
    requestSent?: boolean,
  ) {
    this._localID = localID
    this._peerID = peerID
    this._profile = profile
    this._aliasName = aliasName
    this._sharedFeed = sharedFeed
    this._requestSent = !!requestSent
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

  set requestSent(requestSent: boolean): void {
    this._requestSent = requestSent
  }

  get connectionState(): ConnectionState {
    if (!this._requestSent) return 'sending'
    return this.sharedFeed.remoteFeed ? 'connected' : 'sent'
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
