// @flow

import {
  GRAPHQL_QUERY_SCHEMA,
  type GraphQLQueryParams,
  type GraphQLQueryResult,
} from '@mainframe/client'
import { graphql } from 'graphql'

import schema from '../../graphql/schema'

import type RequestContext from '../RequestContext'

export const query = {
  params: GRAPHQL_QUERY_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: GraphQLQueryParams,
  ): Promise<GraphQLQueryResult> => {
    return graphql(schema, params.query, {}, ctx, params.variables)
  },
}
