// @flow

import Identity from './Identity'

export type UserIdentitySerialized = {
  id: string,
  data: Object,
}

export default class UserIdentity extends Identity {
  static fromJSON = (serialized: UserIdentitySerialized): UserIdentity => {
    return new UserIdentity(serialized.id, serialized.data)
  }

  static toJSON = (identity: UserIdentity): UserIdentitySerialized => {
    return {
      id: identity.id,
      data: identity.data,
    }
  }

  data: Object

  constructor(key: string | Buffer, data: Object = {}) {
    super('user', key)
    this.data = data
  }
}
