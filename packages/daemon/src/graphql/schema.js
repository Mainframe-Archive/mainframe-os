// @flow

import { GraphQLObjectType, GraphQLNonNull, GraphQLSchema } from 'graphql'

import mutation from './mutation'
import { nodeField, peers, viewer } from './objects'
import subscription from './subscription'

const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    viewer: {
      type: new GraphQLNonNull(viewer),
      resolve: () => ({}),
    },
    peers: {
      type: new GraphQLNonNull(peers),
      resolve: () => ({}),
    },
  }),
})

export default new GraphQLSchema({ mutation, query, subscription })
