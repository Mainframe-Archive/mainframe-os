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

import {
  app,
  contact,
  ethHdWallet,
  ownApp,
  ownDeveloperIdentity,
  ownUserIdentity,
  viewerField,
} from './objects'

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
    viewer: viewerField,
  },
  mutateAndGetPayload: async (args, ctx) => {
    ctx.logger.log({
      level: 'debug',
      message: 'DeleteWallet mutation called',
      args,
    })

    try {
      let wallet
      if (args.type === 'hd') {
        wallet = await ctx.getDoc('eth_wallets_hd', args.walletID)
      } else if (args.type === 'ledger') {
        wallet = await ctx.getDoc('eth_wallets_ledger', args.walletID)
      } else {
        throw new Error('Unsupported wallet type')
      }
      if (wallet == null) {
        throw new Error('Wallet not found')
      }

      await wallet.safeRemove()
      ctx.logger.log({
        level: 'debug',
        message: 'DeleteWallet mutation complete',
        walletID: args.walletID,
      })
      return {}
    } catch (error) {
      ctx.logger.log({
        level: 'error',
        message: 'DeleteWallet mutation failed',
        error: error.toString(),
        args,
      })
      throw new Error('Failed to delete wallet')
    }
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
  },
  outputFields: {
    address: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: payload => payload.address,
    },
    viewer: viewerField,
  },
  mutateAndGetPayload: async (args, ctx) => {
    ctx.logger.log({
      level: 'debug',
      message: 'AddHDWalletAccount mutation called',
      args,
    })
    try {
      const wallet = await ctx.getDoc('eth_wallets_hd', args.walletID)
      if (wallet == null) {
        throw new Error('Wallet not found')
      }

      await wallet.addAccounts([args.index])
      const account = wallet.activeAccounts.find(acc => {
        return acc.index === args.index
      })
      ctx.logger.log({
        level: 'debug',
        message: 'AddHDWalletAccount mutation complete',
        walletID: wallet.localID,
        account,
      })
      return { address: account.address }
    } catch (error) {
      ctx.logger.log({
        level: 'error',
        message: 'AddHDWalletAccount mutation failed',
        error: error.toString(),
        args,
      })
      throw new Error('Failed to add wallet account')
    }
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
  },
  outputFields: {
    hdWallet: {
      type: ethHdWallet,
      resolve: payload => payload,
    },
    viewer: viewerField,
  },
  mutateAndGetPayload: async (args, ctx) => {
    ctx.logger.log({
      level: 'debug',
      message: 'ImportHDWallet mutation called',
    })
    try {
      const [user, wallet] = await Promise.all([
        ctx.getUser(),
        ctx.db.eth_wallets_hd.create({
          name: args.name,
          mnemonic: args.mnemonic,
        }),
      ])
      await user.addEthHDWallet(wallet.localID)
      ctx.logger.log({
        level: 'debug',
        message: 'ImportHDWallet mutation complete',
        walletID: wallet.localID,
      })
      return { wallet }
    } catch (error) {
      ctx.logger.log({
        level: 'error',
        message: 'ImportHDWallet mutation failed',
        error: error.toString(),
      })
      throw new Error('Failed to import wallet')
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
  },
  outputFields: {
    hdWallet: {
      type: ethHdWallet,
      resolve: payload => payload.wallet,
    },
    viewer: viewerField,
  },
  mutateAndGetPayload: async (args, ctx) => {
    ctx.logger.log({
      level: 'debug',
      message: 'CreateHDWallet mutation called',
      args,
    })
    try {
      const [user, wallet] = await Promise.all([
        ctx.getUser(),
        ctx.db.eth_wallets_hd.create({ name: args.name }),
      ])
      await user.addEthHDWallet(wallet.localID)
      ctx.logger.log({
        level: 'debug',
        message: 'CreateHDWallet mutation complete',
        walletID: wallet.localID,
      })
      return { wallet }
    } catch (error) {
      ctx.logger.log({
        level: 'error',
        message: 'CreateHDWallet mutation failed',
        error: error.toString(),
      })
      throw new Error('Failed to create wallet')
    }
  },
})

const addLedgerWalletAccountsMutation = mutationWithClientMutationId({
  name: 'AddLedgerWalletAccounts',
  inputFields: {
    indexes: {
      type: new GraphQLList(GraphQLInt),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    userID: {
      type: GraphQLString,
    },
  },
  outputFields: {
    addresses: {
      type: new GraphQLList(GraphQLString),
      resolve: payload => payload.addresses,
    },
    localID: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: payload => payload.localID,
    },
    viewer: viewerField,
  },
  mutateAndGetPayload: async (args, ctx) => {
    const res = await ctx.mutations.addLedgerWalletAccounts(
      args.indexes,
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
    viewer: viewerField,
  },
  mutateAndGetPayload: async (args, ctx) => {
    await ctx.mutations.setUsersDefaultWallet(args.userID, args.address)
    return {}
  },
})

const setEthNetworkMutation = mutationWithClientMutationId({
  name: 'SetEthNetwork',
  inputFields: {
    url: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    viewer: viewerField,
  },
  mutateAndGetPayload: async (args, ctx) => {
    await ctx.mutations.setEthNetwork(args.url)
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
    private: {
      type: GraphQLBoolean,
    },
  },
  outputFields: {
    user: {
      type: ownUserIdentity,
      resolve: payload => payload.user,
    },
    viewer: viewerField,
  },
  mutateAndGetPayload: async (args, ctx) => {
    const user = await ctx.mutations.createUser(args.profile, args.private)
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
    viewer: viewerField,
  },
  mutateAndGetPayload: async (args, ctx) => {
    const user = ctx.openVault.identities.createOwnDeveloper(args.profile)
    await ctx.openVault.save()
    return { user }
  },
})

const updateProfileInput = new GraphQLInputObjectType({
  name: 'UpdateUserProfileInput',
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

const updateProfileMutation = mutationWithClientMutationId({
  name: 'UpdateProfile',
  inputFields: {
    userID: {
      type: new GraphQLNonNull(GraphQLString),
    },
    profile: {
      type: new GraphQLNonNull(updateProfileInput),
    },
    privateProfile: {
      type: GraphQLBoolean,
    },
  },
  outputFields: {
    viewer: viewerField,
  },
  mutateAndGetPayload: async (args, ctx) => {
    await ctx.mutations.updateUser(
      args.userID,
      args.profile,
      args.privateProfile,
    )
    return {}
  },
})

const setUserProfileVisibilityMutation = mutationWithClientMutationId({
  name: 'SetUserProfileVisibility',
  inputFields: {
    userID: {
      type: new GraphQLNonNull(GraphQLString),
    },
    visibile: {
      type: GraphQLBoolean,
    },
  },
  outputFields: {
    viewer: viewerField,
  },
  mutateAndGetPayload: async (args, ctx) => {
    await ctx.mutations.setUserProfileVisibility(args.userID, args.visibile)
    return {}
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
    sendInvite: {
      type: GraphQLBoolean,
    },
  },
  outputFields: {
    contact: {
      type: contact,
      resolve: payload => payload.contact,
    },
    viewer: viewerField,
  },
  mutateAndGetPayload: async (args, ctx) => {
    const contact = await ctx.mutations.createContactFromFeed(
      args.userID,
      args.publicFeed,
      args.aliasName,
    )
    if (args.sendInvite) {
      await ctx.invitesHandler.sendInvite(args.userID, contact)
    }
    const contactData = ctx.queries.mergePeerContactData(contact)
    return { contact: contactData }
  },
})

const deleteContactMutation = mutationWithClientMutationId({
  name: 'DeleteContact',
  inputFields: {
    contactID: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    viewer: viewerField,
  },
  mutateAndGetPayload: async (args, ctx) => {
    ctx.openVault.identities.deleteContact(args.userID, args.contactID)
    await ctx.openVault.save()
  },
})

const acceptContactRequestMutation = mutationWithClientMutationId({
  name: 'AcceptContactRequest',
  inputFields: {
    peerID: {
      type: new GraphQLNonNull(GraphQLString),
    },
    userID: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    viewer: viewerField,
    contact: {
      type: contact,
      resolve: payload => payload.contact,
    },
  },
  mutateAndGetPayload: async (args, ctx) => {
    const contact = await ctx.mutations.createContactFromPeer(
      args.userID,
      args.peerID,
    )
    const contactData = ctx.queries.mergePeerContactData(contact)
    return { contact: contactData }
  },
})

const appPermissionDefinitionsInput = new GraphQLInputObjectType({
  name: 'AppPermissionDefinitionsInput',
  fields: () => ({
    BLOCKCHAIN_SEND: {
      type: GraphQLBoolean,
    },
    COMMS_CONTACT: {
      type: GraphQLBoolean,
    },
    CONTACTS_READ: {
      type: GraphQLBoolean,
    },
    WEB_REQUEST: {
      type: new GraphQLList(GraphQLString),
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
      type: new GraphQLNonNull(ownApp),
      resolve: payload => payload.app,
    },
    viewer: viewerField,
  },
  mutateAndGetPayload: async (args, ctx) => {
    const app = await ctx.mutations.createApp(args)
    return { app }
  },
})

const appCreateVersionMutation = mutationWithClientMutationId({
  name: 'AppCreateVersionMutation',
  inputFields: {
    appID: {
      type: new GraphQLNonNull(GraphQLString),
    },
    version: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    app: {
      type: new GraphQLNonNull(ownApp),
      resolve: payload => payload.app,
    },
    viewer: viewerField,
  },
  mutateAndGetPayload: async (args, ctx) => {
    const app = await ctx.mutations.createAppVersion(args)
    return { app }
  },
})

const setAppPermissionsRequirementsMutation = mutationWithClientMutationId({
  name: 'SetAppPermissionsRequirements',
  inputFields: {
    appID: {
      type: new GraphQLNonNull(GraphQLString),
    },
    permissionsRequirements: {
      type: new GraphQLNonNull(appPermissionsRequirementsInput),
    },
  },
  outputFields: {
    viewer: viewerField,
  },
  mutateAndGetPayload: async (args, ctx) => {
    await ctx.mutations.setAppPermissionsRequirements(
      args.appID,
      args.permissionsRequirements,
    )
    return {}
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
    contentsHash: {
      type: new GraphQLNonNull(GraphQLString),
    },
    updateHash: {
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
    COMMS_CONTACT: { type: GraphQLBoolean },
    CONTACTS_READ: { type: GraphQLBoolean },
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
    viewer: viewerField,
  },
  mutateAndGetPayload: async (
    { userID, manifest, permissionsSettings },
    ctx,
  ) => {
    const app = await ctx.mutations.installApp({
      userID,
      manifest,
      permissionsSettings,
    })
    return { app }
  },
})

const appUpdateMutation = mutationWithClientMutationId({
  name: 'AppUpdateMutation',
  inputFields: {
    appID: {
      type: new GraphQLNonNull(GraphQLString),
    },
    userID: {
      type: new GraphQLNonNull(GraphQLString),
    },
    permissionsSettings: {
      type: appPermissionSettingsInput,
    },
  },
  outputFields: {
    app: {
      type: app,
      resolve: payload => payload.app,
    },
    viewer: viewerField,
  },
  mutateAndGetPayload: async (params, ctx) => {
    const app = await ctx.mutations.updateApp(params)
    return { app }
  },
})

export const updateAppDetailsMutation = mutationWithClientMutationId({
  name: 'UpdateAppDetails',
  inputFields: {
    appID: {
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    contentsPath: {
      type: new GraphQLNonNull(GraphQLString),
    },
    version: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    viewer: viewerField,
  },
  mutateAndGetPayload: async (params, ctx) => {
    await ctx.mutations.updateAppDetails(params)
    return {}
  },
})

const publishAppVersionMutation = mutationWithClientMutationId({
  name: 'PublishAppVersion',
  inputFields: {
    appID: {
      type: new GraphQLNonNull(GraphQLString),
    },
    version: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    versionHash: {
      type: GraphQLNonNull(GraphQLString),
    },
    viewer: viewerField,
  },
  mutateAndGetPayload: async (params, ctx) => {
    const versionHash = await ctx.mutations.publishApp(params)
    return { versionHash }
  },
})

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Apps
    createApp: appCreateMutation,
    createAppVersion: appCreateVersionMutation,
    installApp: appInstallMutation,
    updateApp: appUpdateMutation,
    setAppPermissionsRequirements: setAppPermissionsRequirementsMutation,
    publishAppVersion: publishAppVersionMutation,
    updateAppDetails: updateAppDetailsMutation,
    // Users
    acceptContactRequest: acceptContactRequestMutation,
    addContact: addContactMutation,
    createUserIdentity: createUserIdentityMutation,
    createDeveloperIdentity: createDeveloperIdentityMutation,
    deleteContact: deleteContactMutation,
    setDefaultWallet: setDefaultWalletMutation,
    setUserProfileVisibility: setUserProfileVisibilityMutation,
    updateProfile: updateProfileMutation,
    // Wallets
    addHDWalletAccount: addHDWalletAccountMutation,
    addLedgerWalletAccounts: addLedgerWalletAccountsMutation,
    createHDWallet: createHDWalletMutation,
    deleteWallet: deleteWalletMutation,
    importHDWallet: importHDWalletMutation,
    setEthNetwork: setEthNetworkMutation,
  }),
})
