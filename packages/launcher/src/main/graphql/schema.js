// @flow

import { GraphQLSchema } from 'graphql'

import mutation from './mutation'
import query from './query'
import subscription from './subscription'

export default new GraphQLSchema({ mutation, query, subscription })
