// @flow

import { GraphQLNonNull, GraphQLObjectType } from 'graphql'

import { devtoolsField, lookup, nodeField, viewerField } from './objects'

export default new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    devtools: devtoolsField,
    lookup: {
      type: new GraphQLNonNull(lookup),
      resolve: () => ({}),
    },
    node: nodeField,
    viewer: viewerField,
  }),
})
