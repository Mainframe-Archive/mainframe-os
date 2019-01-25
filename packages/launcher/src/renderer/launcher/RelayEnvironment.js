// @flow

import { createContext } from 'react'
import { Environment, Network, RecordSource, Store } from 'relay-runtime'

import rpc from './rpc'

const fetchQuery = (operation: Object, variables: ?Object) => {
  return rpc.graphqlQuery(operation.text, variables)
}

const subscribeQuery = (operation: Object, variables: ?Object) => {
  return rpc.graphqlSubscription(operation.text, variables)
}

export const createEnvironment = () => {
  return new Environment({
    network: Network.create(fetchQuery, subscribeQuery),
    store: new Store(new RecordSource()),
  })
}

export const EnvironmentContext = createContext<Environment>(
  createEnvironment(),
)
