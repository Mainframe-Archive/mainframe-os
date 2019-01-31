// @flow

import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInputObjectType,
} from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'

import { downloadAppContents, getContentsPath } from '../app/AppsRepository'

import {
  app,
  contact,
  ethHdWallet,
  ownApp,
  ownDeveloperIdentity,
  ownUserIdentity,
  viewer,
} from './objects'

const viewerOutput = {
  type: new GraphQLNonNull(viewer),
  resolve: () => ({}),
}

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
    viewer: viewerOutput,
  },
  mutateAndGetPayload: async (args, ctx) => {
    await ctx.mutations.deleteWallet('ethereum', args.type, args.walletID)
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
    userID: {
      type: GraphQLString,
    },
  },
  outputFields: {
    address: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: payload => payload.address,
    },
    viewer: viewerOutput,
  },
  mutateAndGetPayload: async (args, ctx) => {
    const address = await ctx.mutations.addHDWalletAccount(args)
    return { address }
  },
})

const importHDWalletMutation = mutationWithClientMutationId({
  name: 'ImportHDWallet',
  inputFields: {
    blockchain: {
      type: new GraphQLNonNull(supportedWalletsEnum),
    },
    mnemonic: {
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    userID: {
      type: GraphQLString,
    },
  },
  outputFields: {
    hdWallet: {
      type: ethHdWallet,
      resolve: payload => payload,
    },
    viewer: viewerOutput,
  },
  mutateAndGetPayload: async (args, ctx) => {
    const wallet = await ctx.mutations.importHDWallet({
      blockchain: args.blockchain,
      mnemonic: args.mnemonic,
      name: args.name,
      userID: args.userID,
    })
    return {
      localID: wallet.localID,
      accounts: wallet.getAccounts(),
    }
  },
})

const createHDWalletMutation = mutationWithClientMutationId({
  name: 'CreateHDWallet',
  inputFields: {
    blockchain: {
      type: new GraphQLNonNull(supportedWalletsEnum),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    userID: {
      type: GraphQLString,
    },
  },
  outputFields: {
    hdWallet: {
      type: ethHdWallet,
      resolve: payload => payload,
    },
    viewer: viewerOutput,
  },
  mutateAndGetPayload: async (args, ctx) => {
    const wallet = await ctx.mutations.createHDWallet(
      args.blockchain,
      args.name,
      args.userID,
    )
    return {
      localID: wallet.localID,
      mnemonic: wallet.mnemonic,
      accounts: wallet.getAccounts(),
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
    userID: {
      type: GraphQLString,
    },
  },
  outputFields: {
    address: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: payload => payload.address,
    },
    localID: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: payload => payload.localID,
    },
    viewer: viewerOutput,
  },
  mutateAndGetPayload: async (args, ctx) => {
    const res = await ctx.mutations.addLedgerWalletAccount(
      args.index,
      args.name,
      args.userID,
    )
    return res
  },
})

const setDefaultWalletMutation = mutationWithClientMutationId({
  name: 'SetDefaultWallet',
  inputFields: {
    userID: {
      type: new GraphQLNonNull(GraphQLString),
    },
    address: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    viewer: viewerOutput,
  },
  mutateAndGetPayload: async (args, ctx) => {
    await ctx.mutations.setUsersDefaultWallet(args.userID, args.address)
    return {}
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
      type: ownUserIdentity,
      resolve: payload => payload.user,
    },
    viewer: viewerOutput,
  },
  mutateAndGetPayload: async (args, ctx) => {
    const user = await ctx.mutations.createUser(args.profile)
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
      type: ownDeveloperIdentity,
      resolve: payload => payload.user,
    },
    viewer: viewerOutput,
  },
  mutateAndGetPayload: async (args, ctx) => {
    const user = ctx.openVault.identities.createOwnDeveloper(args.profile)
    await ctx.openVault.save()
    return { user }
  },
})

const addContactMutation = mutationWithClientMutationId({
  name: 'AddContact',
  inputFields: {
    userID: {
      type: new GraphQLNonNull(GraphQLString),
    },
    publicFeed: {
      type: new GraphQLNonNull(GraphQLString),
    },
    aliasName: {
      type: GraphQLString,
    },
  },
  outputFields: {
    contact: {
      type: contact,
      resolve: payload => payload.contact,
    },
    viewer: viewerOutput,
  },
  mutateAndGetPayload: async (args, ctx) => {
    return await ctx.mutations.createContactFromFeed(
      args.userID,
      args.publicFeed,
      args.aliasName,
    )
  },
})

const deleteContactMutation = mutationWithClientMutationId({
  name: 'DeletContact',
  inputFields: {
    contactID: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    viewer: viewerOutput,
  },
  mutateAndGetPayload: async (args, ctx) => {
    ctx.openVault.identities.deleteContact(args.userID, args.contactID)
    await ctx.openVault.save()
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
      type: ownApp,
      resolve: payload => payload.app,
    },
    viewer: viewerOutput,
  },
  mutateAndGetPayload: async (args, ctx) => {
    const app = await ctx.mutations.createApp(args)
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
      type: app,
      resolve: payload => payload.app,
    },
    viewer: viewerOutput,
  },
  mutateAndGetPayload: async (
    { userID, manifest, permissionsSettings },
    ctx,
  ) => {
    const app = await ctx.openVault.installApp(
      manifest,
      userID,
      permissionsSettings,
    )
    const contentsPath = getContentsPath(ctx.env, manifest)
    await downloadAppContents(ctx.io.bzz, app, contentsPath)
    await ctx.openVault.save()
    return { app }
  },
})

export default new GraphQLObjectType({
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
    addContact: addContactMutation,
    deleteContact: deleteContactMutation,
    setDefaultWallet: setDefaultWalletMutation,
  }),
})
