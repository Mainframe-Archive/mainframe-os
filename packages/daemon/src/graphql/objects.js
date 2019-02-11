// @flow

import { idType } from '@mainframe/utils-id'
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'
import { fromGlobalId, globalIdField, nodeDefinitions } from 'graphql-relay'

import { App, OwnApp } from '../app'
import {
  OwnAppIdentity,
  OwnDeveloperIdentity,
  OwnUserIdentity,
  PeerAppIdentity,
  PeerDeveloperIdentity,
  PeerUserIdentity,
} from '../identity'
import type ClientContext from '../context/ClientContext'
import LedgerWallet from '../wallet/LedgerWallet'
import HDWallet from '../wallet/HDWallet'

export const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId: string, ctx: ClientContext) => {
    if (globalId === 'viewer') {
      return {}
    }
    const { type, id } = fromGlobalId(globalId)
    const typedID = idType(id)

    switch (type) {
      case 'App':
        return ctx.openVault.apps.getByID(typedID)
      case 'EthHDWallet':
        return ctx.openVault.wallets.getEthHDWallet(typedID)
      case 'EthLedgerWallet':
        return ctx.openVault.wallets.getEthLedgerWallet(typedID)
      case 'OwnApp':
        return ctx.openVault.apps.getOwnByID(typedID)
      case 'OwnAppIdentity':
        return ctx.openVault.identities.getOwnApp(typedID)
      case 'OwnDeveloperIdentity':
        return ctx.openVault.identities.getOwnDeveloper(typedID)
      case 'OwnUserIdentity':
        return ctx.openVault.identities.getOwnUser(typedID)
      case 'PeerAppIdentity':
        return ctx.openVault.identities.getPeerApp(typedID)
      case 'PeerDeveloperIdentity':
        return ctx.openVault.identities.getPeerDeveloper(typedID)
      case 'PeerUserIdentity':
        return ctx.openVault.identities.getPeerUser(typedID)
      default:
        return null
    }
  },
  obj => {
    if (obj instanceof App) {
      return app
    }
    if (obj instanceof HDWallet) {
      return ethHdWallet
    }
    if (obj instanceof LedgerWallet) {
      return ethLedgerWallet
    }
    if (obj instanceof OwnApp) {
      return ownApp
    }
    if (obj instanceof OwnAppIdentity) {
      return ownAppIdentity
    }
    if (obj instanceof OwnDeveloperIdentity) {
      return ownDeveloperIdentity
    }
    if (obj instanceof OwnUserIdentity) {
      return ownUserIdentity
    }
    if (obj instanceof PeerAppIdentity) {
      return peerAppIdentity
    }
    if (obj instanceof PeerDeveloperIdentity) {
      return peerDeveloperIdentity
    }
    if (obj instanceof PeerUserIdentity) {
      return peerUserIdentity
    }
    return null
  },
)

export const idResolver = globalIdField(null, obj => obj.localID)

export const webRequestGrants = new GraphQLObjectType({
  name: 'WebRequestGrants',
  fields: () => ({
    granted: { type: new GraphQLList(GraphQLString) },
    denied: { type: new GraphQLList(GraphQLString) },
  }),
})

export const appPermissionGrants = new GraphQLObjectType({
  name: 'AppPermissions',
  fields: () => ({
    BLOCKCHAIN_SEND: { type: GraphQLBoolean },
    CONTACTS_READ: { type: GraphQLBoolean },
    WEB_REQUEST: { type: new GraphQLNonNull(webRequestGrants) },
  }),
})

export const appPermissionSettings = new GraphQLObjectType({
  name: 'AppPermissionsSettings',
  fields: () => ({
    permissionsChecked: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    grants: {
      type: new GraphQLNonNull(appPermissionGrants),
    },
  }),
})

export const appUserSettings = new GraphQLObjectType({
  name: 'AppUserSettings',
  fields: () => ({
    permissionsSettings: {
      type: new GraphQLNonNull(appPermissionSettings),
    },
  }),
})

export const appUser = new GraphQLObjectType({
  name: 'AppUser',
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    identity: {
      type: new GraphQLNonNull(ownUserIdentity),
      resolve: (self, args, ctx: ClientContext) => {
        return ctx.openVault.identities.getOwnUser(self.localID)
      },
    },
    settings: {
      type: new GraphQLNonNull(appUserSettings),
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

export const appAuthor = new GraphQLObjectType({
  name: 'AppAuthor',
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
  }),
})

export const appManifestData = new GraphQLObjectType({
  name: 'AppManifestData',
  fields: () => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    version: {
      type: new GraphQLNonNull(GraphQLString),
    },
    permissions: {
      type: new GraphQLNonNull(appPermissionsRequirements),
    },
    author: {
      type: new GraphQLNonNull(appAuthor),
    },
  }),
})

export const appVersionData = new GraphQLObjectType({
  name: 'AppVersionData',
  fields: () => ({
    version: {
      type: new GraphQLNonNull(GraphQLString),
    },
    versionHash: {
      type: GraphQLString,
    },
    permissions: {
      type: new GraphQLNonNull(appPermissionsRequirements),
    },
  }),
})

export const app = new GraphQLObjectType({
  name: 'App',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: globalIdField(),
    mfid: {
      type: new GraphQLNonNull(GraphQLString),
    },
    localID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: self => self.id,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: self => self.manifest.name,
    },
    manifest: {
      type: new GraphQLNonNull(appManifestData),
    },
    users: {
      type: new GraphQLList(appUser),
      resolve: ({ settings }) => {
        return Object.keys(settings).map(id => ({
          localID: id,
          settings: settings[id],
        }))
      },
    },
  }),
})

export const ownApp = new GraphQLObjectType({
  name: 'OwnApp',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: globalIdField(),
    localID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: self => self.id,
    },
    mfid: {
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: self => self.data.name,
    },
    contentsPath: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: self => self.data.contentsPath,
    },
    updateFeedHash: {
      type: GraphQLString,
    },
    versions: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(appVersionData)),
      ),
      resolve: ({ versions }) => {
        return Object.keys(versions).map(version => ({
          version: version,
          ...versions[version],
        }))
      },
    },
    developer: {
      type: new GraphQLNonNull(appAuthor),
      resolve: (self, args, ctx) => {
        const dev = ctx.openVault.identities.getOwnDeveloper(
          self.data.developerID,
        )
        return {
          id: dev.id,
          name: dev.profile.name,
        }
      },
    },
    users: {
      type: new GraphQLList(appUser),
      resolve: ({ settings }) => {
        return Object.keys(settings).map(id => ({
          localID: id,
          settings: settings[id],
        }))
      },
    },
  }),
})

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
      type: GraphQLNonNull(GraphQLString),
    },
    avatar: {
      type: GraphQLString,
    },
    ethAddress: {
      type: GraphQLString,
    },
  }),
})

export const ownAppIdentity = new GraphQLObjectType({
  name: 'OwnAppIdentity',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    // TODO: consistent id naming
    localID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    mfid: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: self => self.id,
    },
    pubKey: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
})

export const ownDeveloperIdentity = new GraphQLObjectType({
  name: 'OwnDeveloperIdentity',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    mfid: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: self => self.id,
    },
    pubKey: {
      type: new GraphQLNonNull(GraphQLString),
    },
    profile: {
      type: new GraphQLNonNull(namedProfile),
    },
  }),
})

export const ownUserIdentity = new GraphQLObjectType({
  name: 'OwnUserIdentity',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    feedHash: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: self => self.publicFeed.feedHash,
    },
    mfid: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: self => self.id,
    },
    apps: {
      type: new GraphQLList(app),
      resolve: (self, args, ctx: ClientContext) => {
        return ctx.openVault.apps.getAppsForUser(self.localID)
      },
    },
    defaultEthAddress: {
      type: GraphQLString,
      resolve: (self, args, ctx) => {
        return ctx.queries.getUserDefaultEthAccount(self.localID)
      },
    },
    wallets: {
      type: new GraphQLNonNull(ethWallets),
      resolve: (self, args, ctx) => {
        return ctx.queries.getUserEthWallets(self.localID)
      },
    },
    profile: {
      type: new GraphQLNonNull(namedProfile),
    },
    pubKey: {
      type: new GraphQLNonNull(GraphQLString),
    },
    privateProfile: {
      type: GraphQLBoolean,
    },
  }),
})

export const peerAppIdentity = new GraphQLObjectType({
  name: 'PeerAppIdentity',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    pubKey: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
})

export const peerDeveloperIdentity = new GraphQLObjectType({
  name: 'PeerDeveloperIdentity',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    pubKey: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
})

export const peerUserIdentity = new GraphQLObjectType({
  name: 'PeerUserIdentity',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    pubKey: {
      type: new GraphQLNonNull(GraphQLString),
    },
    profile: {
      type: new GraphQLNonNull(genericProfile),
    },
  }),
})

export const peer = new GraphQLObjectType({
  name: 'Peer',
  fields: () => ({
    publicKey: {
      type: new GraphQLNonNull(GraphQLString),
    },
    publicFeed: {
      type: new GraphQLNonNull(GraphQLString),
    },
    profile: {
      type: new GraphQLNonNull(genericProfile),
    },
  }),
})

export const connectionState = new GraphQLEnumType({
  name: 'ConnectionState',
  values: {
    CONNECTED: { value: 'connected' },
    SENDING: { value: 'sending' },
    SENT: { value: 'sent' },
  },
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
    },
    publicFeed: {
      type: new GraphQLNonNull(GraphQLString),
    },
    pubKey: {
      type: new GraphQLNonNull(GraphQLString),
    },
    profile: {
      type: new GraphQLNonNull(genericProfile),
      resolve: (self, args, ctx: ClientContext) => {
        return ctx.openVault.identities.getContactProfile(self.localID)
      },
    },
    connectionState: {
      type: new GraphQLNonNull(connectionState),
    },
  }),
})

export const contacts = new GraphQLObjectType({
  name: 'Contacts',
  fields: () => ({
    userContacts: {
      type: new GraphQLList(contact),
      args: {
        userID: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (self, args, ctx) => {
        return ctx.queries.getUserContacts(args.userID)
      },
    },
  }),
})

export const apps = new GraphQLObjectType({
  name: 'Apps',
  fields: () => ({
    installed: {
      type: new GraphQLList(app),
      resolve: (self, args, ctx: ClientContext) => {
        return Object.values(ctx.openVault.apps.apps)
      },
    },
    own: {
      type: new GraphQLList(ownApp),
      resolve: (self, args, ctx: ClientContext) => {
        return Object.values(ctx.openVault.apps.ownApps)
      },
    },
  }),
})

export const identities = new GraphQLObjectType({
  name: 'Identities',
  fields: () => ({
    ownUsers: {
      type: new GraphQLList(ownUserIdentity),
      resolve: (self, args, ctx: ClientContext) => {
        return Object.values(ctx.openVault.identities.ownUsers)
      },
    },
    ownDevelopers: {
      type: new GraphQLList(ownDeveloperIdentity),
      resolve: (self, args, ctx: ClientContext) => {
        return Object.values(ctx.openVault.identities.ownDevelopers)
      },
    },
  }),
})

export const peers = new GraphQLObjectType({
  name: 'Peers',
  fields: () => ({
    peerLookupByFeed: {
      type: peer,
      args: {
        feedHash: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (self, args, ctx: ClientContext) => {
        try {
          const peerPublicRes = await ctx.io.bzz.download(args.feedHash)
          const data = await peerPublicRes.json()
          return {
            profile: data.profile,
            publicFeed: args.feedHash,
            publicKey: data.publicKey,
          }
        } catch (err) {
          ctx.log(err)
          return null
        }
      },
    },
  }),
})

export const walletBalances = new GraphQLObjectType({
  name: 'WalletBalances',
  fields: () => ({
    eth: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (self, args, ctx) => {
        try {
          return await ctx.io.eth.getETHBalance(self)
        } catch (err) {
          ctx.log(err)
          return 0
        }
      },
    },
    mft: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (self, args, ctx) => {
        try {
          return await ctx.io.eth.getMFTBalance(self)
        } catch (err) {
          ctx.log(err)
          return 0
        }
      },
    },
  }),
})

export const walletAccount = new GraphQLObjectType({
  name: 'WalletAccount',
  fields: () => ({
    address: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: self => self,
    },
    balances: {
      type: new GraphQLNonNull(walletBalances),
      resolve: self => self,
    },
  }),
})

export const ethLedgerWallet = new GraphQLObjectType({
  name: 'EthLedgerWallet',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    name: {
      type: GraphQLString,
    },
    localID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    accounts: {
      type: new GraphQLList(walletAccount),
    },
  }),
})

export const ethHdWallet = new GraphQLObjectType({
  name: 'EthHDWallet',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    name: {
      type: GraphQLString,
    },
    localID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    mnemonic: {
      type: new GraphQLNonNull(GraphQLString),
    },
    accounts: {
      type: new GraphQLList(walletAccount),
    },
  }),
})

export const ethWallets = new GraphQLObjectType({
  name: 'EthWallets',
  fields: () => ({
    hd: {
      type: new GraphQLList(ethHdWallet),
      resolve: self => {
        return self.filter(w => w.type === 'hd')
      },
    },
    ledger: {
      type: new GraphQLList(ethLedgerWallet),
      resolve: self => {
        return self.filter(w => w.type === 'ledger')
      },
    },
  }),
})

export const wallets = new GraphQLObjectType({
  name: 'Wallets',
  fields: () => ({
    ethWallets: {
      type: new GraphQLNonNull(ethWallets),
      args: {
        userID: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (self, args, ctx: ClientContext) => {
        return ctx.queries.getUserEthWallets(args.userID)
      },
    },
  }),
})

export const settings = new GraphQLObjectType({
  name: 'Settings',
  fields: () => ({
    ethereumUrl: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (self, args, ctx: ClientContext) => {
        return ctx.openVault.settings.ethURL
      },
    },
  }),
})

export const viewer = new GraphQLObjectType({
  name: 'Viewer',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: () => 'viewer',
    },
    apps: {
      type: new GraphQLNonNull(apps),
      resolve: () => ({}),
    },
    contacts: {
      type: new GraphQLNonNull(contacts),
      resolve: () => ({}),
    },
    identities: {
      type: new GraphQLNonNull(identities),
      resolve: () => ({}),
    },
    wallets: {
      type: new GraphQLNonNull(wallets),
      resolve: () => ({}),
    },
    settings: {
      type: new GraphQLNonNull(settings),
      resolve: () => ({}),
    },
  }),
})
