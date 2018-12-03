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
import type Vault from '../vault/Vault'

type GetVaultFunc = () => Vault

export const createSchema = (getVault: GetVaultFunc): GraphQLSchema => {
  const { nodeInterface, nodeField } = nodeDefinitions(
    globalId => {
      const vault = getVault()
      const { type, id } = fromGlobalId(globalId)
      const typedID = idType(id)

      switch (type) {
        case 'App':
          return vault.apps.getByID(typedID)
        case 'OwnApp':
          return vault.apps.getOwnByID(typedID)
        case 'OwnAppIdentity':
          return vault.identities.getOwnApp(typedID)
        case 'OwnDeveloperIdentity':
          return vault.identities.getOwnDeveloper(typedID)
        case 'OwnUserIdentity':
          return vault.identities.getOwnUser(typedID)
        case 'PeerAppIdentity':
          return vault.identities.getPeerApp(typedID)
        case 'PeerDeveloperIdentity':
          return vault.identities.getPeerDeveloper(typedID)
        case 'PeerUserIdentity':
          return vault.identities.getPeerUser(typedID)
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
      checked: {
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
      permissions: {
        type: new GraphQLNonNull(appPermissionSettings),
        resolve: self => self.permissionsSettings,
      },
    }),
  })

  const appUser = new GraphQLObjectType({
    name: 'AppUser',
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLID),
      },
      identity: {
        type: new GraphQLNonNull(ownUserIdentityType),
        resolve: self => getVault().identities.getOwnUser(self.id),
      },
      settings: {
        type: new GraphQLNonNull(appUserSettings),
      },
    }),
  })

  const appType = new GraphQLObjectType({
    name: 'App',
    interfaces: () => [nodeInterface],
    fields: () => ({
      id: globalIdField(),
      localId: {
        type: new GraphQLNonNull(GraphQLID),
        resolve: self => self.id,
      },
      users: {
        type: new GraphQLList(appUser),
        resolve: ({ settings }) => {
          return Object.keys(settings).map(id => ({
            localId: id,
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
      localId: {
        type: new GraphQLNonNull(GraphQLID),
        resolve: self => self.id,
      },
    }),
  })

  const ownAppIdentityType = new GraphQLObjectType({
    name: 'OwnAppIdentity',
    interfaces: () => [nodeInterface],
    fields: () => ({
      id: globalIdField(),
      localId: {
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
      localId: {
        type: new GraphQLNonNull(GraphQLID),
        resolve: self => self.id,
      },
      pubKey: {
        type: new GraphQLNonNull(GraphQLString),
      },
    }),
  })

  const ownUserIdentityType = new GraphQLObjectType({
    name: 'OwnUserIdentity',
    interfaces: () => [nodeInterface],
    fields: () => ({
      id: globalIdField(),
      localId: {
        type: new GraphQLNonNull(GraphQLID),
        resolve: self => self.id,
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
      localId: {
        type: new GraphQLNonNull(GraphQLID),
        resolve: self => self.id,
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
      localId: {
        type: new GraphQLNonNull(GraphQLID),
        resolve: self => self.id,
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
      localId: {
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
        resolve: () => Object.values(getVault().apps.apps),
      },
      own: {
        type: new GraphQLList(ownAppType),
        resolve: () => Object.values(getVault().apps.ownApps),
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
    }),
  })

  return new GraphQLSchema({
    query: queryType,
  })
}
