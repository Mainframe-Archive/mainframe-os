// @flow

import { MFID } from '@mainframe/data-types'
import type { KeyPair } from '@mainframe/utils-crypto'
// eslint-disable-next-line import/named
import { uniqueID, idType, type ID } from '@mainframe/utils-id'
import multibase from 'multibase'

import { mapObject } from '../utils'

import type Identity from './Identity'
import AppIdentity, { type AppIdentitySerialized } from './AppIdentity'
import DeveloperIdentity, {
  type DeveloperIdentitySerialized,
} from './DeveloperIdentity'
import OwnAppIdentity, { type OwnAppIdentitySerialized } from './OwnAppIdentity'
import OwnDeveloperIdentity, {
  type OwnDeveloperIdentitySerialized,
} from './OwnDeveloperIdentity'
import OwnUserIdentity, {
  type OwnUserIdentitySerialized,
} from './OwnUserIdentity'
import PeerUserIdentity, {
  type PeerUserIdentitySerialized,
  type PeerData,
  type Feeds,
} from './PeerUserIdentity'

type PeerIdentitiesRepositoryGroupSerialized = {
  apps?: { [id: string]: AppIdentitySerialized },
  developers?: { [id: string]: DeveloperIdentitySerialized },
  users?: { [id: string]: PeerUserIdentitySerialized },
}

type OwnIdentitiesRepositoryGroupSerialized = {
  apps?: { [id: string]: OwnAppIdentitySerialized },
  developers?: { [id: string]: OwnDeveloperIdentitySerialized },
  users?: { [id: string]: OwnUserIdentitySerialized },
}

export type IdentitiesRepositorySerialized = {
  own?: OwnIdentitiesRepositoryGroupSerialized,
  peers?: PeerIdentitiesRepositoryGroupSerialized,
}

type PeerIdentitiesRepositoryGroupParams = {
  apps?: { [id: string]: AppIdentity },
  developers?: { [id: string]: DeveloperIdentity },
  users?: { [id: string]: PeerUserIdentity },
}

type OwnIdentitiesRepositoryGroupParams = {
  apps?: { [id: string]: OwnAppIdentity },
  developers?: { [id: string]: OwnDeveloperIdentity },
  users?: { [id: string]: OwnUserIdentity },
}

export type IdentitiesRepositoryParams = {
  own?: OwnIdentitiesRepositoryGroupParams,
  peers?: PeerIdentitiesRepositoryGroupParams,
}

type PeerIdentitiesRepositoryGroup = {
  apps: { [id: string]: AppIdentity },
  developers: { [id: string]: DeveloperIdentity },
  users: { [id: string]: PeerUserIdentity },
}

type OwnIdentitiesRepositoryGroup = {
  apps: { [id: string]: OwnAppIdentity },
  developers: { [id: string]: OwnDeveloperIdentity },
  users: { [id: string]: OwnUserIdentity },
}

type IdentitiesData = {
  own: OwnIdentitiesRepositoryGroup,
  peers: PeerIdentitiesRepositoryGroup,
}

type Domain = $Keys<PeerIdentitiesRepositoryGroup>
type Ownership = $Keys<IdentitiesData>
type Reference = { domain: Domain, ownership: Ownership }

const getReference = (identity: Identity): ?Reference => {
  if (identity instanceof AppIdentity) {
    return { domain: 'apps', ownership: 'peers' }
  }
  if (identity instanceof DeveloperIdentity) {
    return { domain: 'developers', ownership: 'peers' }
  }
  if (identity instanceof PeerUserIdentity) {
    return { domain: 'users', ownership: 'peers' }
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
const fromPeerUserIdentity = mapObject(PeerUserIdentity.toJSON)
const fromPeersGroup = group => ({
  // $FlowFixMe: mapping type
  apps: fromAppIdentity(group.apps),
  // $FlowFixMe: mapping type
  developers: fromDeveloperIdentity(group.developers),
  // $FlowFixMe: mapping type
  users: fromPeerUserIdentity(group.users),
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
const toPeerUserIdentity = mapObject(PeerUserIdentity.fromJSON)
const toPeersGroup = group => ({
  // $FlowFixMe: mapping type
  apps: toAppIdentity(group.apps),
  // $FlowFixMe: mapping type
  developers: toDeveloperIdentity(group.developers),
  // $FlowFixMe: mapping type
  users: toPeerUserIdentity(group.users),
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

const createPeersGroup = (
  params: PeerIdentitiesRepositoryGroupParams = {},
) => ({
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
      peers: serialized.peers ? toPeersGroup(serialized.peers) : {},
    })
  }

  static toJSON = (
    repository: IdentitiesRepository,
  ): IdentitiesRepositorySerialized => ({
    // $FlowFixMe: mapper type
    own: fromOwnGroup(repository.ownIdentities),
    // $FlowFixMe: mapper type
    peers: fromPeersGroup(repository.peerIdentities),
  })

  _byMFID: { [mfid: string]: ID } = {}
  _identities: IdentitiesData
  _refs: { [id: string]: Reference } = {}
  _mfidByFeed: { [feedHash: string]: string } = {}

  constructor(identities: IdentitiesRepositoryParams = {}) {
    this._identities = {
      own: createOwnGroup(identities.own),
      peers: createPeersGroup(identities.peers),
    }
    // Add references so an identity can be retrieved by local ID or Mainframe ID lookup
    Object.keys(this._identities).forEach(ownership => {
      Object.keys(this._identities[ownership]).forEach(domain => {
        Object.keys(this._identities[ownership][domain]).forEach(id => {
          const identity = this._identities[ownership][domain][id]
          this._byMFID[MFID.canonical(identity.id)] = idType(id)
          this._refs[id] = { ownership, domain }
          if (identity.feeds) {
            Object.values(identity.feeds).forEach(hash => {
              this._mfidByFeed[String(hash)] = identity.id
            })
          }
        })
      })
    })
  }

  // Getters

  get ownIdentities(): OwnIdentitiesRepositoryGroup {
    return this._identities.own
  }

  get peerIdentities(): PeerIdentitiesRepositoryGroup {
    return this._identities.peers
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

  get peerApps(): { [id: string]: AppIdentity } {
    return this._identities.peers.apps
  }

  get peerDevelopers(): { [id: string]: DeveloperIdentity } {
    return this._identities.peers.developers
  }

  get peerUsers(): { [id: string]: PeerUserIdentity } {
    return this._identities.peers.users
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

  getPeerApp(id: ID): ?AppIdentity {
    return this._identities.peers.apps[id]
  }

  getPeerDeveloper(id: ID): ?DeveloperIdentity {
    return this._identities.peers.developers[id]
  }

  getPeerUser(id: ID): ?PeerUserIdentity {
    return this._identities.peers.users[id]
  }

  getApp(id: ID): ?(AppIdentity | OwnAppIdentity) {
    return this.getOwnApp(id) || this.getPeerApp(id)
  }

  getDeveloper(id: ID): ?(DeveloperIdentity | OwnDeveloperIdentity) {
    return this.getOwnDeveloper(id) || this.getPeerDeveloper(id)
  }

  getUser(id: ID): ?(PeerUserIdentity | OwnUserIdentity) {
    return this.getOwnUser(id) || this.getPeerUser(id)
  }

  getOwn(id: ID): ?(OwnAppIdentity | OwnDeveloperIdentity | OwnUserIdentity) {
    return this.getOwnApp(id) || this.getOwnDeveloper(id) || this.getOwnUser(id)
  }

  getPeer(id: ID): ?(AppIdentity | DeveloperIdentity | PeerUserIdentity) {
    return (
      this.getPeerApp(id) || this.getPeerDeveloper(id) || this.getPeerUser(id)
    )
  }

  getIdentity(id: ID): ?Identity {
    const ref = this._refs[id]
    if (ref != null) {
      return this._identities[ref.ownership][ref.domain][id]
    }
  }

  getID(mfid: string | MFID): ?ID {
    return this._byMFID[MFID.canonical(mfid)]
  }

  getByMFID(mfid: string): ?Identity {
    const id = this.getID(mfid)
    if (id != null) {
      return this.getIdentity(id)
    }
  }

  // Setters

  addIdentity(identity: Identity): ID {
    const foundID = this._byMFID[identity.id]
    if (foundID != null) {
      return foundID
    }

    const ref = getReference(identity)
    if (ref == null) {
      throw new Error('Unsupported identity')
    }

    const id = uniqueID()
    this._byMFID[identity.id] = id
    this._refs[id] = ref
    // $FlowFixMe: polymorphic type
    this._identities[ref.ownership][ref.domain][id] = identity
    return id
  }

  createOwnApp(keyPair?: KeyPair) {
    return this.addIdentity(OwnAppIdentity.create(keyPair))
  }

  createOwnDeveloper(data: Object = {}, keyPair?: KeyPair) {
    return this.addIdentity(OwnDeveloperIdentity.create(keyPair, data))
  }

  createOwnUser(data: Object = {}, keyPair?: KeyPair) {
    return this.addIdentity(OwnUserIdentity.create(keyPair, data))
  }

  createPeerApp(key: string | Buffer) {
    return this.addIdentity(new AppIdentity(key))
  }

  createPeerDeveloper(key: string | Buffer) {
    return this.addIdentity(new DeveloperIdentity(key))
  }

  createPeerUserFromKey(publicKey: string, data: PeerData, feeds?: Feeds): ID {
    const keyBuffer = multibase.decode(publicKey)
    const id = this.addIdentity(new PeerUserIdentity(keyBuffer, data, feeds))
    const peer = this.getPeerUser(id)
    if (feeds && peer) {
      Object.values(feeds).forEach(hash => {
        this._mfidByFeed[String(hash)] = peer.id
      })
    }
    return id
  }
}
