// @flow

import { type MainframeID } from '@mainframe/data-types'
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
  type ProfileData,
  type Feeds,
} from './PeerUserIdentity'
import Contact, { type ContactParams, type ContactSerialized } from './Contact'

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

type ContactsRepositorySerialized = {
  [ownUserId: string]: {
    [contactId: string]: ContactSerialized,
  },
}

export type IdentitiesRepositorySerialized = {
  own?: OwnIdentitiesRepositoryGroupSerialized,
  peers?: PeerIdentitiesRepositoryGroupSerialized,
  contacts?: ContactsRepositorySerialized,
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

type ContactsRepositoryParams = {
  [ownUserId: string]: {
    [contactId: string]: Contact,
  },
}

export type IdentitiesRepositoryParams = {
  own?: OwnIdentitiesRepositoryGroupParams,
  peers?: PeerIdentitiesRepositoryGroupParams,
  contacts?: ContactsRepositoryParams,
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

type ContactsRepository = {
  [ownUserId: string]: {
    [contactId: string]: Contact,
  },
}

type IdentitiesData = {
  own: OwnIdentitiesRepositoryGroup,
  peers: PeerIdentitiesRepositoryGroup,
  contacts: ContactsRepository,
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

const contactsFromJSON = mapObject(Contact.fromJSON)
const contactsToJSON = mapObject(Contact.toJSON)

const toContacts = (params: ContactsRepositorySerialized = {}) => {
  return Object.keys(params).reduce((acc, ownID) => {
    // $FlowFixMe: mapper type
    acc[ownID] = contactsFromJSON(params[ownID])
    return acc
  }, {})
}

const fromContacts = (contacts: ContactsRepository) => {
  return Object.keys(contacts).reduce((acc, ownID) => {
    // $FlowFixMe: mapper type
    acc[ownID] = contactsToJSON(contacts[ownID])
    return acc
  }, {})
}

export default class IdentitiesRepository {
  static fromJSON = (
    serialized: IdentitiesRepositorySerialized = {},
  ): IdentitiesRepository => {
    return new IdentitiesRepository({
      // $FlowFixMe: mapper type
      own: serialized.own ? toOwnGroup(serialized.own) : {},
      // $FlowFixMe: mapper type
      peers: serialized.peers ? toPeersGroup(serialized.peers) : {},
      contacts: serialized.contacts ? toContacts(serialized.contacts) : {},
    })
  }

  static toJSON = (
    repository: IdentitiesRepository,
  ): IdentitiesRepositorySerialized => ({
    // $FlowFixMe: mapper type
    own: fromOwnGroup(repository.ownIdentities),
    // $FlowFixMe: mapper type
    peers: fromPeersGroup(repository.peerIdentities),
    contacts: fromContacts(repository.contacts),
  })

  _byMainframeID: { [mainframeID: string]: ID } = {}
  _identities: IdentitiesData
  _refs: { [id: string]: Reference } = {}
  _mainframeIdByFeed: { [feedHash: string]: string } = {}
  _userByContact: { [contactID: string]: string } = {}

  constructor(identities: IdentitiesRepositoryParams = {}) {
    this._identities = {
      own: createOwnGroup(identities.own),
      peers: createPeersGroup(identities.peers),
      contacts: identities.contacts || {},
    }

    Object.keys(this._identities).forEach(ownership => {
      if (ownership === 'contacts') {
        // Add references so own users can be looked up by contact
        Object.keys(this._identities.contacts).forEach(ownId => {
          Object.keys(this._identities.contacts[ownId]).forEach(cid => {
            this._userByContact[idType(cid)] = idType(ownId)
          })
        })
      } else {
        // Add references so an identity can be retrieved by local ID or Mainframe ID lookup
        Object.keys(this._identities[ownership]).forEach(domain => {
          Object.keys(this._identities[ownership][domain]).forEach(id => {
            const identity = this._identities[ownership][domain][id]
            this._byMainframeID[identity.id] = idType(id)
            this._refs[id] = { ownership, domain }
            if (identity instanceof PeerUserIdentity) {
              this._mainframeIdByFeed[identity.publicFeed] = identity.id
            }
          })
        })
      }
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

  get contacts(): { [uid: string]: { [cid: string]: Contact } } {
    return this._identities.contacts
  }

  getContactsForUser(userID: ID): { [id: string]: Contact } {
    return this._identities.contacts[userID]
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
    if (ref != null && ref.ownership !== 'contacts') {
      return this._identities[ref.ownership][ref.domain][id]
    }
  }

  getID(mainframeID: MainframeID): ?ID {
    return this._byMainframeID[mainframeID]
  }

  getByMainframeID(mainframeID: MainframeID): ?Identity {
    const id = this._byMainframeID[mainframeID]
    if (id != null) {
      return this.getIdentity(id)
    }
  }

  // Setters

  addIdentity(identity: Identity): ID {
    const foundID = this._byMainframeID[identity.id]
    if (foundID != null) {
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

  createOwnDeveloper(data: Object = {}, keyPair?: KeyPair) {
    return this.addIdentity(OwnDeveloperIdentity.create(keyPair, data))
  }

  createOwnUser(data: Object = {}, keyPair?: KeyPair) {
    return this.addIdentity(OwnUserIdentity.create(keyPair, data))
  }

  createPeerApp(key: MainframeID | Buffer) {
    return this.addIdentity(new AppIdentity(key))
  }

  createPeerDeveloper(key: MainframeID | Buffer) {
    return this.addIdentity(new DeveloperIdentity(key))
  }

  createPeerUser(
    publicKey: string,
    profile: ProfileData,
    publicFeed: string,
    feeds?: Feeds,
  ): ID {
    if (this._mainframeIdByFeed[publicFeed]) {
      return this._byMainframeID[this._mainframeIdByFeed[publicFeed]]
    }
    const keyBuffer = multibase.decode(publicKey)
    const id = this.addIdentity(
      new PeerUserIdentity(keyBuffer, profile, publicFeed, feeds),
    )
    const peer = this.getPeerUser(id)
    // $FlowFixMe: peer never undefined
    this._mainframeIdByFeed[publicFeed] = peer.id
    return id
  }

  createContactFromPeer(ownUserId: ID, contactParams: ContactParams): Contact {
    if (!this.getPeerUser(idType(contactParams.peerID))) {
      throw new Error('Peer not found')
    }
    if (this._identities.contacts[ownUserId]) {
      const contacts: Array<Contact> = Object.keys(
        this._identities.contacts[ownUserId],
      ).map(id => this._identities.contacts[ownUserId][id])
      const existing = contacts.find(c => c.peerID === contactParams.peerID)
      if (existing) {
        return existing
      }
    }
    const cid = uniqueID()
    const contact = new Contact(contactParams)
    if (this._identities.contacts[ownUserId]) {
      this._identities.contacts[ownUserId][cid] = contact
    } else {
      this._identities.contacts[ownUserId] = { [String(cid)]: contact }
    }
    this._userByContact[cid] = ownUserId
    return contact
  }

  deleteContact(userID: ID, contactID: ID) {
    if (this._identities.contacts[userID]) {
      delete this._identities.contacts[userID][contactID]
    }
    if (this._userByContact[contactID]) {
      delete this._userByContact[contactID]
    }
  }
}
