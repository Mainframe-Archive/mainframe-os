// @flow

import Identity from './Identity'

export type DeveloperProfile = {
  name?: ?string,
  avatar?: ?string,
}

export type DeveloperIdentitySerialized = {
  id: string,
  localID: string,
  profile: DeveloperProfile,
}

export default class DeveloperIdentity extends Identity {
  static fromJSON = (
    serialized: DeveloperIdentitySerialized,
  ): DeveloperIdentity => {
    return new DeveloperIdentity(
      serialized.localID,
      serialized.id,
      serialized.profile,
    )
  }

  static toJSON = (
    identity: DeveloperIdentity,
  ): DeveloperIdentitySerialized => {
    return {
      id: identity.id,
      profile: identity.profile,
      localID: identity.localID,
    }
  }

  _profile: DeveloperProfile

  constructor(
    localID: string,
    key: string | Buffer,
    profile: DeveloperProfile = {},
  ) {
    super(localID, 'dev', key)
    this._profile = profile
  }

  get profile(): DeveloperProfile {
    return this._profile
  }
}
