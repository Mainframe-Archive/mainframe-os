// @flow

import { idType } from '@mainframe/utils-id'
import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
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
import type RequestContext from '../rpc/RequestContext'

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId: string, ctx: RequestContext) => {
    const { type, id } = fromGlobalId(globalId)
    const typedID = idType(id)

    switch (type) {
      case 'App':
        return ctx.openVault.apps.getByID(typedID)
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

const appPermissionGrants = new GraphQLObjectType({
  name: 'AppPermissions',
  fields: () => ({
    BLOCKCHAIN_SEND: { type: GraphQLBoolean },
    WEB_REQUEST: { type: new GraphQLList(GraphQLString) },
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
    id: globalIdField(),
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
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: globalIdField(),
    WEB_REQUEST: {
      type: new GraphQLList(GraphQLString),
    },
    BLOCKCHAIN_SEND: {
      type: GraphQLBoolean,
    },
  }),
})

const appRequestedPermissions = new GraphQLObjectType({
  name: 'AppRequestedPermissions',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: globalIdField(),
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

const appManifestData = new GraphQLObjectType({
  name: 'AppManifestData',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: globalIdField(),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: self => self.name,
    },
    version: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: self => self.version,
    },
    permissions: {
      type: new GraphQLNonNull(appRequestedPermissions),
      resolve: self => self.permissions,
    },
  }),
})

const appVersionData = new GraphQLObjectType({
  name: 'AppVersionData',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: globalIdField(),
    version: {
      type: new GraphQLNonNull(GraphQLString),
    },
    permissions: {
      type: new GraphQLNonNull(appRequestedPermissions),
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
    appID: {
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
    appID: {
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

const ownAppIdentityType = new GraphQLObjectType({
  name: 'OwnAppIdentity',
  interfaces: () => [nodeInterface],
  fields: () => ({
    id: globalIdField(),
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
    id: globalIdField(),
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
    id: globalIdField(),
    localID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: self => self.localID,
    },
    mfid: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: self => self.id,
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
    id: globalIdField(),
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
    id: globalIdField(),
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
    id: globalIdField(),
    localID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: self => self.id,
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

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    apps: {
      type: new GraphQLNonNull(appsQueryType),
      resolve: () => ({}),
    },
    identities: {
      type: new GraphQLNonNull(identitiesQueryType),
      resolve: () => ({}),
    },
  }),
})

export default new GraphQLSchema({
  query: queryType,
})
