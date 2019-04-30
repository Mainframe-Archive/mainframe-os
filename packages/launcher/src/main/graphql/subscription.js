// @flow

import { GraphQLObjectType, GraphQLNonNull } from 'graphql'
import { map } from 'rxjs/operators'

import type ClientContext from '../context/ClientContext'

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
      resolve: (self, args, ctx) => {
        return ctx.queries.mergePeerContactData(self.contact)
      },
    },
    viewer: viewerField,
  }),
})

const contactChanged = {
  type: new GraphQLNonNull(contactChangedPayload),
  subscribe: (self, args, ctx: ClientContext) => {
    const { source, dispose } = ctx.contactsFeeds.observe()
    const observable = source.pipe(
      map(e => ({
        contactChanged: {
          contact: e.contact,
          viewer: {},
        },
      })),
    )
    return observableToAsyncIterator(observable, dispose)
  },
}

const contactsChanged = {
  type: new GraphQLNonNull(contactChangedPayload),
  subscribe: (self, args, ctx: ClientContext) => {
    const { source, dispose } = ctx.invitesHandler.observe()
    const contactsChanged = source.pipe(
      map(() => ({
        contactsChanged: {
          viewer: {},
        },
      })),
    )
    return observableToAsyncIterator(contactsChanged, dispose)
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
