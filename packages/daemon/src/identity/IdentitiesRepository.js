// @flow

import type { KeyPair } from '@mainframe/utils-crypto'
// eslint-disable-next-line import/named
import { uniqueID, idType, type ID } from '@mainframe/utils-id'

import { mapObject } from '../utils'

import type Identity from './Identity'
import type Keychain from './Keychain'
import AppIdentity, { type AppIdentitySerialized } from './AppIdentity'
import AuthorIdentity, { type AuthorIdentitySerialized } from './AuthorIdentity'
import UserIdentity, { type UserIdentitySerialized } from './UserIdentity'

type IdentitiesRepositoryGroupSerialized = {
  apps?: { [ID]: AppIdentitySerialized },
  authors?: { [ID]: AuthorIdentitySerialized },
  users?: { [ID]: UserIdentitySerialized },
}

export type IdentitiesRepositorySerialized = {
  own?: IdentitiesRepositoryGroupSerialized,
  other?: IdentitiesRepositoryGroupSerialized,
}

type IdentitiesRepositoryGroupParams = {
  apps?: { [ID]: AppIdentity },
  authors?: { [ID]: AuthorIdentity },
  users?: { [ID]: UserIdentity },
}

export type IdentitiesRepositoryParams = {
  own?: IdentitiesRepositoryGroupParams,
  other?: IdentitiesRepositoryGroupParams,
}

type IdentitiesRepositoryGroup = {
  apps: { [ID]: AppIdentity },
  authors: { [ID]: AuthorIdentity },
  users: { [ID]: UserIdentity },
}

type IdentitiesData = {
  own: IdentitiesRepositoryGroup,
  other: IdentitiesRepositoryGroup,
}

type Domain = $Keys<IdentitiesRepositoryGroup>
type Ownership = $Keys<IdentitiesData>
type Reference = { domain: Domain, ownership: Ownership }

const fromAppIdentity = mapObject(AppIdentity.toJSON)
const fromAuthorIdentity = mapObject(AuthorIdentity.toJSON)
const fromUserIdentity = mapObject(UserIdentity.toJSON)
const fromGroup = group => ({
  // $FlowFixMe: mapping type
  apps: fromAppIdentity(group.apps),
  // $FlowFixMe: mapping type
  authors: fromAuthorIdentity(group.authors),
  // $FlowFixMe: mapping type
  users: fromUserIdentity(group.users),
})

const toAppIdentity = mapObject(AppIdentity.fromJSON)
const toAuthorIdentity = mapObject(AuthorIdentity.fromJSON)
const toUserIdentity = mapObject(UserIdentity.fromJSON)
const toGroup = group => ({
  // $FlowFixMe: mapping type
  apps: toAppIdentity(group.apps),
  // $FlowFixMe: mapping type
  authors: toAuthorIdentity(group.authors),
  // $FlowFixMe: mapping type
  users: toUserIdentity(group.users),
})

const createGroup = (params: IdentitiesRepositoryGroupParams = {}) => ({
  apps: params.apps == null ? {} : params.apps,
  authors: params.authors == null ? {} : params.authors,
  users: params.users == null ? {} : params.users,
})

export default class IdentitiesRepository {
  static fromJSON = (
    serialized: IdentitiesRepositorySerialized = {},
  ): IdentitiesRepository => {
    return new IdentitiesRepository({
      // $FlowFixMe: mapper type
      own: serialized.own ? toGroup(serialized.own) : {},
      // $FlowFixMe: mapper type
      other: serialized.other ? toGroup(serialized.other) : {},
    })
  }

  static toJSON = (
    repository: IdentitiesRepository,
  ): IdentitiesRepositorySerialized => ({
    // $FlowFixMe: mapper type
    own: fromGroup(repository.ownIdentities),
    // $FlowFixMe: mapper type
    other: fromGroup(repository.otherIdentities),
  })

  _identities: IdentitiesData
  _refs: { [ID]: Reference } = {}

  constructor(identities: IdentitiesRepositoryParams = {}) {
    this._identities = {
      own: createGroup(identities.own),
      other: createGroup(identities.other),
    }
    // Add references so an identity can be retrieved by ID lookup
    Object.keys(this._identities).forEach(ownership => {
      Object.keys(this._identities[ownership]).forEach(domain => {
        Object.keys(this._identities[ownership][domain]).forEach(id => {
          this._refs[idType(id)] = { ownership, domain }
        })
      })
    })
  }

  get ownIdentities(): IdentitiesRepositoryGroup {
    return this._identities.own
  }

  get otherIdentities(): IdentitiesRepositoryGroup {
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

  addIdentity(ownership: Ownership, domain: Domain, identity: Identity): ID {
    const id = uniqueID()
    this._refs[id] = { ownership, domain }
    // $FlowFixMe: polymorphic type
    this._identities[ownership][domain][id] = identity
    return id
  }

  createOwnApp(keyPair?: KeyPair) {
    return this.addIdentity('own', 'apps', AppIdentity.create(keyPair))
  }

  createOwnAuthor(keyPair?: KeyPair) {
    return this.addIdentity('own', 'authors', AuthorIdentity.create(keyPair))
  }

  createOwnUser(data: Object, keychain?: Keychain) {
    return this.addIdentity('own', 'users', UserIdentity.create(data, keychain))
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
