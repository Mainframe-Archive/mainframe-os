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
  devtoolsField,
  ethHdWallet,
  ethLedgerWallet,
  ownApp,
  ownDeveloper,
  userAppVersion,
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
    setAsDefault: {
      type: GraphQLBoolean,
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
      if (args.setAsDefault) {
        await user.setProfileEthAddress(wallet.activeAccounts[0].address)
      }
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
    setAsDefault: {
      type: GraphQLBoolean,
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
      if (args.setAsDefault) {
        await user.setProfileEthAddress(wallet.activeAccounts[0].address)
      }
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
    setAsDefault: {
      type: GraphQLBoolean,
    },
    legacyPath: {
      type: GraphQLBoolean,
    },
  },
  outputFields: {
    ledgerWallet: {
      type: ethLedgerWallet,
      resolve: payload => payload.wallet,
    },
    viewer: viewerField,
  },
  mutateAndGetPayload: async (args, ctx) => {
    ctx.logger.log({
      level: 'debug',
      message: 'CreateLedgerWallet mutation called',
      args,
    })
    try {
      const wallet = await ctx.db.eth_wallets_ledger.getOrCreate({
        name: args.name,
        legacyPath: args.legacyPath,
      })
      const [user] = await Promise.all([
        ctx.getUser(),
        wallet.addAccounts(args.indexes),
      ])
      await user.addEthLedgerWallet(wallet.localID)
      if (args.setAsDefault) {
        await user.setProfileEthAddress(wallet.activeAccounts[0].address)
      }
      ctx.logger.log({
        level: 'debug',
        message: 'CreateLedgerWallet mutation complete',
        walletID: wallet.localID,
      })
      return { wallet }
    } catch (err) {
      ctx.logger.log({
        level: 'error',
        message: 'CreateLedgerWallet mutation failed',
        error: err.toString(),
      })
      throw new Error('Failed to create wallet')
    }
  },
})

const setProfileWalletMutation = mutationWithClientMutationId({
  name: 'SetProfileWallet',
  inputFields: {
    address: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    viewer: viewerField,
  },
  mutateAndGetPayload: async (args, ctx) => {
    ctx.logger.log({
      level: 'debug',
      message: 'SetProfileWalletMutation mutation called',
      address: args.address,
    })
    try {
      const user = await ctx.getUser()
      await user.setProfileEthAddress(args.address)
      return {}
    } catch (err) {
      ctx.logger.log({
        level: 'error',
        message: 'SetProfileWalletMutation mutation failed',
        error: err.toString(),
      })
      throw err
    }
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
    ctx.logger.log({
      level: 'debug',
      message: 'SetEthNetwork mutation called',
      url: args.url,
    })
    try {
      const user = await ctx.getUser()
      await user.atomicSet('ethURL', args.url)
      return {}
    } catch (err) {
      ctx.logger.log({
        level: 'error',
        message: 'SetEthNetwork mutation failed',
        error: err.toString(),
      })
      throw err
    }
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

const createDeveloperMutation = mutationWithClientMutationId({
  name: 'CreateDeveloper',
  inputFields: {
    profile: {
      type: new GraphQLNonNull(userProfileInput),
    },
  },
  outputFields: {
    developer: {
      type: ownDeveloper,
      resolve: payload => payload.developer,
    },
    devtools: devtoolsField,
  },
  mutateAndGetPayload: async (args, ctx) => {
    ctx.logger.log({
      level: 'debug',
      message: 'CreateDeveloper mutation called',
      profile: args.profile,
    })
    try {
      const developer = await ctx.db.own_developers.create({
        profile: args.profile,
      })
      ctx.logger.log({
        level: 'debug',
        message: 'CreateDeveloper mutation complete',
        profile: args.profile,
        developerID: developer.localID,
      })
      return { developer }
    } catch (err) {
      ctx.logger.log({
        level: 'error',
        message: 'CreateDeveloper mutation failed',
        error: err.toString(),
      })
      throw err
    }
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
    ctx.logger.log({
      level: 'debug',
      message: 'UpdateProfile mutation called',
      profile: args.profile,
      privateProfile: args.privateProfile,
    })
    try {
      const user = await ctx.getUser()
      await user.atomicUpdate(doc => {
        doc.profile = args.profile
        doc.privateProfile = args.privateProfile
      })
      return {}
    } catch (err) {
      ctx.logger.log({
        level: 'error',
        message: 'UpdateProfile mutation failed',
        error: err.toString(),
      })
      throw err
    }
  },
})

const addContactMutation = mutationWithClientMutationId({
  name: 'AddContact',
  inputFields: {
    publicID: {
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
    viewer: viewerField,
  },
  mutateAndGetPayload: async (args, ctx) => {
    ctx.logger.log({
      level: 'debug',
      message: 'AddContact mutation called',
      publicID: args.publicID,
    })
    try {
      const user = await ctx.getUser()
      const contact = await user.addContact(args.publicID, {
        aliasName: args.aliasName,
      })
      ctx.logger.log({
        level: 'debug',
        message: 'AddContact mutation complete',
        publicID: args.publicID,
        contactID: contact.localID,
      })
      return { contact }
    } catch (err) {
      ctx.logger.log({
        level: 'error',
        message: 'AddContact mutation failed',
        error: err.toString(),
      })
      throw err
    }
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
    ctx.logger.log({
      level: 'debug',
      message: 'DeleteContact mutation called',
      contactID: args.contactID,
    })
    try {
      const user = await ctx.getUser()
      await user.removeContact(args.contactID)
      return {}
    } catch (err) {
      ctx.logger.log({
        level: 'error',
        message: 'DeleteContact mutation failed',
        error: err.toString(),
      })
      throw err
    }
  },
})

const acceptContactRequestMutation = mutationWithClientMutationId({
  name: 'AcceptContactRequest',
  inputFields: {
    peerID: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    viewer: viewerField,
    contact: {
      type: new GraphQLNonNull(contact),
      resolve: payload => payload.contact,
    },
  },
  mutateAndGetPayload: async (args, ctx) => {
    ctx.logger.log({
      level: 'debug',
      message: 'AcceptContactRequest mutation called',
      peerID: args.peerID,
    })
    try {
      const user = await ctx.getUser()
      const contactRequest = await user.findContactRequestByPeer(args.peerID)
      if (!contactRequest) {
        throw new Error('Contact request not found for peer: ' + args.peerID)
      }
      const contact = await user.addContactFromRequest(contactRequest)
      ctx.logger.log({
        level: 'debug',
        message: 'AcceptContactRequest mutation complete',
        peerID: args.peerID,
        contactID: contact.localID,
      })
      return { contact }
    } catch (err) {
      ctx.logger.log({
        level: 'error',
        message: 'AcceptContactRequest mutation failed',
        error: err.toString(),
      })
      throw err
    }
  },
})

const webDomainDefinitionInput = new GraphQLInputObjectType({
  name: 'WebDomainDefinitionInput',
  fields: () => ({
    domain: {
      type: new GraphQLNonNull(GraphQLString),
    },
    internal: {
      type: GraphQLBoolean,
    },
    external: {
      type: GraphQLBoolean,
    },
  }),
})

const webDomainsDefinitionsInput = new GraphQLNonNull(
  new GraphQLList(new GraphQLNonNull(webDomainDefinitionInput)),
)

const createAppMutation = mutationWithClientMutationId({
  name: 'CreateApp',
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
    webDomains: {
      type: webDomainsDefinitionsInput,
    },
  },
  outputFields: {
    app: {
      type: new GraphQLNonNull(ownApp),
      resolve: payload => payload.app,
    },
    devtools: devtoolsField,
  },
  mutateAndGetPayload: async (args, ctx) => {
    ctx.logger.log({
      level: 'debug',
      message: 'CreateApp mutation called',
      args,
    })
    try {
      const app = await ctx.db.own_apps.create({
        contentsPath: args.contentsPath,
        developer: args.developerID,
        profile: {
          name: args.name,
        },
        version: args.version,
        webDomains: args.webDomains,
      })
      const userOwnApp = await ctx.db.user_own_apps.createFor(ctx.userID, app)
      ctx.logger.log({
        level: 'debug',
        message: 'CreateApp mutation complete',
        args,
        appID: app.localID,
        userAppSettingsID: userOwnApp.settings,
      })
      return { app }
    } catch (err) {
      ctx.logger.log({
        level: 'error',
        message: 'CreateApp mutation failed',
        error: err.toString(),
      })
      throw err
    }
  },
})

const createAppVersionMutation = mutationWithClientMutationId({
  name: 'CreateAppVersion',
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
    ctx.logger.log({
      level: 'debug',
      message: 'CreateAppVersion mutation called',
      appID: args.appID,
      version: args.version,
    })
    try {
      const app = await ctx.getDoc('own_apps', args.appID)
      if (app == null) {
        throw new Error('Application not found')
      }
      await app.addVersion({ version: args.version })
      return { app }
    } catch (err) {
      ctx.logger.log({
        level: 'error',
        message: 'CreateAppVersion mutation failed',
        error: err.toString(),
      })
      throw err
    }
  },
})

const setAppWebDomainsDefinitionsMutation = mutationWithClientMutationId({
  name: 'SetAppWebDomainsDefinitions',
  inputFields: {
    appID: {
      type: new GraphQLNonNull(GraphQLString),
    },
    webDomains: {
      type: webDomainsDefinitionsInput,
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
    ctx.logger.log({
      level: 'debug',
      message: 'SetAppWebDomainsDefinitions mutation called',
      appID: args.appID,
    })
    try {
      const app = await ctx.getDoc('own_apps', args.appID)
      if (app == null) {
        throw new Error('Application not found')
      }
      await app.setWebDomains(args.webDomains)
      return { app }
    } catch (err) {
      ctx.logger.log({
        level: 'error',
        message: 'SetAppWebDomainsDefinitions mutation failed',
        error: err.toString(),
      })
      throw err
    }
  },
})

const installUserAppVersionMutation = mutationWithClientMutationId({
  name: 'InstallUserAppVersionMutation',
  inputFields: {
    appVersionID: {
      type: new GraphQLNonNull(GraphQLString),
    },
    webDomains: {
      type: webDomainsDefinitionsInput,
    },
  },
  outputFields: {
    userAppVersion: {
      type: new GraphQLNonNull(userAppVersion),
      resolve: payload => payload.userAppVersion,
    },
    viewer: viewerField,
  },
  mutateAndGetPayload: async (args, ctx) => {
    ctx.logger.log({
      level: 'debug',
      message: 'InstallUserAppVersion mutation called',
      appVersionID: args.appVersionID,
    })
    try {
      const userAppVersion = await ctx.db.user_app_versions.getOrCreateFor(
        ctx.userID,
        args.appVersionID,
        args.webDomains,
      )
      ctx.logger.log({
        level: 'debug',
        message: 'InstallUserAppVersion appVersion contents download starts',
        appVersionID: args.appVersionID,
      })
      userAppVersion.downloadContents(ctx.user).then(
        () => {
          ctx.logger.log({
            level: 'debug',
            message: 'InstallUserAppVersion appVersion contents downloaded',
            appVersionID: args.appVersionID,
          })
        },
        err => {
          ctx.logger.log({
            level: 'warn',
            message:
              'InstallUserAppVersion appVersion contents download failed',
            appVersionID: args.appVersionID,
            error: err.toString(),
          })
        },
      )
      return { userAppVersion }
    } catch (err) {
      ctx.logger.log({
        level: 'error',
        message: 'InstallUserAppVersion mutation failed',
        appVersionID: args.appVersionID,
        error: err.toString(),
      })
      throw err
    }
  },
})

const updateUserAppVersionMutation = mutationWithClientMutationId({
  name: 'UpdateUserAppVersionMutation',
  inputFields: {
    userAppVersionID: {
      type: new GraphQLNonNull(GraphQLString),
    },
    webDomains: {
      type: webDomainsDefinitionsInput,
    },
  },
  outputFields: {
    userAppVersion: {
      type: new GraphQLNonNull(userAppVersion),
      resolve: payload => payload.userAppVersion,
    },
    viewer: viewerField,
  },
  mutateAndGetPayload: async (args, ctx) => {
    ctx.logger.log({
      level: 'debug',
      message: 'UpdateAppVersion mutation called',
      userAppVersionID: args.userAppVersionID,
    })
    try {
      const userAppVersion = await ctx.getDoc(
        'user_app_versions',
        args.userAppVersionID,
      )
      if (userAppVersion === null) {
        throw new Error('UserAppVersion not found')
      }

      const appVersion = await userAppVersion.populate('appVersion')
      const update = await appVersion.getUpdate()

      if (update === null) {
        ctx.logger.log({
          level: 'warn',
          message: 'UpdateAppVersion update not found',
          userAppVersionID: args.userAppVersionID,
        })
      } else {
        ctx.logger.log({
          level: 'debug',
          message: 'UpdateAppVersion download update',
          userAppVersionID: args.userAppVersionID,
          appVersionID: update.localID,
        })
        await update.downloadContents(ctx.user)
        await userAppVersion.applyUpdate(update.localID, args.webDomains)
        ctx.logger.log({
          level: 'debug',
          message: 'UpdateAppVersion mutation applied update',
          userAppVersionID: args.userAppVersionID,
          appVersionID: update.localID,
        })
      }

      return { userAppVersion }
    } catch (err) {
      ctx.logger.log({
        level: 'error',
        message: 'UpdateAppVersion mutation mailed',
        userAppVersionID: args.userAppVersionID,
        error: err.toString(),
      })
      throw err
    }
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
    app: {
      type: new GraphQLNonNull(ownApp),
      resolve: payload => payload.app,
    },
    viewer: viewerField,
  },
  mutateAndGetPayload: async (args, ctx) => {
    ctx.logger.log({
      level: 'debug',
      message: 'UpdateAppDetails mutation called',
      appID: args.appID,
    })
    try {
      const app = await ctx.getDoc('own_apps', args.appID)
      if (app == null) {
        throw new Error('Application not found')
      }
      await app.setDetails({
        contentsPath: args.contentsPath,
        profile: args.name ? { name: args.name } : undefined,
        version: args.version,
      })
      return { app }
    } catch (err) {
      ctx.logger.log({
        level: 'error',
        message: 'UpdateAppDetails mutation failed',
        error: err.toString(),
      })
      throw err
    }
  },
})

const publishAppVersionMutation = mutationWithClientMutationId({
  name: 'PublishAppVersion',
  inputFields: {
    appID: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    app: {
      type: GraphQLNonNull(ownApp),
      resolve: payload => payload.app,
    },
    versionHash: {
      type: GraphQLNonNull(GraphQLString),
      resolve: payload => payload.versionHash,
    },
    viewer: viewerField,
  },
  mutateAndGetPayload: async (args, ctx) => {
    ctx.logger.log({
      level: 'debug',
      message: 'PublishAppVersion mutation called',
      appID: args.appID,
    })
    try {
      const app = await ctx.getDoc('own_apps', args.appID)
      if (app == null) {
        throw new Error('Application not found')
      }

      const bzz = await ctx.user.getBzz()
      const versionHash = await app.publishVersion(bzz)
      ctx.logger.log({
        level: 'debug',
        message: 'PublishAppVersion mutation succeeded',
        appID: args.appID,
        versionHash,
      })

      return { app, versionHash }
    } catch (err) {
      ctx.logger.log({
        level: 'error',
        message: 'PublishAppVersion mutation failed',
        error: err.toString(),
      })
      throw err
    }
  },
})

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Apps
    createApp: createAppMutation,
    createAppVersion: createAppVersionMutation,
    installUserAppVersion: installUserAppVersionMutation,
    updateUserAppVersion: updateUserAppVersionMutation,
    setAppWebDomainsDefinitions: setAppWebDomainsDefinitionsMutation,
    publishAppVersion: publishAppVersionMutation,
    updateAppDetails: updateAppDetailsMutation,
    // Users
    acceptContactRequest: acceptContactRequestMutation,
    addContact: addContactMutation,
    createDeveloper: createDeveloperMutation,
    deleteContact: deleteContactMutation,
    setProfileWallet: setProfileWalletMutation,
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
