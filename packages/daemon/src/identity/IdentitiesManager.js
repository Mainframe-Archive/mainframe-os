// @flow

import sodium from 'sodium-native'

import OwnIdentity, { type OwnIdentitySerialized } from './OwnIdentity'
import {
  type ID,
  typeID,
  fromBase64,
  toBase64,
  type base64,
  objectValues,
} from '../utils'

export type IdentitiesManagerSerialized = Array<OwnIdentitySerialized>

export default class IdentitiesManager {
  static hydrate = (serialized: IdentitiesManagerSerialized) => {
    const identities = serialized.reduce((acc, params) => {
      const identity = OwnIdentity.hydrate(params)
      acc[params.id] = identity
      return acc
    }, {})
    return new IdentitiesManager(identities)
  }

  _identities: { [id: ID]: OwnIdentity }

  constructor(identities: { [id: ID]: OwnIdentity }) {
    this._identities = identities
  }

  create(seed?: Buffer): OwnIdentity {
    const identity = OwnIdentity.create(seed)
    this._identities[identity.id] = identity
    return identity
  }

  serialized(): IdentitiesManagerSerialized {
    return objectValues(this._identities).map(OwnIdentity.serialize)
  }
}
