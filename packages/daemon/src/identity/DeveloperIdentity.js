// @flow

// eslint-disable-next-line import/named
import { mainframeIDType, type MainframeID } from '@mainframe/data-types'

import Identity from './Identity'

export type DeveloperIdentitySerialized = {
  id: string,
  data: Object,
}

export default class DeveloperIdentity extends Identity {
  static fromJSON = (
    serialized: DeveloperIdentitySerialized,
  ): DeveloperIdentity => {
    return new DeveloperIdentity(
      mainframeIDType(serialized.id),
      serialized.data,
    )
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

  constructor(key: MainframeID | Buffer, data: Object = {}) {
    super(key)
    this.data = data
  }
}
