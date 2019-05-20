// @flow

import { GraphQLObjectType, GraphQLNonNull } from 'graphql'
import { filter, flatMap, map } from 'rxjs/operators'

import type { GraphQLContext } from '../context/graphql'

import { app, contact, viewerField } from './objects'
import observableToAsyncIterator from './observableToAsyncIterator'

const appUpdatePayload = new GraphQLObjectType({
  name: 'AppUpdatePayload',
  fields: () => ({
    app: {
      type: new GraphQLNonNull(app),
    },
    viewer: viewerField,
  }),
})

const appUpdateChanged = {
  type: new GraphQLNonNull(appUpdatePayload),
  subscribe: (self, args, ctx: ClientContext) => {
    const { source, dispose } = ctx.appsUpdates.observe()
    const observable = source.pipe(
      map(e => ({ appUpdateChanged: { app: e.app, viewer: {} } })),
    )
    return observableToAsyncIterator(observable, dispose)
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
      flatMap(async contact => ({
        contactChanged: {
          contact: await contact.getInfo(),
          viewer: {},
        },
      })),
    )
    return observableToAsyncIterator(observable)
  },
}

const contactsChanged = {
  type: new GraphQLNonNull(contactChangedPayload),
  subscribe: async (self, args, ctx: GraphQLContext) => {
    const user = await ctx.getUser()
    const observable = user.contacts$.pipe(
      map(() => ({
        contactsChanged: {
          viewer: {},
        },
      })),
    )
    return observableToAsyncIterator(observable)
  },
}

export default new GraphQLObjectType({
  name: 'Subscription',
  fields: () => ({
    appUpdateChanged,
    contactChanged,
    contactsChanged,
  }),
})
