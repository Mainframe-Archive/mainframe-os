// @flow

import { GraphQLObjectType, GraphQLNonNull } from 'graphql'
import { map } from 'rxjs/operators'

import type ClientContext from '../context/ClientContext'

import { app, contact, viewer } from './objects'
import observableToAsyncIterator from './observableToAsyncIterator'

const appUpdatePayload = new GraphQLObjectType({
  name: 'AppUpdatePayload',
  fields: () => ({
    app: {
      type: new GraphQLNonNull(app),
    },
    viewer: {
      type: new GraphQLNonNull(viewer),
    },
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
    viewer: {
      type: new GraphQLNonNull(viewer),
    },
  }),
})

const contactChanged = {
  type: new GraphQLNonNull(contactChangedPayload),
  subscribe: (self, args, ctx: ClientContext) => {
    const { source, dispose } = ctx.contactsFeeds.observe()
    const observable = source.pipe(
      map(e => ({ contactChanged: { contact: e.contact, viewer: {} } })),
    )
    return observableToAsyncIterator(observable, dispose)
  },
}

export default new GraphQLObjectType({
  name: 'Subscription',
  fields: () => ({
    appUpdateChanged,
    contactChanged,
  }),
})
