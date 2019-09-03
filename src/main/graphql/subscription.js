// @flow

import { GraphQLObjectType, GraphQLNonNull } from 'graphql'
import { filter, flatMap, map } from 'rxjs/operators'

import type { GraphQLContext } from '../context/graphql'

import { appVersion, contact, systemUpdate, viewerField } from './objects'
import observableToAsyncIterator from './observableToAsyncIterator'

const appVersionPayload = new GraphQLObjectType({
  name: 'AppVersionPayload',
  fields: () => ({
    appVersion: {
      type: new GraphQLNonNull(appVersion),
    },
    viewer: viewerField,
  }),
})

const appVersionChanged = {
  type: new GraphQLNonNull(appVersionPayload),
  subscribe: (self, args, ctx: GraphQLContext) => {
    const observable = ctx.db.app_versions.update$.pipe(
      flatMap(event => ctx.getDoc('app_versions', event.data.doc)),
      filter(appVersion => appVersion != null),
      map(appVersion => ({ appVersionChanged: { appVersion, viewer: {} } })),
    )
    return observableToAsyncIterator(observable)
  },
}

const contactChangedPayload = new GraphQLObjectType({
  name: 'ContactChangedPayload',
  fields: () => ({
    contact: {
      type: new GraphQLNonNull(contact),
    },
    viewer: viewerField,
  }),
})

const contactChanged = {
  type: new GraphQLNonNull(contactChangedPayload),
  subscribe: async (self, args, ctx: GraphQLContext) => {
    const user = await ctx.getUser()
    const observable = ctx.db.contacts.update$.pipe(
      filter(event => user.contacts.includes(event.data.doc)),
      flatMap(event => ctx.getDoc('contacts', event.data.doc)),
      filter(contact => contact != null),
      map(contact => ({ contactChanged: { contact, viewer: {} } })),
    )
    return observableToAsyncIterator(observable)
  },
}

const contactsChanged = {
  type: new GraphQLNonNull(contactChangedPayload),
  subscribe: async (self, args, ctx: GraphQLContext) => {
    const user = await ctx.getUser()
    const observable = user.get$('contacts').pipe(
      map(() => ({
        contactsChanged: {
          viewer: {},
        },
      })),
    )
    return observableToAsyncIterator(observable)
  },
}

const systemUpdateChangedPayload = new GraphQLObjectType({
  name: 'SystemUpdateChangedPayload',
  fields: () => ({
    systemUpdate: {
      type: new GraphQLNonNull(systemUpdate),
    },
  }),
})

const systemUpdateChanged = {
  type: new GraphQLNonNull(systemUpdateChangedPayload),
  subscribe: (self, args, ctx: GraphQLContext) => {
    const observable = ctx.system.updater.pipe(
      map(systemUpdate => ({ systemUpdateChanged: { systemUpdate } })),
    )
    return observableToAsyncIterator(observable)
  },
}

export default new GraphQLObjectType({
  name: 'Subscription',
  fields: () => ({
    appVersionChanged,
    contactChanged,
    contactsChanged,
    systemUpdateChanged,
  }),
})
