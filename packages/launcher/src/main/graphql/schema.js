// @flow

import { GraphQLObjectType, GraphQLNonNull, GraphQLSchema } from 'graphql'

import mutation from './mutation'
import { nodeField, user } from './objects'
import subscription from './subscription'

const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    viewer: {
      type: new GraphQLNonNull(user),
      resolve: (self, args, ctx) => ctx.getUser(),
    },
    // peers: {
    //   type: new GraphQLNonNull(peers),
    //   resolve: () => ({}),
    // },
  }),
})

export default new GraphQLSchema({ mutation, query, subscription })
