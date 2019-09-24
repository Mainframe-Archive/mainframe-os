// @flow

import { Text } from '@morpheus-ui/core'
import React, { type ComponentType, type Element } from 'react'
import { View, StyleSheet } from 'react-native-web'
import {
  type GraphQLTaggedNode,
  QueryRenderer,
  type ReadyState,
} from 'react-relay'

import Loader from '../UIComponents/Loader'
import { useEnvironment } from './RelayEnvironment'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
})

type LoaderProps = {
  error?: ?string,
}

function LoaderView({ error }: LoaderProps) {
  const content = error ? <Text>{error}</Text> : <Loader />
  return <View style={styles.container}>{content}</View>
}

const createRender = (Container: ComponentType<*>) => {
  return function render({ error, props }: ReadyState) {
    return error || !props ? (
      <LoaderView error={error ? error.message : undefined} />
    ) : (
      <Container {...props} />
    )
  }
}

type Props = {
  Container?: ComponentType<*>,
  fetchPolicy?: 'network-only' | 'store-and-network',
  query: GraphQLTaggedNode,
  render?: ReadyState => ?Element<*>,
  variables?: ?Object,
}

export default function RelayRenderer({
  Container,
  fetchPolicy,
  query,
  render,
  variables,
}: Props) {
  const environment = useEnvironment()

  let renderFunc = render
  if (renderFunc == null) {
    if (Container == null) {
      throw new Error('Missing Container or render prop')
    } else {
      renderFunc = createRender(Container)
    }
  }

  return (
    <QueryRenderer
      environment={environment}
      fetchPolicy={fetchPolicy || 'store-and-network'}
      query={query}
      variables={variables || {}}
      render={renderFunc}
    />
  )
}
