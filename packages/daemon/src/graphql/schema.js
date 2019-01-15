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
  GraphQLSchema,
  GraphQLString,
  GraphQLInputObjectType,
} from 'graphql'
import {
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
  mutationWithClientMutationId,
} from 'graphql-relay'

import { App, OwnApp } from '../app'
import {
  OwnAppIdentity,
  OwnDeveloperIdentity,
  OwnUserIdentity,
  PeerAppIdentity,
  PeerDeveloperIdentity,
  PeerUserIdentity,
} from '../identity'

import LedgerWallet from '../wallet/LedgerWallet'
import HDWallet from '../wallet/HDWallet'

import type RequestContext from '../rpc/RequestContext'

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId: string, ctx: RequestContext) => {
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
      return appType
    }
    if (obj instanceof HDWallet) {
      return ethHdWalletType
    }
    if (obj instanceof LedgerWallet) {
      return ethLedgerWalletType
    }
    if (obj instanceof OwnApp) {
      return ownAppType
    }
    if (obj instanceof OwnAppIdentity) {
      return ownAppIdentityType
    }
    if (obj instanceof OwnDeveloperIdentity) {
      return ownDeveloperIdentityType
    }
    if (obj instanceof OwnUserIdentity) {
      return ownUserIdentityType
    }
    if (obj instanceof PeerAppIdentity) {
      return peerAppIdentityType
    }
    if (obj instanceof PeerDeveloperIdentity) {
      return peerDeveloperIdentityType
    }
    if (obj instanceof PeerUserIdentity) {
      return peerUserIdentityType
    }
    return null
  },
)

const idResolver = globalIdField(null, obj => obj.localID)

const webRequestGrants = new GraphQLObjectType({
  name: 'WebRequestGrants',
  fields: () => ({
    granted: { type: new GraphQLList(GraphQLString) },
    denied: { type: new GraphQLList(GraphQLString) },
  }),
})

const appPermissionGrants = new GraphQLObjectType({
  name: 'AppPermissions',
  fields: () => ({
    BLOCKCHAIN_SEND: { type: GraphQLBoolean },
    SWARM_UPLOAD: { type: GraphQLBoolean },
    SWARM_DOWNLOAD: { type: GraphQLBoolean },
    WEB_REQUEST: { type: new GraphQLNonNull(webRequestGrants) },
  }),
})

const appPermissionSettings = new GraphQLObjectType({
  name: 'AppPermissionsSettings',
  fields: () => ({
    permissionsChecked: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: self => self.permissionsChecked,
    },
    grants: {
      type: new GraphQLNonNull(appPermissionGrants),
    },
  }),
})

const appUserSettings = new GraphQLObjectType({
  name: 'AppUserSettings',
  fields: () => ({
    permissionsSettings: {
      type: new GraphQLNonNull(appPermissionSettings),
      resolve: self => self.permissionsSettings,
    },
  }),
})

const appUser = new GraphQLObjectType({
  name: 'AppUser',
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    identity: {
      type: new GraphQLNonNull(ownUserIdentityType),
      resolve: (self, args, ctx: RequestContext) => {
        return ctx.openVault.identities.getOwnUser(self.localID)
      },
    },
    settings: {
      type: new GraphQLNonNull(appUserSettings),
    },
  }),
})

const appPermissionDefinitions = new GraphQLObjectType({
  name: 'AppPermissionDefinitions',
  fields: () => ({
    WEB_REQUEST: {
      type: new GraphQLList(GraphQLString),
    },
    BLOCKCHAIN_SEND: {
      type: GraphQLBoolean,
    },
  }),
})

const appPermissionsRequirements = new GraphQLObjectType({
  name: 'AppPermissionsRequirements',
  fields: () => ({
    optional: {
      type: new GraphQLNonNull(appPermissionDefinitions),
      resolve: self => self.optional,
    },
    required: {
      type: new GraphQLNonNull(appPermissionDefinitions),
      resolve: self => self.required,
    },
  }),
})

const appAuthorType = new GraphQLObjectType({
  name: 'AppAuthor',
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: self => self.id,
    },
    name: {
      type: GraphQLString,
      resolve: self => self.name,
    },
  }),
})

const appManifestData = new GraphQLObjectType({
  name: 'AppManifestData',
  fields: () => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: self => self.name,
    },
    version: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: self => self.version,
    },
    permissions: {
      type: new GraphQLNonNull(appPermissionsRequirements),
      resolve: self => self.permissions,
    },
    author: {
      type: new GraphQLNonNull(appAuthorType),
      resolve: self => self.author,
    },
  }),
})

const appVersionData = new GraphQLObjectType({
  name: 'AppVersionData',
  fields: () => ({
    version: {
      type: new GraphQLNonNull(GraphQLString),
    },
    permissions: {
      type: new GraphQLNonNull(appPermissionsRequirements),
      resolve: self => self.permissions,
    },
    publicationState: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
})

const appType = new GraphQLObjectType({
  name: 'App',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: globalIdField(),
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
      resolve: self => self.manifest,
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

const ownAppType = new GraphQLObjectType({
  name: 'OwnApp',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: globalIdField(),
    localID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: self => self.id,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: self => self.data.name,
    },
    versions: {
      type: new GraphQLList(appVersionData),
      resolve: ({ versions }) => {
        return Object.keys(versions).map(version => ({
          version: version,
          ...versions[version],
        }))
      },
    },
    developer: {
      type: new GraphQLNonNull(appAuthorType),
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

const userWalletType = new GraphQLObjectType({
  name: 'UserWalletType',
  fields: () => ({
    localID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: self => self.localID,
    },
    accounts: {
      type: new GraphQLList(GraphQLString),
      resolve: self => self.accounts,
    },
  }),
})

const ownAppIdentityType = new GraphQLObjectType({
  name: 'OwnAppIdentity',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    // TODO: consistent id naming
    localID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: self => self.localID,
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

const ownDeveloperIdentityType = new GraphQLObjectType({
  name: 'OwnDeveloperIdentity',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: self => self.localID,
    },
    mfid: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: self => self.id,
    },
    pubKey: {
      type: new GraphQLNonNull(GraphQLString),
    },
    profile: {
      type: new GraphQLObjectType({
        name: 'OwnDeveloperProfile',
        fields: () => ({
          name: {
            type: GraphQLNonNull(GraphQLString),
            resolve: self => self.name,
          },
        }),
      }),
      resolve: self => self.profile,
    },
  }),
})

const ownUserIdentityType = new GraphQLObjectType({
  name: 'OwnUserIdentity',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: self => self.localID,
    },
    mfid: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: self => self.id,
    },
    apps: {
      type: new GraphQLList(appType),
      resolve: (self, args, ctx: RequestContext) => {
        return ctx.openVault.apps.getAppsForUser(self.localID)
      },
    },
    wallets: {
      type: new GraphQLList(userWalletType),
      resolve: (self, args, ctx) => {
        const wallets = ctx.openVault.getWalletsForIdentity(self.localID)
        return Object.keys(wallets).map(id => {
          return {
            localID: id,
            accounts: wallets[id],
          }
        })
      },
    },
    profile: {
      type: new GraphQLObjectType({
        name: 'OwnUserProfile',
        fields: () => ({
          name: {
            type: GraphQLNonNull(GraphQLString),
            resolve: self => self.name,
          },
        }),
      }),
      resolve: self => self.profile,
    },
    pubKey: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
})

const peerAppIdentityType = new GraphQLObjectType({
  name: 'PeerAppIdentity',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: self => self.localID,
    },
    pubKey: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
})

const peerDeveloperIdentityType = new GraphQLObjectType({
  name: 'PeerDeveloperIdentity',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: self => self.localID,
    },
    pubKey: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
})

const peerUserIdentityType = new GraphQLObjectType({
  name: 'PeerUserIdentity',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: self => self.localID,
    },
    pubKey: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
})

const appsQueryType = new GraphQLObjectType({
  name: 'AppsQuery',
  fields: () => ({
    installed: {
      type: new GraphQLList(appType),
      resolve: (self, args, ctx: RequestContext) => {
        return Object.values(ctx.openVault.apps.apps)
      },
    },
    own: {
      type: new GraphQLList(ownAppType),
      resolve: (self, args, ctx: RequestContext) => {
        return Object.values(ctx.openVault.apps.ownApps)
      },
    },
  }),
})

const identitiesQueryType = new GraphQLObjectType({
  name: 'IdentitiesQuery',
  fields: () => ({
    ownUsers: {
      type: new GraphQLList(ownUserIdentityType),
      resolve: (self, args, ctx: RequestContext) => {
        return Object.values(ctx.openVault.identities.ownUsers)
      },
    },
    ownDevelopers: {
      type: new GraphQLList(ownDeveloperIdentityType),
      resolve: (self, args, ctx: RequestContext) => {
        return Object.values(ctx.openVault.identities.ownDevelopers)
      },
    },
  }),
})

const ethLedgerWalletType = new GraphQLObjectType({
  name: 'EthLedgerWallet',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: self => self.localID,
    },
    accounts: {
      type: new GraphQLList(namedWalletAccountType),
      resolve: self => self.accounts,
    },
  }),
})

const walletBalancesType = new GraphQLObjectType({
  name: 'WalletBalancesType',
  fields: () => ({
    eth: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (self, args, ctx) => {
        const balance = await ctx.eth.getETHBalance(self)
        return balance || 0
      },
    },
    mft: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (self, args, ctx) => {
        const balance = await ctx.eth.getMFTBalance(self)
        return balance || 0
      },
    },
  }),
})

const namedWalletAccountType = new GraphQLObjectType({
  name: 'NamedWalletAccountType',
  fields: () => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: self => self.name,
    },
    address: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: self => self.address,
    },
    balances: {
      type: new GraphQLNonNull(walletBalancesType),
      resolve: self => self.address,
    },
  }),
})

const ethHdWalletType = new GraphQLObjectType({
  name: 'EthHDWallet',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: idResolver,
    localID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: self => self.localID,
    },
    accounts: {
      type: new GraphQLList(namedWalletAccountType),
      resolve: self => self.accounts,
    },
  }),
})

const ethWalletsType = new GraphQLObjectType({
  name: 'EthWallets',
  fields: () => ({
    hd: {
      type: new GraphQLList(ethHdWalletType),
      resolve: self => {
        return Object.keys(self.hd).map(id => {
          return {
            localID: id,
            accounts: self.hd[id].getNamedAccounts(),
          }
        })
      },
    },
    ledger: {
      type: new GraphQLList(ethLedgerWalletType),
      resolve: self => {
        return Object.keys(self.ledger).map(id => {
          return {
            localID: id,
            accounts: self.ledger[id].getNamedAccounts(),
          }
        })
      },
    },
  }),
})

const walletsQueryType = new GraphQLObjectType({
  name: 'WalletsQuery',
  fields: () => ({
    ethWallets: {
      type: new GraphQLNonNull(ethWalletsType),
      resolve: (self, args, ctx: RequestContext) => {
        return ctx.openVault.wallets.ethWallets
      },
    },
  }),
})

const viewerType = new GraphQLObjectType({
  name: 'Viewer',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: () => 'viewer',
    },
    apps: {
      type: new GraphQLNonNull(appsQueryType),
      resolve: () => ({}),
    },
    identities: {
      type: new GraphQLNonNull(identitiesQueryType),
      resolve: () => ({}),
    },
    wallets: {
      type: new GraphQLNonNull(walletsQueryType),
      resolve: () => ({}),
    },
  }),
})

// MUTATIONS

const supportedWalletsEnum = new GraphQLEnumType({
  name: 'SupportedWallets',
  values: {
    ETHEREUM: { value: 'ethereum' },
  },
})

const deleteWalletMutation = mutationWithClientMutationId({
  name: 'DeleteWallet',
  inputFields: {
    walletID: {
      type: new GraphQLNonNull(GraphQLString),
    },
    type: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    viewer: {
      type: new GraphQLNonNull(viewerType),
      resolve: () => ({}),
    },
  },
  mutateAndGetPayload: async (args, ctx) => {
    ctx.openVault.wallets.deleteWallet({
      chain: 'ethereum',
      type: args.type,
      walletID: args.walletID,
    })
    ctx.openVault.identityWallets.deleteWallet(args.walletID)
    await ctx.openVault.save()
    return {}
  },
})

const addHDWalletAccountMutation = mutationWithClientMutationId({
  name: 'AddHDWalletAccount',
  inputFields: {
    walletID: {
      type: new GraphQLNonNull(GraphQLString),
    },
    index: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    address: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: payload => payload.address,
    },
    viewer: {
      type: new GraphQLNonNull(viewerType),
      resolve: () => ({}),
    },
  },
  mutateAndGetPayload: async (args, ctx) => {
    const address = ctx.openVault.wallets.addHDWalletAccount(args)
    await ctx.openVault.save()
    return { address }
  },
})

const importHDWalletMutation = mutationWithClientMutationId({
  name: 'ImportHDWallet',
  inputFields: {
    type: {
      type: new GraphQLNonNull(supportedWalletsEnum),
    },
    mnemonic: {
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    linkToUserId: {
      type: GraphQLString,
    },
  },
  outputFields: {
    hdWallet: {
      type: ethHdWalletType,
      resolve: payload => payload,
    },
    viewer: {
      type: new GraphQLNonNull(viewerType),
      resolve: () => ({}),
    },
  },
  mutateAndGetPayload: async (args, ctx) => {
    const words = args.mnemonic.split(' ')
    if (words.length !== 12) {
      throw new Error('Seed phrase must consist of 12 words.')
    }
    const res = ctx.openVault.wallets.importMnemonicWallet({
      chain: args.type,
      mnemonic: args.mnemonic,
      name: args.name,
    })
    if (args.linkToUserId) {
      await ctx.openVault.identityWallets.linkWalletToIdentity(
        args.linkToUserId,
      )
    }
    await ctx.openVault.save()
    return {
      localID: res.walletID,
      accounts: [{ address: res.accounts[0], name: args.name }],
    }
  },
})

const createHDWalletMutation = mutationWithClientMutationId({
  name: 'CreateHDWallet',
  inputFields: {
    type: {
      type: new GraphQLNonNull(supportedWalletsEnum),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    linkToUserId: {
      type: GraphQLString,
    },
  },
  outputFields: {
    hdWallet: {
      type: ethHdWalletType,
      resolve: payload => payload,
    },
    viewer: {
      type: new GraphQLNonNull(viewerType),
      resolve: () => ({}),
    },
  },
  mutateAndGetPayload: async (args, ctx) => {
    const res = ctx.openVault.wallets.createHDWallet({
      chain: args.type,
      name: args.name,
    })
    if (args.linkToUserId) {
      await ctx.openVault.identityWallets.linkWalletToIdentity(
        args.linkToUserId,
      )
    }
    await ctx.openVault.save()
    return {
      localID: res.walletID,
      accounts: res.accounts,
    }
  },
})

const addLedgerWalletAccountMutation = mutationWithClientMutationId({
  name: 'AddLedgerWalletAccount',
  inputFields: {
    index: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    address: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: payload => payload.address,
    },
    walletID: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: payload => payload.walletID,
    },
    viewer: {
      type: new GraphQLNonNull(viewerType),
      resolve: () => ({}),
    },
  },
  mutateAndGetPayload: async (args, ctx) => {
    const res = await ctx.openVault.wallets.addLedgerEthAccount(args)
    await ctx.openVault.save()
    return res
  },
})

const userProfileInput = new GraphQLInputObjectType({
  name: 'UserProfileInput',
  fields: () => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    avatar: {
      type: GraphQLString,
    },
  }),
})

const createUserIdentityMutation = mutationWithClientMutationId({
  name: 'CreateUserIdentity',
  inputFields: {
    profile: {
      type: new GraphQLNonNull(userProfileInput),
    },
  },
  outputFields: {
    user: {
      type: ownUserIdentityType,
      resolve: payload => payload.user,
    },
    viewer: {
      type: new GraphQLNonNull(viewerType),
      resolve: () => ({}),
    },
  },
  mutateAndGetPayload: async (args, ctx) => {
    const user = ctx.openVault.identities.createOwnUser(args.profile)
    await ctx.openVault.save()
    return { user }
  },
})

const createDeveloperIdentityMutation = mutationWithClientMutationId({
  name: 'CreateDeveloperIdentity',
  inputFields: {
    profile: {
      type: new GraphQLNonNull(userProfileInput),
    },
  },
  outputFields: {
    user: {
      type: ownDeveloperIdentityType,
      resolve: payload => payload.user,
    },
    viewer: {
      type: new GraphQLNonNull(viewerType),
      resolve: () => ({}),
    },
  },
  mutateAndGetPayload: async (args, ctx) => {
    const user = ctx.openVault.identities.createOwnDeveloper(args.profile)
    await ctx.openVault.save()
    return { user }
  },
})

const appPermissionDefinitionsInput = new GraphQLInputObjectType({
  name: 'AppPermissionDefinitionsInput',
  fields: () => ({
    WEB_REQUEST: {
      type: new GraphQLList(GraphQLString),
    },
    BLOCKCHAIN_SEND: {
      type: GraphQLBoolean,
    },
    SWARM_UPLOAD: {
      type: GraphQLBoolean,
    },
    SWARM_DOWNLOAD: {
      type: GraphQLBoolean,
    },
  }),
})

const appPermissionsRequirementsInput = new GraphQLInputObjectType({
  name: 'AppPermissionsRequirementsInput',
  fields: () => ({
    optional: {
      type: new GraphQLNonNull(appPermissionDefinitionsInput),
    },
    required: {
      type: new GraphQLNonNull(appPermissionDefinitionsInput),
    },
  }),
})

const appCreateMutation = mutationWithClientMutationId({
  name: 'AppCreateMutation',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    contentsPath: {
      type: new GraphQLNonNull(GraphQLString),
    },
    version: {
      type: new GraphQLNonNull(GraphQLString),
    },
    developerID: {
      type: new GraphQLNonNull(GraphQLString),
    },
    permissionsRequirements: {
      type: new GraphQLNonNull(appPermissionsRequirementsInput),
    },
  },
  outputFields: {
    app: {
      type: ownAppType,
      resolve: payload => payload.app,
    },
    viewer: {
      type: new GraphQLNonNull(viewerType),
      resolve: () => ({}),
    },
  },
  mutateAndGetPayload: async (args, ctx) => {
    const app = ctx.openVault.createApp({
      contentsPath: args.contentsPath,
      developerID: args.developerID,
      name: args.name,
      version: args.version,
      permissionsRequirements: args.permissionsRequirements,
    })
    await ctx.openVault.save()
    return { app }
  },
})

const manifestAuthorInput = new GraphQLInputObjectType({
  name: 'ManifestAuthorInput',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
})

const appManifestInput = new GraphQLInputObjectType({
  name: 'AppManifestInput',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    version: {
      type: new GraphQLNonNull(GraphQLString),
    },
    contentsURI: {
      type: new GraphQLNonNull(GraphQLString),
    },
    permissions: {
      type: new GraphQLNonNull(appPermissionsRequirementsInput),
    },
    author: {
      type: new GraphQLNonNull(manifestAuthorInput),
    },
  }),
})

const webRequestGrantInput = new GraphQLInputObjectType({
  name: 'WebRequestGrantInput',
  fields: () => ({
    granted: { type: new GraphQLList(GraphQLString) },
    denied: { type: new GraphQLList(GraphQLString) },
  }),
})

const permissionGrantsInput = new GraphQLInputObjectType({
  name: 'PermissionGrantsInput',
  fields: () => ({
    BLOCKCHAIN_SEND: { type: GraphQLBoolean },
    SWARM_UPLOAD: { type: GraphQLBoolean },
    SWARM_DOWNLOAD: { type: GraphQLBoolean },
    WEB_REQUEST: { type: new GraphQLNonNull(webRequestGrantInput) },
  }),
})

const appPermissionSettingsInput = new GraphQLInputObjectType({
  name: 'AppPermissionsSettingsInput',
  fields: () => ({
    permissionsChecked: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    grants: {
      type: new GraphQLNonNull(permissionGrantsInput),
    },
  }),
})

const appInstallMutation = mutationWithClientMutationId({
  name: 'AppInstallMutation',
  inputFields: {
    userID: {
      type: new GraphQLNonNull(GraphQLString),
    },
    manifest: {
      type: new GraphQLNonNull(appManifestInput),
    },
    permissionsSettings: {
      type: new GraphQLNonNull(appPermissionSettingsInput),
    },
  },
  outputFields: {
    app: {
      type: appType,
      resolve: payload => payload.app,
    },
    viewer: {
      type: new GraphQLNonNull(viewerType),
      resolve: () => ({}),
    },
  },
  mutateAndGetPayload: async (
    { userID, manifest, permissionsSettings },
    ctx,
  ) => {
    const app = ctx.openVault.installApp(manifest, userID, permissionsSettings)
    await ctx.openVault.save()
    return { app }
  },
})

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createApp: appCreateMutation,
    installApp: appInstallMutation,
    createUserIdentity: createUserIdentityMutation,
    createDeveloperIdentity: createDeveloperIdentityMutation,
    createHDWallet: createHDWalletMutation,
    importHDWallet: importHDWalletMutation,
    addHDWalletAccount: addHDWalletAccountMutation,
    addLedgerWalletAccount: addLedgerWalletAccountMutation,
    deleteWallet: deleteWalletMutation,
  }),
})

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    viewer: {
      type: new GraphQLNonNull(viewerType),
      resolve: () => ({}),
    },
  }),
})

export default new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
})
