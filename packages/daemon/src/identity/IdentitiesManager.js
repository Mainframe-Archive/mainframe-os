// @flow

import type { KeyPair } from '@mainframe/utils-crypto'

import {
  fromBase64,
  toBase64,
  type base64,
  uniqueID,
  typeID,
  type ID,
  mapObject,
} from '../utils'

import type Identity from './Identity'
import type Keychain from './Keychain'
import AppIdentity, { type AppIdentitySerialized } from './AppIdentity'
import AuthorIdentity, { type AuthorIdentitySerialized } from './AuthorIdentity'
import UserIdentity, { type UserIdentitySerialized } from './UserIdentity'

type IdentitiesManagerGroupSerialized = {
  apps?: { [ID]: AppIdentitySerialized },
  authors?: { [ID]: AuthorIdentitySerialized },
  users?: { [ID]: UserIdentitySerialized },
}

export type IdentitiesManagerSerialized = {
  own?: IdentitiesManagerGroupSerialized,
  other?: IdentitiesManagerGroupSerialized,
}

type IdentitiesManagerGroupParams = {
  apps?: { [ID]: AppIdentity },
  authors?: { [ID]: AuthorIdentity },
  users?: { [ID]: UserIdentity },
}

export type IdentitiesManagerParams = {
  own?: IdentitiesManagerGroupParams,
  other?: IdentitiesManagerGroupParams,
}

type IdentitiesManagerGroup = {
  apps: { [ID]: AppIdentity },
  authors: { [ID]: AuthorIdentity },
  users: { [ID]: UserIdentity },
}

type IdentitiesData = {
  own: IdentitiesManagerGroup,
  other: IdentitiesManagerGroup,
}

type domain = $Keys<IdentitiesManagerGroup>
type ownership = $Keys<IdentitiesData>
type reference = { domain: domain, ownership: ownership }

const fromAppIdentity = mapObject(AppIdentity.toJSON)
const fromAuthorIdentity = mapObject(AuthorIdentity.toJSON)
const fromUserIdentity = mapObject(UserIdentity.toJSON)
const fromGroup = mapObject(group => ({
  apps: fromAppIdentity(group.apps),
  authors: fromAuthorIdentity(group.authors),
  users: fromUserIdentity(group.users),
}))

const toAppIdentity = mapObject(AppIdentity.fromJSON)
const toAuthorIdentity = mapObject(AuthorIdentity.fromJSON)
const toUserIdentity = mapObject(UserIdentity.fromJSON)
const toGroup = mapObject(group => ({
  apps: toAppIdentity(group.apps),
  authors: toAuthorIdentity(group.authors),
  users: toUserIdentity(group.users),
}))

const createGroup = (params: IdentitiesManagerGroupParams = {}) => ({
  apps: params.apps == null ? {} : params.apps,
  authors: params.authors == null ? {} : params.authors,
  users: params.users == null ? {} : params.users,
})

export default class IdentitiesManager {
  static fromJSON = (
    serialized: IdentitiesManagerSerialized = {},
  ): IdentitiesManager => {
    return new IdentitiesManager({
      // $FlowFixMe: mapper type
      own: serialized.own ? toGroup(serialized.own) : {},
      // $FlowFixMe: mapper type
      other: serialized.other ? toGroup(serialized.others) : {},
    })
  }

  static toJSON = (
    manager: IdentitiesManager,
  ): IdentitiesManagerSerialized => ({
    // $FlowFixMe: mapper type
    own: fromGroup(manager.ownIdentities),
    // $FlowFixMe: mapper type
    other: fromGroup(manager.otherIdentities),
  })

  _identities: IdentitiesData
  _refs: { [ID]: reference } = {}

  constructor(identities: IdentitiesManagerParams = {}) {
    this._identities = {
      own: createGroup(identities.own),
      other: createGroup(identities.other),
    }
    // Add references so an identity can be retrieved by ID lookup
    Object.keys(this._identities).forEach(ownership => {
      Object.keys(this._identities[ownership]).forEach(domain => {
        Object.keys(this._identities[ownership][domain]).forEach(id => {
          this._refs[typeID(id)] = { ownership, domain }
        })
      })
    })
  }

  get ownIdentities(): IdentitiesManagerGroup {
    return this._identities.own
  }

  get otherIdentities(): IdentitiesManagerGroup {
    return this._identities.other
  }

  get ownApps(): { [ID]: AppIdentity } {
    return this._identities.own.apps
  }

  get ownAuthors(): { [ID]: AuthorIdentity } {
    return this._identities.own.authors
  }

  get ownUsers(): { [ID]: UserIdentity } {
    return this._identities.own.users
  }

  get otherApps(): { [ID]: AppIdentity } {
    return this._identities.other.apps
  }

  get otherAuthors(): { [ID]: AuthorIdentity } {
    return this._identities.other.authors
  }

  get otherUsers(): { [ID]: UserIdentity } {
    return this._identities.other.users
  }

  addIdentity(ownership: ownership, domain: domain, identity: Identity): ID {
    const id = uniqueID()
    this._refs[id] = { ownership, domain }
    this._identities[ownership][domain] = identity
    return id
  }

  createOwnApp(keyPair?: KeyPair) {
    return this.addIdentity('own', 'apps', AppIdentity.create(keyPair))
  }

  createOwnAuthor(keyPair?: KeyPair) {
    return this.addIdentity('own', 'authors', AuthorIdentity.create(keyPair))
  }

  createOwnUser(keychain?: Keychain) {
    return this.addIdentity('own', 'users', UserIdentity.create(keychain))
  }

  createOtherApp(keyPair?: KeyPair) {
    return this.addIdentity('other', 'apps', AppIdentity.create(keyPair))
  }

  createOtherAuthor(keyPair?: KeyPair) {
    return this.addIdentity('other', 'authors', AuthorIdentity.create(keyPair))
  }

  createOtherUser(keychain?: Keychain) {
    return this.addIdentity('other', 'users', UserIdentity.create(keychain))
  }

  getOwnApp(id?: ID): ?AppIdentity {
    return id == null
      ? // $FlowFixMe: return type
        Object.values(this._identities.own.apps)[0]
      : this._identities.own.apps[id]
  }

  getOwnAuthor(id?: ID): ?AuthorIdentity {
    return id == null
      ? // $FlowFixMe: return type
        Object.values(this._identities.own.authors)[0]
      : this._identities.own.authors[id]
  }

  getOwnUser(id?: ID): ?UserIdentity {
    return id == null
      ? // $FlowFixMe: return type
        Object.values(this._identities.own.users)[0]
      : this._identities.own.users[id]
  }

  getOtherApp(id?: ID): ?AppIdentity {
    return id == null
      ? // $FlowFixMe: return type
        Object.values(this._identities.other.apps)[0]
      : this._identities.other.apps[id]
  }

  getOtherAuthor(id?: ID): ?AuthorIdentity {
    return id == null
      ? // $FlowFixMe: return type
        Object.values(this._identities.other.authors)[0]
      : this._identities.other.authors[id]
  }

  getOtherUser(id?: ID): ?UserIdentity {
    return id == null
      ? // $FlowFixMe: return type
        Object.values(this._identities.other.users)[0]
      : this._identities.other.users[id]
  }
}
