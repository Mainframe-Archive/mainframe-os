// @flow

import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native-web'

import WalletInfo from './WalletInfo'
import SendFunds from './SendFunds'
import applyContext from './Context'

class Payments extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <WalletInfo />
          <SendFunds />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  innerContainer: {
    padding: 20,
    width: 500,
  },
})

export default applyContext(Payments)
