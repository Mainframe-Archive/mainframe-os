// @flow

import {
  GRAPHQL_QUERY_SCHEMA,
  type GraphQLQueryParams,
  type GraphQLQueryResult,
} from '@mainframe/client'
import { graphql } from 'graphql'

import type RequestContext from '../RequestContext'

export const query = {
  params: GRAPHQL_QUERY_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: GraphQLQueryParams,
  ): Promise<GraphQLQueryResult> => graphql(ctx.schema, params.query),
}
