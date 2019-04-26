// @flow

import { MFID } from '@mainframe/data-types'
import type { KeyPair } from '@mainframe/utils-crypto'
import { uniqueID, idType, type ID } from '@mainframe/utils-id'
import multibase from 'multibase'
import { type hexValue } from '@erebos/hex'

import { mapObject } from '../utils'

import type Identity from './Identity'
import AppIdentity, { type AppIdentitySerialized } from './AppIdentity'
import DeveloperIdentity, {
  type DeveloperIdentitySerialized,
  type DeveloperProfile,
} from './DeveloperIdentity'
import OwnAppIdentity, { type OwnAppIdentitySerialized } from './OwnAppIdentity'
import OwnDeveloperIdentity, {
  type OwnDeveloperIdentitySerialized,
  type OwnDeveloperProfile,
} from './OwnDeveloperIdentity'
import OwnUserIdentity, {
  type OwnUserIdentitySerialized,
  type OwnUserProfile,
} from './OwnUserIdentity'
import PeerUserIdentity, {
  type PeerUserIdentitySerialized,
  type PeerUserProfile,
  type Feeds,
} from './PeerUserIdentity'
import Contact, { type ContactSerialized, type ContactProfile } from './Contact'

export type CreateContactParams = {
  userID: string,
  peerID: string,
  aliasName?: string,
  acceptanceSignature?: string,
}

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

export type InviteRequest = {
  peerID: string,
  ethNetwork: string,
  privateFeed: string,
  receivedAddress: string,
  senderAddress: string,
  rejectedTXHash?: string,
}

type InvitesRepositorySerialized = {
  [ownUserId: string]: {
    [peerID: string]: InviteRequest,
  },
}

export type IdentitiesRepositorySerialized = {
  own?: OwnIdentitiesRepositoryGroupSerialized,
  peers?: PeerIdentitiesRepositoryGroupSerialized,
  contacts?: ContactsRepositorySerialized,
  invites?: InvitesRepositorySerialized,
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

type InvitesRepositoryParams = {
  [ownUserId: string]: {
    [peerID: string]: InviteRequest,
  },
}

export type IdentitiesRepositoryParams = {
  own?: OwnIdentitiesRepositoryGroupParams,
  peers?: PeerIdentitiesRepositoryGroupParams,
  contacts?: ContactsRepositoryParams,
  invites?: InvitesRepositoryParams,
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

type InvitesRepository = {
  [ownUserId: string]: {
    [peerID: string]: InviteRequest,
  },
}

type IdentitiesData = {
  own: OwnIdentitiesRepositoryGroup,
  peers: PeerIdentitiesRepositoryGroup,
  contacts: ContactsRepository,
  invites: InvitesRepository,
}

type Domain = 'apps' | 'developers' | 'users'
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

const truncateString = (string: string) => {
  if (string.length < 20) {
    return string
  }
  const start = string.substr(0, 7)
  const end = string.substr(string.length - 7, string.length)
  return `${start}...${end}`
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
      invites: serialized.invites ? serialized.invites : {},
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
    invites: repository.invites,
  })

  _byMFID: { [mfid: string]: ID } = {}
  _identities: IdentitiesData
  _refs: { [id: string]: Reference } = {}
  _mfidByFeed: { [feedHash: string]: string } = {}
  _userByContact: { [contactID: string]: string } = {}

  constructor(identities: IdentitiesRepositoryParams = {}) {
    this._identities = {
      own: createOwnGroup(identities.own),
      peers: createPeersGroup(identities.peers),
      contacts: identities.contacts || {},
      invites: identities.invites || {},
    }

    Object.keys(this._identities).forEach(ownership => {
      if (ownership === 'contacts') {
        // Add references so own users can be looked up by contact
        Object.keys(this._identities.contacts).forEach(ownId => {
          Object.keys(this._identities.contacts[ownId]).forEach(cid => {
            this._userByContact[idType(cid)] = idType(ownId)
          })
        })
      } else if (ownership !== 'invites') {
        // Add references so an identity can be retrieved by local ID or Mainframe ID lookup
        // $FlowFixMe: key type lost
        Object.keys(this._identities[ownership]).forEach((domain: Domain) => {
          Object.keys(this._identities[ownership][domain]).forEach(id => {
            const identity = this._identities[ownership][domain][id]
            const mfid = MFID.canonical(identity.id)
            this._byMFID[mfid] = idType(id)
            this._refs[id] = { ownership, domain }
            if (identity instanceof PeerUserIdentity) {
              this._mfidByFeed[identity.publicFeed] = mfid
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

  get invites(): { [uid: string]: { [peerID: string]: InviteRequest } } {
    return this._identities.invites
  }

  getContactsForUser(userID: ID | string): { [id: string]: Contact } {
    return this._identities.contacts[userID]
  }

  getContact(userID: ID | string, contactID: ID | string): ?Contact {
    return this._identities.contacts[userID][contactID]
  }

  getOwnApp(id: ID | string): ?OwnAppIdentity {
    return this._identities.own.apps[id]
  }

  getOwnDeveloper(id: ID | string): ?OwnDeveloperIdentity {
    return this._identities.own.developers[id]
  }

  getOwnUser(id: ID | string): ?OwnUserIdentity {
    return this._identities.own.users[id]
  }

  getPeerApp(id: ID | string): ?AppIdentity {
    return this._identities.peers.apps[id]
  }

  getPeerDeveloper(id: ID | string): ?DeveloperIdentity {
    return this._identities.peers.developers[id]
  }

  getPeerUser(id: ID | string): ?PeerUserIdentity {
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

  getPeerByFeed(publicFeed: string): ?PeerUserIdentity {
    if (this._mfidByFeed[publicFeed]) {
      return this.getPeerUser(this._byMFID[this._mfidByFeed[publicFeed]])
    }
  }

  getIdentity(id: ID): ?Identity {
    const ref = this._refs[id]
    if (
      ref != null &&
      ref.ownership !== 'contacts' &&
      ref.ownership !== 'invites'
    ) {
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

  getContactByPeerID(userID: string, peerID: string): ?Contact {
    if (this._identities.contacts[userID]) {
      const keys = Object.keys(this._identities.contacts[userID])
      const contacts = keys.map(id => this._identities.contacts[userID][id])
      return contacts.find(c => c.peerID === peerID)
    }
  }

  getInvites(userID: string): { [string]: InviteRequest } {
    return this._identities.invites[userID] || {}
  }

  getInviteRequest(userID: string, peerID: string): ?InviteRequest {
    if (this._identities.invites[userID]) {
      return this._identities.invites[userID][peerID]
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

    this._byMFID[identity.id] = idType(identity.localID)
    this._refs[identity.localID] = ref
    // $FlowFixMe: polymorphic type
    this._identities[ref.ownership][ref.domain][identity.localID] = identity
    return idType(identity.localID)
  }

  createOwnApp(keyPair?: KeyPair) {
    return this.addIdentity(OwnAppIdentity.create(keyPair))
  }

  createOwnDeveloper(
    profile: OwnDeveloperProfile,
    keyPair?: KeyPair,
  ): OwnDeveloperIdentity {
    const id = this.addIdentity(OwnDeveloperIdentity.create(profile, keyPair))
    const dev = this.getOwnDeveloper(id)
    if (dev) return dev
    else throw new Error('Error creating developer')
  }

  createOwnUser(
    profile: OwnUserProfile,
    privateProfile?: boolean,
    keyPair?: KeyPair,
  ): OwnUserIdentity {
    const id = this.addIdentity(
      OwnUserIdentity.create(profile, privateProfile, keyPair),
    )
    const user = this.getOwnUser(id)
    if (user) return user
    else throw new Error('Error creating user')
  }

  createPeerApp(key: string | Buffer) {
    return this.addIdentity(new AppIdentity(uniqueID(), key))
  }

  createPeerDeveloper(key: string | Buffer, profile: DeveloperProfile) {
    return this.addIdentity(new DeveloperIdentity(uniqueID(), key, profile))
  }

  createPeerUser(
    publicKey: string,
    profile: PeerUserProfile,
    publicFeed: string,
    firstContactAddress: hexValue,
    feeds?: Feeds,
  ): PeerUserIdentity {
    if (this._mfidByFeed[publicFeed]) {
      const id = this._byMFID[this._mfidByFeed[publicFeed]]
      const identity = this.getIdentity(id)
      if (!(identity instanceof PeerUserIdentity)) {
        throw new Error(
          'Error adding peer - identity already exists with publicFeed',
        )
      }
      return identity
    }
    const keyBuffer = multibase.decode(publicKey)
    const id = this.addIdentity(
      new PeerUserIdentity(
        uniqueID(),
        keyBuffer,
        profile,
        publicFeed,
        firstContactAddress,
        feeds,
      ),
    )
    const peer = this.getPeerUser(id)
    if (!peer) throw new Error('Error adding peer')

    this._mfidByFeed[String(publicFeed)] = peer.id
    return peer
  }

  createContactFromPeer(params: CreateContactParams): Contact {
    const peer = this.getPeerUser(idType(params.peerID))
    if (!peer) throw new Error('Peer not found')

    if (this._identities.contacts[params.userID]) {
      const keys = Object.keys(this._identities.contacts[params.userID])
      const contacts = keys.map(
        id => this._identities.contacts[params.userID][id],
      )
      const existing = contacts.find(c => c.peerID === params.peerID)
      if (existing) {
        return existing
      }
    }
    const contact = Contact.create(params.peerID, {
      aliasName: params.aliasName,
      acceptanceSignature: params.acceptanceSignature,
    })
    if (this._identities.contacts[params.userID]) {
      this._identities.contacts[params.userID][contact.localID] = contact
    } else {
      this._identities.contacts[params.userID] = {
        [contact.localID]: contact,
      }
    }
    this._userByContact[contact.localID] = params.userID
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

  getContactProfile(contactID: ID | string): ContactProfile {
    const userID = this._userByContact[contactID]
    if (userID == null) {
      return {}
    }

    const userContacts = this._identities.contacts[userID]
    if (userContacts == null) {
      return {}
    }

    const contact = userContacts[contactID]
    if (contact == null) {
      return {}
    }
    const peer = this._identities.peers.users[contact.peerID]
    const peerProfile = peer ? peer.profile : {}
    return {
      name: contact.name || peerProfile.name || truncateString(peer.publicFeed),
      avatar: contact.profile.avatar || peerProfile.avatar,
      ethAddress: contact.profile.ethAddress || peerProfile.ethAddress,
    }
  }

  // TODO: Refactor contacts storage to lookup by ID, store userID in contact
  getContactByID(
    contactID: ID | string,
  ): ?{| contact: Contact, userID: string |} {
    const userID = this._userByContact[contactID]
    if (userID == null) return

    const contact = this._identities.contacts[userID][contactID]
    if (contact == null) return

    return { userID, contact }
  }

  setInviteRequest(userID: string, invite: InviteRequest) {
    if (!this._identities.invites[userID]) {
      this._identities.invites[userID] = { [invite.peerID]: invite }
    } else if (!this._identities.invites[userID][invite.peerID]) {
      this._identities.invites[userID][invite.peerID] = invite
    }
  }

  deleteInviteRequest(userID: string, peerID: string) {
    if (this._identities.invites[userID]) {
      delete this._identities.invites[userID][peerID]
    }
  }
}
