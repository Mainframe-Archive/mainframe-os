// @flow

import { GraphQLObjectType, GraphQLNonNull } from 'graphql'
import { map } from 'rxjs/operators'

import type ClientContext from '../context/ClientContext'

import { contact, viewer } from './objects'
import observableToAsyncIterator from './observableToAsyncIterator'

const contactsChangedPayload = new GraphQLObjectType({
  name: 'ContactsChangedPayload',
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
  type: new GraphQLNonNull(contact),
  subscribe: (self, args, ctx: ClientContext) => {
    const { source, dispose } = ctx.contactsFeeds.observe()
    const contactChanged = source.pipe(
      map(e => ({ contactChanged: e.contact })),
    )
    return observableToAsyncIterator(contactChanged, dispose)
  },
}

const contactsChanged = {
  type: new GraphQLNonNull(contactsChangedPayload),
  subscribe: (self, args, ctx: ClientContext) => {
    const { source, dispose } = ctx.invitesHandler.observe()
    const contactsChanged = source.pipe(
      map(e => ({ contactsChanged: { contact: e.contact, viewer: {} } })),
    )
    return observableToAsyncIterator(contactsChanged, dispose)
  },
}

export default new GraphQLObjectType({
  name: 'Subscription',
  fields: () => ({
    contactChanged,
    contactsChanged,
  }),
})
