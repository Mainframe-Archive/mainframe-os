// @flow
import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native-web'

import { Text } from '@morpheus-ui/core'
import Loader from '../UIComponents/Loader'

type Props = {
  error?: string,
}

export default class RelayLoaderView extends Component<Props> {
  render() {
    const content = this.props.error ? (
      <Text>{this.props.error}</Text>
    ) : (
      <Loader />
    )
    return <View style={styles.container}>{content}</View>
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
})
