// @flow

export type ContactProfile = {
  aliasName?: ?string,
  name?: ?string,
  avatar?: ?string,
  ethAddress?: ?string,
}

export type ContactSerialized = {
  localID: string,
  peerID: string,
  ownFeed: string,
  contactFeed?: ?string,
  profile: ContactProfile,
}

export type ContactParams = ContactSerialized

export default class Contact {
  static fromJSON = (contactSerialized: ContactSerialized): Contact =>
    new Contact({
      localID: contactSerialized.localID,
      peerID: contactSerialized.peerID,
      ownFeed: contactSerialized.ownFeed,
      contactFeed: contactSerialized.contactFeed,
      profile: contactSerialized.profile,
    })

  static toJSON = (contact: Contact): ContactSerialized => ({
    localID: contact._localID,
    peerID: contact._peerID,
    ownFeed: contact._ownFeed,
    contactFeed: contact._contactFeed,
    profile: contact._profile,
  })

  _localID: string
  _peerID: string
  _ownFeed: string
  _contactFeed: ?string
  _profile: {
    aliasName: ?string,
    name: ?string,
    avatar: ?string,
    ethAddress: ?string,
  }

  constructor(params: {
    localID: string,
    peerID: string,
    profile: ContactProfile,
    ownFeed: string,
    contactFeed?: ?string,
  }) {
    this._localID = params.localID
    this._peerID = params.peerID
    this._ownFeed = params.ownFeed
    this._contactFeed = params.contactFeed
    this._profile = params.profile
  }

  get localID(): string {
    return this._localID
  }

  get peerID(): string {
    return this._peerID
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
}
