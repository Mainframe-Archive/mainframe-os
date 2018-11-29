// @flow

import Identity from './Identity'

export type AppIdentitySerialized = {
  id: string,
  data: Object,
}

export default class AppIdentity extends Identity {
  static fromJSON = (serialized: AppIdentitySerialized): AppIdentity => {
    return new AppIdentity(serialized.id, serialized.data)
  }

  static toJSON = (identity: AppIdentity): AppIdentitySerialized => {
    return {
      id: identity.id,
      data: identity.data,
    }
  }

  data: Object

  constructor(key: string | Buffer, data: Object = {}) {
    super(key)
    this.data = data
  }
}
