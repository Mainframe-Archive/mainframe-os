// @flow

import type { MainframeID } from '@mainframe/data-types'
import type { KeyPair } from '@mainframe/utils-crypto'
// eslint-disable-next-line import/named
import { uniqueID, idType, type ID } from '@mainframe/utils-id'

import { mapObject } from '../utils'

import type Identity from './Identity'
import AppIdentity, { type AppIdentitySerialized } from './AppIdentity'
import DeveloperIdentity, {
  type DeveloperIdentitySerialized,
} from './DeveloperIdentity'
import UserIdentity, { type UserIdentitySerialized } from './UserIdentity'
import OwnAppIdentity, { type OwnAppIdentitySerialized } from './OwnAppIdentity'
import OwnDeveloperIdentity, {
  type OwnDeveloperIdentitySerialized,
} from './OwnDeveloperIdentity'
import OwnUserIdentity, {
  type OwnUserIdentitySerialized,
} from './OwnUserIdentity'

type IdentitiesRepositoryGroupSerialized = {
  apps?: { [id: string]: AppIdentitySerialized },
  developers?: { [id: string]: DeveloperIdentitySerialized },
  users?: { [id: string]: UserIdentitySerialized },
}

type OwnIdentitiesRepositoryGroupSerialized = {
  apps?: { [id: string]: OwnAppIdentitySerialized },
  developers?: { [id: string]: OwnDeveloperIdentitySerialized },
  users?: { [id: string]: OwnUserIdentitySerialized },
}

export type IdentitiesRepositorySerialized = {
  own?: OwnIdentitiesRepositoryGroupSerialized,
  other?: IdentitiesRepositoryGroupSerialized,
}

type IdentitiesRepositoryGroupParams = {
  apps?: { [id: string]: AppIdentity },
  developers?: { [id: string]: DeveloperIdentity },
  users?: { [id: string]: UserIdentity },
}

type OwnIdentitiesRepositoryGroupParams = {
  apps?: { [id: string]: OwnAppIdentity },
  developers?: { [id: string]: OwnDeveloperIdentity },
  users?: { [id: string]: OwnUserIdentity },
}

export type IdentitiesRepositoryParams = {
  own?: OwnIdentitiesRepositoryGroupParams,
  other?: IdentitiesRepositoryGroupParams,
}

type IdentitiesRepositoryGroup = {
  apps: { [id: string]: AppIdentity },
  developers: { [id: string]: DeveloperIdentity },
  users: { [id: string]: UserIdentity },
}

type OwnIdentitiesRepositoryGroup = {
  apps: { [id: string]: OwnAppIdentity },
  developers: { [id: string]: OwnDeveloperIdentity },
  users: { [id: string]: OwnUserIdentity },
}

type IdentitiesData = {
  own: OwnIdentitiesRepositoryGroup,
  other: IdentitiesRepositoryGroup,
}

type Domain = $Keys<IdentitiesRepositoryGroup>
type Ownership = $Keys<IdentitiesData>
type Reference = { domain: Domain, ownership: Ownership }

const getReference = (identity: Identity): ?Reference => {
  if (identity instanceof AppIdentity) {
    return { domain: 'apps', ownership: 'other' }
  }
  if (identity instanceof DeveloperIdentity) {
    return { domain: 'developers', ownership: 'other' }
  }
  if (identity instanceof UserIdentity) {
    return { domain: 'users', ownership: 'other' }
  }
  if (identity instanceof OwnAppIdentity) {
    return { domain: 'apps', ownership: 'own' }
  }
  if (identity instanceof OwnDeveloperIdentity) {
    return { domain: 'developers', ownership: 'own' }
  }
  if (identity instanceof OwnUserIdentity) {
    return { domain: 'users', ownership: 'own' }
  }
}

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

const fromOwnAppIdentity = mapObject(OwnAppIdentity.toJSON)
const fromOwnDeveloperIdentity = mapObject(OwnDeveloperIdentity.toJSON)
const fromOwnUserIdentity = mapObject(OwnUserIdentity.toJSON)
const fromOwnGroup = group => ({
  // $FlowFixMe: mapping type
  apps: fromOwnAppIdentity(group.apps),
  // $FlowFixMe: mapping type
  developers: fromOwnDeveloperIdentity(group.developers),
  // $FlowFixMe: mapping type
  users: fromOwnUserIdentity(group.users),
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

const toOwnAppIdentity = mapObject(OwnAppIdentity.fromJSON)
const toOwnDeveloperIdentity = mapObject(OwnDeveloperIdentity.fromJSON)
const toOwnUserIdentity = mapObject(OwnUserIdentity.fromJSON)
const toOwnGroup = group => ({
  // $FlowFixMe: mapping type
  apps: toOwnAppIdentity(group.apps),
  // $FlowFixMe: mapping type
  developers: toOwnDeveloperIdentity(group.developers),
  // $FlowFixMe: mapping type
  users: toOwnUserIdentity(group.users),
})

const createGroup = (params: IdentitiesRepositoryGroupParams = {}) => ({
  apps: params.apps == null ? {} : params.apps,
  developers: params.developers == null ? {} : params.developers,
  users: params.users == null ? {} : params.users,
})

const createOwnGroup = (params: OwnIdentitiesRepositoryGroupParams = {}) => ({
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
      own: serialized.own ? toOwnGroup(serialized.own) : {},
      // $FlowFixMe: mapper type
      other: serialized.other ? toGroup(serialized.other) : {},
    })
  }

  static toJSON = (
    repository: IdentitiesRepository,
  ): IdentitiesRepositorySerialized => ({
    // $FlowFixMe: mapper type
    own: fromOwnGroup(repository.ownIdentities),
    // $FlowFixMe: mapper type
    other: fromGroup(repository.otherIdentities),
  })

  _byMainframeID: { [mainframeID: string]: ID } = {}
  _identities: IdentitiesData
  _refs: { [id: string]: Reference } = {}

  constructor(identities: IdentitiesRepositoryParams = {}) {
    this._identities = {
      own: createOwnGroup(identities.own),
      other: createGroup(identities.other),
    }
    // Add references so an identity can be retrieved by local ID or Mainframe ID lookup
    Object.keys(this._identities).forEach(ownership => {
      Object.keys(this._identities[ownership]).forEach(domain => {
        Object.keys(this._identities[ownership][domain]).forEach(id => {
          const identity = this._identities[ownership][domain][id]
          this._byMainframeID[identity.id] = idType(id)
          this._refs[id] = { ownership, domain }
        })
      })
    })
  }

  get ownIdentities(): OwnIdentitiesRepositoryGroup {
    return this._identities.own
  }

  get otherIdentities(): IdentitiesRepositoryGroup {
    return this._identities.other
  }

  get ownApps(): { [id: string]: OwnAppIdentity } {
    return this._identities.own.apps
  }

  get ownDevelopers(): { [id: string]: OwnDeveloperIdentity } {
    return this._identities.own.developers
  }

  get ownUsers(): { [id: string]: OwnUserIdentity } {
    return this._identities.own.users
  }

  get otherApps(): { [id: string]: AppIdentity } {
    return this._identities.other.apps
  }

  get otherDevelopers(): { [id: string]: DeveloperIdentity } {
    return this._identities.other.developers
  }

  get otherUsers(): { [id: string]: UserIdentity } {
    return this._identities.other.users
  }

  addIdentity(identity: Identity): ID {
    const foundID = this._byMainframeID[identity.id]
    if (foundID !== null) {
      return foundID
    }

    const ref = getReference(identity)
    if (ref == null) {
      throw new Error('Unsupported identity')
    }

    const id = uniqueID()
    this._byMainframeID[identity.id] = id
    this._refs[id] = ref
    // $FlowFixMe: polymorphic type
    this._identities[ref.ownership][ref.domain][id] = identity
    return id
  }

  createOwnApp(keyPair?: KeyPair) {
    return this.addIdentity(OwnAppIdentity.create(keyPair))
  }

  createOwnDeveloper(data: Object, keyPair?: KeyPair) {
    return this.addIdentity(OwnDeveloperIdentity.create(data, keyPair))
  }

  createOwnUser(data: Object, keyPair?: KeyPair) {
    return this.addIdentity(OwnUserIdentity.create(keyPair, data))
  }

  createOtherApp(key: MainframeID | Buffer) {
    return this.addIdentity(new AppIdentity(key))
  }

  createOtherDeveloper(key: MainframeID | Buffer) {
    return this.addIdentity(new DeveloperIdentity(key))
  }

  createOtherUser(key: MainframeID | Buffer) {
    return this.addIdentity(new UserIdentity(key))
  }

  getOwnApp(id: ID): ?OwnAppIdentity {
    return this._identities.own.apps[id]
  }

  getOwnDeveloper(id: ID): ?OwnDeveloperIdentity {
    return this._identities.own.developers[id]
  }

  getOwnUser(id: ID): ?OwnUserIdentity {
    return this._identities.own.users[id]
  }

  getOtherApp(id: ID): ?AppIdentity {
    return this._identities.other.apps[id]
  }

  getOtherDeveloper(id: ID): ?DeveloperIdentity {
    return this._identities.other.developers[id]
  }

  getOtherUser(id: ID): ?UserIdentity {
    return this._identities.other.users[id]
  }

  getApp(id: ID): ?(AppIdentity | OwnAppIdentity) {
    return this.getOwnApp(id) || this.getOtherApp(id)
  }

  getDeveloper(id: ID): ?(DeveloperIdentity | OwnDeveloperIdentity) {
    return this.getOwnDeveloper(id) || this.getOtherDeveloper(id)
  }

  getUser(id: ID): ?(UserIdentity | OwnUserIdentity) {
    return this.getOwnUser(id) || this.getOtherUser(id)
  }

  getOwn(id: ID): ?(OwnAppIdentity | OwnDeveloperIdentity | OwnUserIdentity) {
    return this.getOwnApp(id) || this.getOwnDeveloper(id) || this.getOwnUser(id)
  }

  getOther(id: ID): ?(AppIdentity | DeveloperIdentity | UserIdentity) {
    return (
      this.getOtherApp(id) ||
      this.getOtherDeveloper(id) ||
      this.getOtherUser(id)
    )
  }

  getIdentity(id: ID): ?Identity {
    const ref = this._refs[id]
    if (ref != null) {
      return this._identities[ref.ownership][ref.domain][id]
    }
  }
}
