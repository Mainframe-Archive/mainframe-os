// @flow

import { GraphQLObjectType } from 'graphql'

import {
  devtoolsField,
  lookupField,
  nodeField,
  systemUpdateField,
  viewerField,
} from './objects'

export default new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    devtools: devtoolsField,
    lookup: lookupField,
    node: nodeField,
    systemUpdate: systemUpdateField,
    viewer: viewerField,
  }),
})
