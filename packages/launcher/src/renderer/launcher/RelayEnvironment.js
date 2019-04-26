// @flow

import { createContext, useContext } from 'react'
import { Environment, Network, RecordSource, Store } from 'relay-runtime'

import rpc from './rpc'

const fetchQuery = (operation: Object, variables: ?Object) => {
  return rpc.graphqlQuery(operation.text, variables)
}

const subscribeQuery = (operation: Object, variables: ?Object) => {
  return rpc.graphqlSubscribe(operation.text, variables)
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

export const useEnvironment = () => useContext(EnvironmentContext)
