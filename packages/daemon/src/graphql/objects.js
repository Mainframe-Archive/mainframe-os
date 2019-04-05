// @flow

import { idType } from '@mainframe/utils-id'
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLID,
  GraphQLInt,
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

const MFT_TOKEN_ADDRESSES = {
  ropsten: '0xa46f1563984209fe47f8236f8b01a03f03f957e4',
  mainnet: '0xdf2c7238198ad8b389666574f2d8bc411a4b7428',
}

export const { nodeInterface, nodeField } = nodeDefinitions<ClientContext>(
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
    granted: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString)),
      ),
    },
    denied: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString)),
      ),
    },
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
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(appUser))),
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
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(appVersionData)),
      ),
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
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(appUser))),
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
      type: new GraphQLNonNull(GraphQLString),
      resolve: self => self.publicFeed.feedHash,
    },
    mfid: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: self => self.id,
    },
    apps: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(app))),
      resolve: (self, args, ctx: ClientContext) => {
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
    DECLINED: { value: 'declined' },
    RECEIVED: { value: 'received' },
    SENDING_FEED: { value: 'sending_feed' },
    SENT_FEED: { value: 'sent_feed' },
    SENDING_BLOCKCHAIN: { value: 'sending_blockchain' },
    SENT_BLOCKCHAIN: { value: 'sent_blockchain' },
  },
})

export const contactInviteData = new GraphQLObjectType({
  name: 'ContactInviteData',
  fields: () => ({
    inviteTX: {
      type: GraphQLString,
    },
    stake: {
      type: new GraphQLObjectType({
        name: 'InviteStake',
        fields: () => ({
          amount: {
            type: GraphQLString,
          },
          state: {
            type: new GraphQLEnumType({
              name: 'StakeState',
              values: {
                STAKED: { value: 'staked' },
                RECLAIMING: { value: 'reclaiming' },
                RECLAIMED: { value: 'reclaimed' },
                SEIZED: { value: 'seized' },
              },
            }),
          },
          reclaimedTX: {
            type: GraphQLString,
          },
        }),
      }),
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
    },
    publicFeed: {
      type: new GraphQLNonNull(GraphQLString),
    },
    pubKey: {
      type: new GraphQLNonNull(GraphQLString),
    },
    invite: {
      type: contactInviteData,
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
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(contact))),
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
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(app))),
      resolve: (self, args, ctx: ClientContext) => {
        return Object.values(ctx.openVault.apps.apps)
      },
    },
    own: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ownApp))),
      resolve: (self, args, ctx: ClientContext) => {
        return Object.values(ctx.openVault.apps.ownApps)
      },
    },
    updatesCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (self, args, ctx: ClientContext) => {
        return ctx.openVault.apps.getUpdatesCount()
      },
    },
  }),
})

export const identities = new GraphQLObjectType({
  name: 'Identities',
  fields: () => ({
    ownUsers: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(ownUserIdentity)),
      ),
      resolve: (self, args, ctx: ClientContext) => {
        return Object.values(ctx.openVault.identities.ownUsers)
      },
    },
    ownDevelopers: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(ownDeveloperIdentity)),
      ),
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
          const contract = ctx.io.eth.erc20Contract(
            MFT_TOKEN_ADDRESSES[ctx.io.eth._networkName],
          )
          return await contract.getBalance(self)
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
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(ethHdWallet)),
      ),
      resolve: self => {
        return self.filter(w => w.type === 'hd')
      },
    },
    ledger: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(ethLedgerWallet)),
      ),
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
