// @flow
import React, { Component } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native-web'

import Text from '../UIComponents/Text'

type Props = {
  error?: string,
}

export default class RelayLoaderView extends Component<Props> {
  render() {
    const content = this.props.error ? (
      <Text>{this.props.error}</Text>
    ) : (
      <ActivityIndicator />
    )
    return <View style={styles.container}>{content}</View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
