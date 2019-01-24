// @flow

import { GraphQLObjectType, GraphQLNonNull } from 'graphql'
import { map } from 'rxjs/operators'

import type ClientContext from '../context/ClientContext'

import { contact } from './objects'
import observableToAsyncIterator from './observableToAsyncIterator'

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

export default new GraphQLObjectType({
  name: 'Subscription',
  fields: () => ({
    contactChanged,
  }),
})
