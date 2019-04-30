// @flow

import { GraphQLObjectType, GraphQLSchema } from 'graphql'

import mutation from './mutation'
import { nodeField, viewerField } from './objects'
import subscription from './subscription'

const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    viewer: viewerField,
    // peers: {
    //   type: new GraphQLNonNull(peers),
    //   resolve: () => ({}),
    // },
  }),
})

export default new GraphQLSchema({ mutation, query, subscription })
