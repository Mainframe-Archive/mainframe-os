// @flow

import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  type GraphQLScalarType,
  GraphQLString,
} from 'graphql'
import { fromGlobalId, globalIdField, nodeDefinitions } from 'graphql-relay'

import { MF_PREFIX } from '../../constants'
import { isValidPeerID } from '../../validation'

import type { GraphQLContext } from '../context/graphql'
import { readPeer } from '../data/protocols'
import { readJSON } from '../swarm/feeds'

const TYPE_COLLECTION = {
  App: 'apps',
  Developer: 'developers',
  EthHDWallet: 'eth_wallets_hd',
  EthLedgerWallet: 'eth_wallets_ledger',
  OwnApp: 'own_apps',
  OwnDeveloper: 'own_developers',
  Peer: 'peers',
  User: 'users',
}

export const { nodeInterface, nodeField } = nodeDefinitions<GraphQLContext>(
  (globalId: string, ctx: GraphQLContext) => {
    const { type, id } = fromGlobalId(globalId)
    const collection = TYPE_COLLECTION[type]
    return collection == null ? null : ctx.getDoc(collection, id)
  },
  doc => {
    const collection = doc.collection && doc.collection.name
    switch (collection) {
      case 'apps':
        return app
      case 'developers':
        return developer
      case 'eth_wallets_hd':
        return ethHdWallet
      case 'eth_wallets_ledger':
        return ethLedgerWallet
      case 'own_apps':
        return ownApp
      case 'own_developers':
        return ownDeveloper
      case 'peers':
        return peer
      case 'users':
        return user
      default:
        return null
    }
  },
)

const idResolver = globalIdField(null, obj => obj.localID)

const list = (type: GraphQLObjectType | GraphQLScalarType) => {
  return new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(type)))
}

// Profile

export const genericProfile = new GraphQLObjectType({
  name: 'GenericProfile',
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    avatar: {
      type: GraphQLString,
    },
    ethAddress: {
      type: GraphQLString,
    },
  }),
})

export const namedProfile = new GraphQLObjectType({
  name: 'NamedProfile',
  fields: () => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    avatar: {
      type: GraphQLString,
    },
    ethAddress: {
      type: GraphQLString,
    },
  }),
})

// Apps and developers

export const developer = new GraphQLObjectType({
  name: 'Developer',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    profile: {
      type: new GraphQLNonNull(genericProfile),
    },
    publicID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: doc => doc.getPublicID(),
    },
    apps: {
      type: list(app),
      resolve: doc => doc.getApps(),
    },
  }),
})

export const webRequestGrants = new GraphQLObjectType({
  name: 'WebRequestGrants',
  fields: () => ({
    granted: {
      type: list(GraphQLString),
    },
    denied: {
      type: list(GraphQLString),
    },
  }),
})

export const appApprovedContact = new GraphQLObjectType({
  name: 'AppApprovedContact',
  fields: () => ({
    aliasID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    contactID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: doc => doc.contact,
    },
    // TODO: add contact object if possible to populate
  }),
})

export const appPermissionGrants = new GraphQLObjectType({
  name: 'AppPermissions',
  fields: () => ({
    BLOCKCHAIN_SEND: { type: GraphQLBoolean },
    COMMS_CONTACT: { type: GraphQLBoolean },
    CONTACTS_READ: { type: GraphQLBoolean },
    WEB_REQUEST: { type: new GraphQLNonNull(webRequestGrants) },
  }),
})

export const userAppSettings = new GraphQLObjectType({
  name: 'UserAppSettings',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    approvedContacts: {
      type: list(appApprovedContact),
    },
    defaultEthAccount: {
      type: GraphQLString,
    },
    permissionsChecked: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    permissionsGrants: {
      type: new GraphQLNonNull(appPermissionGrants),
    },
  }),
})

export const appPermissionDefinitions = new GraphQLObjectType({
  name: 'AppPermissionDefinitions',
  fields: () => ({
    WEB_REQUEST: {
      type: new GraphQLList(GraphQLString),
    },
    BLOCKCHAIN_SEND: {
      type: GraphQLBoolean,
    },
    COMMS_CONTACT: {
      type: GraphQLBoolean,
    },
    CONTACTS_READ: {
      type: GraphQLBoolean,
    },
  }),
})

export const appPermissionsRequirements = new GraphQLObjectType({
  name: 'AppPermissionsRequirements',
  fields: () => ({
    optional: {
      type: new GraphQLNonNull(appPermissionDefinitions),
    },
    required: {
      type: new GraphQLNonNull(appPermissionDefinitions),
    },
  }),
})

export const appInstallationState = new GraphQLEnumType({
  name: 'AppInstallationState',
  values: {
    PENDING: { value: 'pending' },
    DOWNLOADING: { value: 'downloading' },
    FAILED: { value: 'failed' },
    DONE: { value: 'done' },
  },
})

export const appManifest = new GraphQLObjectType({
  name: 'AppManifest',
  fields: () => ({
    publicFeed: {
      type: new GraphQLNonNull(GraphQLString),
    },
    authorFeed: {
      type: new GraphQLNonNull(GraphQLString),
    },
    profile: {
      type: new GraphQLNonNull(genericProfile),
    },
    version: {
      type: new GraphQLNonNull(GraphQLString),
    },
    contentsHash: {
      type: new GraphQLNonNull(GraphQLString),
    },
    permissions: {
      type: new GraphQLNonNull(appPermissionsRequirements),
    },
  }),
})

export const appVersion = new GraphQLObjectType({
  name: 'AppVersion',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    appID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: doc => doc.app,
    },
    app: {
      type: new GraphQLNonNull(app),
      resolve: doc => doc.populate('app'),
    },
    developerID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: doc => doc.developer,
    },
    developer: {
      type: new GraphQLNonNull(developer),
      resolve: doc => doc.populate('developer'),
    },
    manifest: {
      type: new GraphQLNonNull(appManifest),
    },
    installationState: {
      type: new GraphQLNonNull(appInstallationState),
    },
  }),
})

export const app = new GraphQLObjectType({
  name: 'App',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    versions: {
      type: list(appVersion),
      resolve: doc => doc.getVersions(),
    },
  }),
})

// Own apps and developers

export const ownDeveloper = new GraphQLObjectType({
  name: 'OwnDeveloper',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    profile: {
      type: new GraphQLNonNull(namedProfile),
    },
    publicID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: doc => doc.getPublicID(),
    },
    apps: {
      type: list(ownApp),
      resolve: doc => doc.getApps(),
    },
  }),
})

export const ownAppVersion = new GraphQLObjectType({
  name: 'OwnAppVersion',
  fields: () => ({
    version: {
      type: new GraphQLNonNull(GraphQLString),
    },
    contentsHash: {
      type: GraphQLString,
    },
    versionHash: {
      type: GraphQLString,
    },
    permissions: {
      type: new GraphQLNonNull(appPermissionsRequirements),
    },
  }),
})

export const ownApp = new GraphQLObjectType({
  name: 'OwnApp',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    publicID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: doc => doc.getPublicID(),
    },
    developer: {
      type: new GraphQLNonNull(ownDeveloper),
      resolve: doc => doc.populate('developer'),
    },
    profile: {
      type: new GraphQLNonNull(namedProfile),
    },
    contentsPath: {
      type: new GraphQLNonNull(GraphQLString),
    },
    versions: {
      type: list(ownAppVersion),
      resolve: doc => doc.populate('versions'),
    },
    inProgressVersion: {
      type: ownAppVersion,
      resolve: doc => doc.getInProgressVersion(),
    },
    latestPublishedVersion: {
      type: ownAppVersion,
      resolve: doc => doc.getLatestPublishedVersion(),
    },
  }),
})

// Peers and contacts

export const peer = new GraphQLObjectType({
  name: 'Peer',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    publicID: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: doc => doc.getPublicID(),
    },
    publicFeed: {
      type: new GraphQLNonNull(GraphQLString),
    },
    profile: {
      type: new GraphQLNonNull(genericProfile),
    },
  }),
})

export const contactConnectionState = new GraphQLEnumType({
  name: 'ContactConnectionState',
  values: {
    CONNECTED: { value: 'connected' },
    DECLINED: { value: 'declined' },
    RECEIVED: { value: 'received' },
    SENDING_FEED: { value: 'sending_feed' },
    SENT_FEED: { value: 'sent_feed' },
    SENDING_BLOCKCHAIN: { value: 'sending_blockchain' },
    SENT_BLOCKCHAIN: { value: 'sent_blockchain' },
  },
})

export const contactStakeState = new GraphQLEnumType({
  name: 'ContactStakeState',
  values: {
    STAKED: { value: 'staked' },
    RECLAIMING: { value: 'reclaiming' },
    RECLAIMED: { value: 'reclaimed' },
    SEIZED: { value: 'seized' },
  },
})

export const contactInviteStake = new GraphQLObjectType({
  name: 'ContactInviteStake',
  fields: () => ({
    amount: {
      type: GraphQLString,
    },
    state: {
      type: new GraphQLNonNull(contactStakeState),
    },
    reclaimedTX: {
      type: GraphQLString,
    },
  }),
})

export const contactInviteData = new GraphQLObjectType({
  name: 'ContactInviteData',
  fields: () => ({
    inviteTX: {
      type: GraphQLString,
    },
    ethNetwork: {
      type: GraphQLString,
    },
    stake: {
      type: new GraphQLNonNull(contactInviteStake),
    },
  }),
})

export const contact = new GraphQLObjectType({
  name: 'Contact',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    peerID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: doc => doc.peer,
    },
    peer: {
      type: new GraphQLNonNull(peer),
      resolve: doc => doc.populate('peer'),
    },
    publicID: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: doc => doc.getPublicID(),
    },
    profile: {
      type: new GraphQLNonNull(genericProfile),
      resolve: async doc => {
        const peer = await doc.populate('peer')
        const name = doc.aliasName || doc.profile.name || peer.profile.name
        return { ...peer.profile, ...doc.profile, name }
      },
    },
    connectionState: {
      type: new GraphQLNonNull(contactConnectionState),
      resolve: doc => doc.getConnectionState(),
    },
    invite: {
      type: contactInviteData,
    },
  }),
})

export const contactRequest = new GraphQLObjectType({
  name: 'ContactRequest',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    localPeerID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: doc => doc.peer,
    },
    publicID: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: doc => doc.getPublicID(),
    },
    // TODO: other fields
  }),
})

// Wallets

export const walletBalances = new GraphQLObjectType({
  name: 'WalletBalances',
  fields: () => ({
    eth: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (address, args, ctx) => {
        // TODO
        return 0
        // try {
        //   return await ctx.io.eth.getETHBalance(self)
        // } catch (err) {
        //   ctx.log(err)
        //   return 0
        // }
      },
    },
    mft: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (address, args, ctx) => {
        // TODO
        return 0
        // try {
        //   return await ctx.io.tokenContract.getBalance(self)
        // } catch (err) {
        //   ctx.log(err)
        //   return 0
        // }
      },
    },
  }),
})

export const walletAccount = new GraphQLObjectType({
  name: 'WalletAccount',
  fields: () => ({
    address: {
      type: new GraphQLNonNull(GraphQLString),
    },
    balances: {
      type: new GraphQLNonNull(walletBalances),
      resolve: self => self.address,
    },
  }),
})

export const ethLedgerWallet = new GraphQLObjectType({
  name: 'EthLedgerWallet',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: GraphQLString,
    },
    accounts: {
      type: list(walletAccount),
      resolve: doc => doc.activeAccounts,
    },
  }),
})

export const ethHdWallet = new GraphQLObjectType({
  name: 'EthHDWallet',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    mnemonic: {
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      type: GraphQLString,
    },
    accounts: {
      type: list(walletAccount),
      resolve: doc => doc.activeAccounts,
    },
  }),
})

export const ethWallets = new GraphQLObjectType({
  name: 'EthWallets',
  fields: () => ({
    hd: {
      type: list(ethHdWallet),
      resolve: doc => doc.populate('ethWallets.hd'),
    },
    ledger: {
      type: list(ethLedgerWallet),
      resolve: doc => doc.populate('ethWallets.ledger'),
    },
  }),
})

// Users

export const userWallet = new GraphQLObjectType({
  name: 'UserWallet',
  fields: () => ({
    localID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    accounts: {
      type: new GraphQLList(GraphQLString),
    },
  }),
})

export const userAppVersion = new GraphQLObjectType({
  name: 'UserAppVersion',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    userID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: doc => doc.user,
    },
    user: {
      type: new GraphQLNonNull(user),
      resolve: doc => doc.populate('user'),
    },
    appVersion: {
      type: new GraphQLNonNull(appVersion),
      resolve: doc => doc.populate('appVersion'),
    },
    settings: {
      type: new GraphQLNonNull(userAppSettings),
      resolve: doc => doc.populate('settings'),
    },
  }),
})

export const user = new GraphQLObjectType({
  name: 'User',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    profile: {
      type: new GraphQLNonNull(namedProfile),
    },
    privateProfile: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    publicID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: doc => doc.getPublicID(),
    },
    apps: {
      type: list(userAppVersion),
      resolve: doc => doc.getAppsVersions(),
    },
    contacts: {
      type: list(contact),
      resolve: doc => doc.populate('contacts'),
    },
    contactRequests: {
      type: list(contactRequest),
      resolve: doc => doc.populate('contactRequests'),
    },
    ethWallets: {
      type: new GraphQLNonNull(ethWallets),
      resolve: doc => doc,
    },
    ethURL: {
      type: new GraphQLNonNull(GraphQLString),
    },
    bzzURL: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
})

export const viewerField = {
  type: new GraphQLNonNull(user),
  resolve: (self, args, ctx) => ctx.getUser(),
}

// Lookup (search)

export const peerLookupResult = new GraphQLObjectType({
  name: 'PeerLookupResult',
  fields: () => ({
    publicKey: {
      type: GraphQLString,
    },
    publicID: {
      type: new GraphQLNonNull(GraphQLString),
    },
    profile: {
      type: new GraphQLNonNull(genericProfile),
    },
  }),
})

export const lookup = new GraphQLObjectType({
  name: 'Lookup',
  fields: () => ({
    peerByID: {
      type: peerLookupResult,
      args: {
        publicID: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (self, args, ctx: GraphQLContext) => {
        ctx.logger.log({
          level: 'debug',
          message: 'Lookup peer by ID',
          args,
        })
        try {
          if (!isValidPeerID(args.publicID)) {
            throw new Error('Invalid peer ID')
          }
          const bzz = await ctx.user.getBzz()
          const payload = await readJSON(bzz, {
            user: args.publicID.replace(MF_PREFIX.PEER, '0x'),
          })
          if (payload == null) {
            return null
          }
          const data = readPeer(payload)
          ctx.logger.log({
            level: 'debug',
            message: 'Lookup peer by ID result',
            args,
            data,
          })
          return {
            profile: data.profile || {},
            publicID: args.publicID,
            publicKey: data.publicKey,
          }
        } catch (error) {
          ctx.logger.log({
            level: 'warn',
            message: 'Lookup peer by ID failed',
            args,
            error: error.toString(),
          })
          return null
        }
      },
    },
  }),
})
