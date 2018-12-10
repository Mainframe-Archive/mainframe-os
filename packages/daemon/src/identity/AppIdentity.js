// @flow

import Identity from './Identity'

export type AppIdentitySerialized = {
  id: string,
  localID: string,
  data: Object,
}

export default class AppIdentity extends Identity {
  static fromJSON = (serialized: AppIdentitySerialized): AppIdentity => {
    return new AppIdentity(serialized.localID, serialized.id, serialized.data)
  }

  static toJSON = (identity: AppIdentity): AppIdentitySerialized => {
    return {
      id: identity.id,
      localID: identity.localID,
      data: identity.data,
    }
  }

  data: Object

  constructor(localID: string, key: string | Buffer, data: Object = {}) {
    super(localID, 'app', key)
    this.data = data
  }
}
