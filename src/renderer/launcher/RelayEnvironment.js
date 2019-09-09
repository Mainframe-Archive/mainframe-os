// @flow

import { createContext, useContext, useEffect } from 'react'
import {
  Environment,
  type GraphQLTaggedNode,
  Network,
  RecordSource,
  Store,
  requestSubscription,
} from 'relay-runtime'

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

export const useSubscription = (
  subscription: GraphQLTaggedNode,
  onNext?: (data: Object) => void,
) => {
  const env = useEnvironment()

  useEffect(() => {
    const sub = requestSubscription(env, { subscription, onNext })
    return () => {
      sub.dispose()
    }
  }, [])
}
