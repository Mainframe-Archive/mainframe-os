// @flow

import Identity from './Identity'

export type UserIdentitySerialized = {
  id: string,
  localID: string,
  data: Object,
}

export default class UserIdentity extends Identity {
  static fromJSON = (serialized: UserIdentitySerialized): UserIdentity => {
    return new UserIdentity(serialized.localID, serialized.id, serialized.data)
  }

  static toJSON = (identity: UserIdentity): UserIdentitySerialized => {
    return {
      id: identity.id,
      localID: identity.localID,
      data: identity.data,
    }
  }

  data: Object

  constructor(localID: string, key: string | Buffer, data: Object = {}) {
    super(localID, 'user', key)
    this.data = data
  }
}
