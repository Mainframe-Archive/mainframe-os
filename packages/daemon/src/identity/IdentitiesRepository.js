// @flow

import type { KeyPair } from '@mainframe/utils-crypto'
// eslint-disable-next-line import/named
import { uniqueID, idType, type ID } from '@mainframe/utils-id'

import { mapObject } from '../utils'

import type Identity from './Identity'
import type Keychain from './Keychain'
import AppIdentity, { type AppIdentitySerialized } from './AppIdentity'
import DeveloperIdentity, {
  type DeveloperIdentitySerialized,
} from './DeveloperIdentity'
import UserIdentity, { type UserIdentitySerialized } from './UserIdentity'

type IdentitiesRepositoryGroupSerialized = {
  apps?: { [ID]: AppIdentitySerialized },
  developers?: { [ID]: DeveloperIdentitySerialized },
  users?: { [ID]: UserIdentitySerialized },
}

export type IdentitiesRepositorySerialized = {
  own?: IdentitiesRepositoryGroupSerialized,
  other?: IdentitiesRepositoryGroupSerialized,
}

type IdentitiesRepositoryGroupParams = {
  apps?: { [ID]: AppIdentity },
  developers?: { [ID]: DeveloperIdentity },
  users?: { [ID]: UserIdentity },
}

export type IdentitiesRepositoryParams = {
  own?: IdentitiesRepositoryGroupParams,
  other?: IdentitiesRepositoryGroupParams,
}

type IdentitiesRepositoryGroup = {
  apps: { [ID]: AppIdentity },
  developers: { [ID]: DeveloperIdentity },
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
const fromDeveloperIdentity = mapObject(DeveloperIdentity.toJSON)
const fromUserIdentity = mapObject(UserIdentity.toJSON)
const fromGroup = group => ({
  // $FlowFixMe: mapping type
  apps: fromAppIdentity(group.apps),
  // $FlowFixMe: mapping type
  developers: fromDeveloperIdentity(group.developers),
  // $FlowFixMe: mapping type
  users: fromUserIdentity(group.users),
})

const toAppIdentity = mapObject(AppIdentity.fromJSON)
const toDeveloperIdentity = mapObject(DeveloperIdentity.fromJSON)
const toUserIdentity = mapObject(UserIdentity.fromJSON)
const toGroup = group => ({
  // $FlowFixMe: mapping type
  apps: toAppIdentity(group.apps),
  // $FlowFixMe: mapping type
  developers: toDeveloperIdentity(group.developers),
  // $FlowFixMe: mapping type
  users: toUserIdentity(group.users),
})

const createGroup = (params: IdentitiesRepositoryGroupParams = {}) => ({
  apps: params.apps == null ? {} : params.apps,
  developers: params.developers == null ? {} : params.developers,
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

  get ownDevelopers(): { [ID]: DeveloperIdentity } {
    return this._identities.own.developers
  }

  get ownUsers(): { [ID]: UserIdentity } {
    return this._identities.own.users
  }

  get otherApps(): { [ID]: AppIdentity } {
    return this._identities.other.apps
  }

  get otherDevelopers(): { [ID]: DeveloperIdentity } {
    return this._identities.other.developers
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

  createOwnDeveloper(data: Object, keyPair?: KeyPair) {
    return this.addIdentity(
      'own',
      'developers',
      DeveloperIdentity.create(data, keyPair),
    )
  }

  createOwnUser(data: Object, keychain?: Keychain) {
    return this.addIdentity('own', 'users', UserIdentity.create(data, keychain))
  }

  createOtherApp(keyPair?: KeyPair) {
    return this.addIdentity('other', 'apps', AppIdentity.create(keyPair))
  }

  createOtherDeveloper(keyPair?: KeyPair) {
    return this.addIdentity(
      'other',
      'developers',
      DeveloperIdentity.create(keyPair),
    )
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

  getOwnDeveloper(id?: ID): ?DeveloperIdentity {
    return id == null
      ? // $FlowFixMe: return type
        Object.values(this._identities.own.developers)[0]
      : this._identities.own.developers[id]
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

  getOtherDeveloper(id?: ID): ?DeveloperIdentity {
    return id == null
      ? // $FlowFixMe: return type
        Object.values(this._identities.other.developers)[0]
      : this._identities.other.developers[id]
  }

  getOtherUser(id?: ID): ?UserIdentity {
    return id == null
      ? // $FlowFixMe: return type
        Object.values(this._identities.other.users)[0]
      : this._identities.other.users[id]
  }
}
