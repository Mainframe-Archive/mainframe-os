// @flow

import { Timeline } from '@erebos/timeline'
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
import semver from 'semver'

import { MF_PREFIX, MFT_TOKEN_ADDRESSES } from '../../constants'
import { isValidAppID, isValidPeerID } from '../../validation'

import type { GraphQLContext } from '../context/graphql'
import { readAppManifest, readPeer } from '../data/protocols'
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

export const webDomainDefinition = new GraphQLObjectType({
  name: 'WebDomainDefinition',
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
    webDomains: {
      type: list(webDomainDefinition),
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
    webDomains: {
      type: list(webDomainDefinition),
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
    update: {
      type: appVersion,
      resolve: doc => doc.getUpdate(),
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
    publicID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: doc => doc.getPublicID(),
    },
    developer: {
      type: new GraphQLNonNull(developer),
      resolve: doc => doc.populate('developer'),
    },
    latestAvailableVersion: {
      type: appVersion,
      resolve: doc => doc.populate('latestAvailableVersion'),
    },
    latestDownloadedVersion: {
      type: appVersion,
      resolve: doc => doc.populate('latestDownloadedVersion'),
    },
    versions: {
      type: list(appVersion),
      resolve: async (doc, args, ctx) => {
        return await ctx.db.app_versions.findByAppID(doc.localID)
      },
    },
  }),
})

export const appUpdate = new GraphQLObjectType({
  name: 'AppUpdate',
  fields: () => ({
    fromVersion: {
      type: new GraphQLNonNull(appVersion),
    },
    toVersion: {
      type: new GraphQLNonNull(appVersion),
    },
    permissionsChanged: {
      type: new GraphQLNonNull(GraphQLBoolean),
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
    webDomains: {
      type: list(webDomainDefinition),
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
    viewerOwnAppID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: async (doc, args, ctx) => {
        const userOwnApp = await doc.getUserOwnApp(ctx.userID)
        return userOwnApp.localID
      },
    },
    viewerAppSettings: {
      type: new GraphQLNonNull(userAppSettings),
      resolve: (doc, args, ctx) => doc.getUserAppSettings(ctx.userID),
    },
  }),
})

export const devtools = new GraphQLObjectType({
  name: 'Devtools',
  fields: () => ({
    developers: {
      type: list(ownDeveloper),
      resolve: async (doc, args, ctx) => {
        return await ctx.db.own_developers.find().exec()
      },
    },
  }),
})

export const devtoolsField = {
  type: new GraphQLNonNull(devtools),
  resolve: () => ({}),
}

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
      type: new GraphQLNonNull(GraphQLID),
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

export const contactInvite = new GraphQLObjectType({
  name: 'ContactInvite',
  fields: () => ({
    stakeAmount: {
      type: new GraphQLNonNull(GraphQLString),
    },
    stakeState: {
      type: new GraphQLNonNull(contactStakeState),
    },
    inviteTX: {
      type: new GraphQLNonNull(GraphQLString),
    },
    fromAddress: {
      type: new GraphQLNonNull(GraphQLString),
    },
    toAddress: {
      type: new GraphQLNonNull(GraphQLString),
    },
    ethNetwork: {
      type: new GraphQLNonNull(GraphQLString),
    },
    reclaimedStakeTX: {
      type: GraphQLString,
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
      type: new GraphQLNonNull(GraphQLID),
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
      type: contactInvite,
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
    peerID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: doc => doc.peer,
    },
    peer: {
      type: new GraphQLNonNull(peer),
      resolve: doc => doc.populate('peer'),
    },
    publicID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: doc => doc.getPublicID(),
    },
    profile: {
      type: new GraphQLNonNull(genericProfile),
      resolve: doc => doc.getProfile(),
    },
    receivedAddress: {
      type: new GraphQLNonNull(GraphQLString),
    },
    senderAddress: {
      type: new GraphQLNonNull(GraphQLString),
    },
    stakeAmount: {
      type: new GraphQLNonNull(GraphQLString),
    },
    ethNetwork: {
      type: new GraphQLNonNull(GraphQLString),
    },
    connectionState: {
      type: new GraphQLNonNull(contactConnectionState),
      resolve: () => 'received',
    },
  }),
})

// Wallets

export const walletBalances = new GraphQLObjectType({
  name: 'WalletBalances',
  fields: () => ({
    eth: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (address, args, ctx) => {
        try {
          const user = await ctx.getUser()
          return await user.getEth().getETHBalance(address)
        } catch (err) {
          ctx.logger.log({
            level: 'warn',
            message: 'Failed to retrieve ETH balance',
            error: err.toString(),
            address,
          })
          return 0
        }
      },
    },
    mft: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (address, args, ctx) => {
        try {
          const user = await ctx.getUser()
          const ethClient = user.getEth()
          const contract = ethClient.erc20Contract(
            MFT_TOKEN_ADDRESSES[ethClient.networkName],
          )
          return await contract.getBalance(address)
        } catch (err) {
          ctx.logger.log({
            level: 'warn',
            message: 'Failed to retrieve MFT balance',
            error: err.toString(),
            address,
          })
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
    update: {
      type: appUpdate,
      resolve: async doc => {
        const appVersion = await doc.populate('appVersion')
        const newVersion = await appVersion.getUpdate()

        return newVersion == null
          ? null
          : {
              fromVersion: appVersion,
              toVersion: newVersion,
              permissionsChanged: newVersion.hasWebDomainsChangesFrom(
                appVersion,
              ),
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
      type: list(userAppVersion),
      resolve: doc => doc.getAppsVersions(),
    },
    contacts: {
      type: list(contact),
      resolve: doc => doc.populate('contacts'),
    },
    contactInviteStake: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: doc => doc.getRequiredContactStake(),
    },
    contactRequests: {
      type: list(contactRequest),
      resolve: async doc => {
        const requests = await doc.populate('contactRequests')
        // Only lists requests that haven't been declined
        return requests.filter(c => !c.rejectedTXHash)
      },
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
  resolve: (self: Object, args: Object, ctx: GraphQLContext) => ctx.getUser(),
}

// Lookup (search)

export const appLookupResult = new GraphQLObjectType({
  name: 'AppLookupResult',
  fields: () => ({
    app: {
      type: new GraphQLNonNull(app),
    },
    userAppVersion: {
      type: userAppVersion,
    },
  }),
})

export const peerLookupResult = new GraphQLObjectType({
  name: 'PeerLookupResult',
  fields: () => ({
    publicKey: {
      type: GraphQLString,
    },
    publicID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    profile: {
      type: new GraphQLNonNull(genericProfile),
    },
  }),
})

export const lookup = new GraphQLObjectType({
  name: 'Lookup',
  fields: () => ({
    appByID: {
      type: appLookupResult,
      args: {
        publicID: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: async (self, args, ctx: GraphQLContext) => {
        ctx.logger.log({
          level: 'debug',
          message: 'Lookup app by ID',
          args,
        })
        try {
          if (!isValidAppID(args.publicID)) {
            throw new Error('Invalid app ID')
          }

          const timeline = new Timeline({
            bzz: await ctx.user.getBzz(),
            feed: { user: args.publicID.replace(MF_PREFIX.APP, '0x') },
          })
          const chapter = await timeline.getLatestChapter()
          if (chapter == null) {
            return null
          }

          const manifest = await readAppManifest(chapter.content)
          ctx.logger.log({
            level: 'debug',
            message: 'Lookup app by ID result',
            args,
            manifest,
          })

          let app = await ctx.db.apps.findByPublicID(args.publicID)
          if (app == null) {
            app = await ctx.db.apps.createFromManifest(manifest)
          } else {
            const appVersion = await app.populate('latestAvailableVersion')
            if (
              appVersion == null ||
              semver.gt(manifest.version, appVersion.manifest.version)
            ) {
              await app.setLatestAvailableVersionFromManifest(manifest)
            }
          }

          const userAppVersion = await ctx.db.user_app_versions.findByAppAndUserID(
            app.localID,
            ctx.user.userID,
          )
          return { app, userAppVersion }
        } catch (error) {
          ctx.logger.log({
            level: 'warn',
            message: 'Lookup app by ID failed',
            args,
            error: error.toString(),
          })
          return null
        }
      },
    },
    peerByID: {
      type: peerLookupResult,
      args: {
        publicID: {
          type: new GraphQLNonNull(GraphQLID),
        },
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
          const data = await readPeer(payload)
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
