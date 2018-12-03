// @flow

import { createContext } from 'react'
import { Environment, Network, RecordSource, Store } from 'relay-runtime'

import rpc from './rpc'

const fetchQuery = (operation: Object, variables: ?Object) => {
  return rpc.graphql(operation.text, variables)
}

export const createEnvironment = () => {
  return new Environment({
    network: Network.create(fetchQuery),
    store: new Store(new RecordSource()),
  })
}

export const EnvironmentContext = createContext<Environment>(
  createEnvironment(),
)
