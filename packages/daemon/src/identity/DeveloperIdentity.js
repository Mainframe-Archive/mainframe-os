// @flow

import Identity from './Identity'

export type DeveloperIdentitySerialized = {
  id: string,
  data: Object,
}

export default class DeveloperIdentity extends Identity {
  static fromJSON = (
    serialized: DeveloperIdentitySerialized,
  ): DeveloperIdentity => {
    return new DeveloperIdentity(serialized.id, serialized.data)
  }

  static toJSON = (
    identity: DeveloperIdentity,
  ): DeveloperIdentitySerialized => {
    return {
      id: identity.id,
      data: identity.data,
    }
  }

  data: Object

  constructor(key: string | Buffer, data: Object = {}) {
    super('dev', key)
    this.data = data
  }
}
