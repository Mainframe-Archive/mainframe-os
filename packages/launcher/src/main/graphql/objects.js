// @flow

import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  type GraphQLScalarType,
  GraphQLString,
} from 'graphql'
import { fromGlobalId, globalIdField, nodeDefinitions } from 'graphql-relay'

import { isValidContactID } from '../../validation'

import type { GraphQLContext } from '../context/graphql'

const TYPE_COLLECTION = {
  App: 'apps',
  EthHDWallet: 'eth_wallets_hd',
  EthLedgerWallet: 'eth_wallets_ledger',
  OwnApp: 'own_apps',
  OwnDeveloperIdentity: 'own_developers',
  OwnUserIdentity: 'users',
  PeerUserIdentity: 'peers',
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
      case 'eth_wallets_hd':
        return ethHdWallet
      case 'eth_wallets_ledger':
        return ethLedgerWallet
      case 'own_apps':
        return ownApp
      case 'own_developers':
        return ownDeveloperIdentity
      case 'users':
        return user
      case 'peers':
        return peer
      default:
        return null
    }
  },
)

const idResolver = globalIdField(null, obj => obj.localID)

const list = (type: GraphQLObjectType | GraphQLScalarType) => {
  return new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(type)))
}

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

export const appPermissionGrants = new GraphQLObjectType({
  name: 'AppPermissions',
  fields: () => ({
    BLOCKCHAIN_SEND: { type: GraphQLBoolean },
    COMMS_CONTACT: { type: GraphQLBoolean },
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
      resolve: (self, args, ctx: GraphQLContext) => {
        return ctx.getDoc('users', self.localID)
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

export const appUpdateData = new GraphQLObjectType({
  name: 'AppUpdateData',
  fields: () => ({
    manifest: {
      type: new GraphQLNonNull(appManifestData),
      resolve: self => self.app.manifest,
    },
    permissionsChanged: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: self => self.hasRequiredPermissionsChanges,
    },
  }),
})

export const installationState = new GraphQLEnumType({
  name: 'InstallationState',
  values: {
    READY: { value: 'ready' },
    DOWNLOADING: { value: 'downloading' },
    ERROR: { value: 'download_error' },
  },
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
    update: {
      type: appUpdateData,
      resolve: (self, args, ctx) => {
        return ctx.openVault.apps.getUpdate(self.id)
      },
    },
    installationState: {
      type: new GraphQLNonNull(installationState),
    },
    users: {
      type: list(appUser),
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
    },
    contentsPath: {
      type: new GraphQLNonNull(GraphQLString),
    },
    updateFeedHash: {
      type: new GraphQLNonNull(GraphQLString),
    },
    currentVersion: {
      type: new GraphQLNonNull(GraphQLString),
    },
    currentVersionData: {
      type: new GraphQLNonNull(appVersionData),
      resolve: self => ({
        ...self.getVersionData(),
        version: self.currentVersion,
      }),
    },
    publishedVersion: {
      type: GraphQLString,
      resolve: self => {
        const found = self.getSortedVersions().find(v => v.versionHash != null)
        if (found != null) {
          return found.version
        }
      },
    },
    versions: {
      type: list(appVersionData),
      resolve: self => self.getSortedVersions(),
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
      type: list(appUser),
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
      type: GraphQLString,
      resolve: self => self.publicFeed.feedHash,
    },
    mfid: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: self => self.id,
    },
    apps: {
      type: list(app),
      resolve: (self, args, ctx: GraphQLContext) => {
        return ctx.openVault.apps.getInstalledAppsForUser(self.localID)
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
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
    },
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
    DECLINED: { value: 'declined' },
    RECEIVED: { value: 'received' },
    SENDING_FEED: { value: 'sending_feed' },
    SENT_FEED: { value: 'sent_feed' },
    SENDING_BLOCKCHAIN: { value: 'sending_blockchain' },
    SENT_BLOCKCHAIN: { value: 'sent_blockchain' },
  },
})

export const stakeState = new GraphQLEnumType({
  name: 'StakeState',
  values: {
    STAKED: { value: 'staked' },
    RECLAIMING: { value: 'reclaiming' },
    RECLAIMED: { value: 'reclaimed' },
    SEIZED: { value: 'seized' },
  },
})

export const stake = new GraphQLObjectType({
  name: 'InviteStake',
  fields: () => ({
    amount: {
      type: GraphQLString,
    },
    state: {
      type: new GraphQLNonNull(stakeState),
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
      type: new GraphQLNonNull(stake),
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
    localPeerID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: doc => doc.peer,
    },
    publicID: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: doc => doc.getPublicID(),
    },
    publicKey: {
      type: new GraphQLNonNull(GraphQLString),
    },
    invite: {
      type: contactInviteData,
    },
    profile: {
      type: new GraphQLNonNull(genericProfile),
      resolve: (self, args, ctx: GraphQLContext) => {
        // TODO: merge peer and contact profile in contact collection
        return {}
      },
    },
    connectionState: {
      type: new GraphQLNonNull(connectionState),
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

export const contacts = new GraphQLObjectType({
  name: 'Contacts',
  fields: () => ({
    invitesCount: {
      type: new GraphQLNonNull(GraphQLInt),
      args: {
        userID: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (self, args, ctx) => {
        return ctx.queries.getInvitesCount(args.userID)
      },
    },
    userContacts: {
      type: list(contact),
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
      type: list(app),
      resolve: (self, args, ctx: GraphQLContext) => {
        return Object.values(ctx.openVault.apps.apps)
      },
    },
    own: {
      type: list(ownApp),
      resolve: (self, args, ctx: GraphQLContext) => {
        return Object.values(ctx.openVault.apps.ownApps)
      },
    },
    updatesCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (self, args, ctx: GraphQLContext) => {
        return ctx.openVault.apps.getUpdatesCount()
      },
    },
  }),
})

export const identities = new GraphQLObjectType({
  name: 'Identities',
  fields: () => ({
    ownUsers: {
      type: list(ownUserIdentity),
      resolve: (self, args, ctx: GraphQLContext) => {
        return Object.values(ctx.openVault.identities.ownUsers)
      },
    },
    ownDevelopers: {
      type: list(ownDeveloperIdentity),
      resolve: (self, args, ctx: GraphQLContext) => {
        return Object.values(ctx.openVault.identities.ownDevelopers)
      },
    },
  }),
})

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

export const wallets = new GraphQLObjectType({
  name: 'Wallets',
  fields: () => ({
    ethWallets: {
      type: new GraphQLNonNull(ethWallets),
      args: {
        userID: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (self, args, ctx: GraphQLContext) => {
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
      resolve: (self, args, ctx: GraphQLContext) => {
        return ctx.openVault.settings.ethURL
      },
    },
  }),
})

// export const viewer = new GraphQLObjectType({
//   name: 'Viewer',
//   fields: () => ({
//     id: {
//       type: new GraphQLNonNull(GraphQLID),
//       resolve: () => 'viewer',
//     },
//     apps: {
//       type: new GraphQLNonNull(apps),
//       resolve: () => ({}),
//     },
//     contacts: {
//       type: new GraphQLNonNull(contacts),
//       resolve: () => ({}),
//     },
//     identities: {
//       type: new GraphQLNonNull(identities),
//       resolve: () => ({}),
//     },
//     wallets: {
//       type: new GraphQLNonNull(wallets),
//       resolve: () => ({}),
//     },
//     settings: {
//       type: new GraphQLNonNull(settings),
//       resolve: () => ({}),
//     },
//   }),
// })

// NEW OBJECTS BELOW

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
          if (!isValidContactID(args.publicID)) {
            throw new Error('Invalid contact ID')
          }
          const bzz = await ctx.user.getBzz()
          // TODO?: move this replacement logic to validation/utility functions
          const res = await bzz.download(args.publicID.replace('mc', '0x'))
          const data = await res.json()
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
      type: list(app),
      resolve: doc => doc.populate('apps'),
    },
    contacts: {
      type: list(contact),
      resolve: doc => doc.populate('contacts'),
    },
    contactRequests: {
      type: list(contactRequest),
      resolve: doc => doc.populate('contactRequests'),
    },
    defaultEthAddress: {
      type: GraphQLString,
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
