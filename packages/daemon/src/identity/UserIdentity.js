// @flow

// eslint-disable-next-line import/named
import { mainframeIDType, type MainframeID } from '@mainframe/data-types'

import Identity from './Identity'

export type UserIdentitySerialized = {
  id: string,
  data: Object,
}

export default class UserIdentity extends Identity {
  static fromJSON = (serialized: UserIdentitySerialized): UserIdentity => {
    return new UserIdentity(mainframeIDType(serialized.id), serialized.data)
  }

  static toJSON = (identity: UserIdentity): UserIdentitySerialized => {
    return {
      id: identity.id,
      data: identity.data,
    }
  }

  data: Object

  constructor(key: MainframeID | Buffer, data: Object = {}) {
    super(key)
    this.data = data
  }
}
