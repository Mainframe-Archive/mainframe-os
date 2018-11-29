// @flow

export type ContactProfile = {
  aliasName?: ?string,
  name?: ?string,
  avatar?: ?string,
  ethAddress?: ?string,
}

export type ContactSerialized = {
  peerID: string,
  ownFeed: string,
  contactFeed?: ?string,
  profile: ContactProfile,
}

export type ContactParams = ContactSerialized

export default class Contact {
  static fromJSON = (contactSerialized: ContactSerialized): Contact =>
    new Contact({
      peerID: contactSerialized.peerID,
      ownFeed: contactSerialized.ownFeed,
      contactFeed: contactSerialized.contactFeed,
      profile: contactSerialized.profile,
    })

  static toJSON = (contact: Contact): ContactSerialized => ({
    peerID: contact._peerID,
    ownFeed: contact._ownFeed,
    contactFeed: contact._contactFeed,
    profile: contact._profile,
  })

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
    peerID: string,
    profile: ContactProfile,
    ownFeed: string,
    contactFeed?: ?string,
  }) {
    this._peerID = params.peerID
    this._ownFeed = params.ownFeed
    this._contactFeed = params.contactFeed
    this._profile = params.profile
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
}
