// @flow

import { OwnFeed, randomTopic, type OwnFeedSerialized } from '../swarm/feed.js'

export type ContactProfile = {
  aliasName?: ?string,
  name?: ?string,
  avatar?: ?string,
  ethAddress?: ?string,
}

export type ContactSerialized = {
  peerID: string,
  profile: ContactProfile,
  ownFeed: OwnFeedSerialized,
  requestSent: boolean,
  contactFeed?: ?string,
}

export type ContactConnection = 'connected' | 'sent' | 'sending'

export default class Contact {
  static create = (
    peerID: string,
    profile: ContactProfile,
    contactFeed?: ?string,
  ): Contact => {
    return new Contact(
      peerID,
      profile,
      OwnFeed.create(undefined, randomTopic()),
      false,
      contactFeed,
    )
  }

  static fromJSON = (contactSerialized: ContactSerialized): Contact =>
    new Contact(
      contactSerialized.peerID,
      contactSerialized.profile,
      OwnFeed.fromJSON(contactSerialized.ownFeed),
      contactSerialized.requestSent,
      contactSerialized.contactFeed,
    )

  static toJSON = (contact: Contact): ContactSerialized => ({
    peerID: contact.peerID,
    profile: contact.profile,
    ownFeed: OwnFeed.toJSON(contact.ownFeed),
    requestSent: contact._requestSent,
    contactFeed: contact.contactFeed,
  })

  _peerID: string
  _ownFeed: OwnFeed
  _requestSent: boolean
  _contactFeed: ?string
  _profile: {
    aliasName: ?string,
    name: ?string,
    avatar: ?string,
    ethAddress: ?string,
  }

  constructor(
    peerID: string,
    profile: ContactProfile,
    ownFeed: OwnFeed,
    requestSent?: boolean,
    contactFeed?: ?string,
  ) {
    this._peerID = peerID
    this._profile = profile
    this._ownFeed = ownFeed
    this._requestSent = !!requestSent
    this._contactFeed = contactFeed
  }

  get peerID(): string {
    return this._peerID
  }

  get ownFeed(): OwnFeed {
    return this._ownFeed
  }

  get contactFeed(): ?string {
    return this._contactFeed
  }

  get profile(): ContactProfile {
    return this._profile
  }

  get name(): ?string {
    return this._profile.aliasName || this._profile.name
  }

  get connection(): ContactConnection {
    if (this.contactFeed) return 'connected'
    return this._requestSent ? 'sent' : 'sending'
  }
}
