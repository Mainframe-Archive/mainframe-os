// @flow

import React, { Component } from 'react'
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native-web'

import applyContext, { type ContextProps } from './Context'
import colors from '../colors'

type State = {
  ethBalance: number,
  account?: string,
  error?: string,
}

class WalletInfo extends Component<ContextProps, State> {
  state: State = {
    ethBalance: 0,
  }
  componentDidMount() {
    this.fetchState()
    this.props.sdk.ethereum.on('accountsChanged', accounts => {
      console.log('accounts changed: ', accounts)
      this.fetchState()
    })
    // this.props.sdk.ethereum.on('networkChanged', () => {
    //   this.fetchState()
    // })
  }

  async fetchState() {
    const { web3 } = this.props
    if (web3) {
      try {
        const accounts = await web3.eth.getAccounts()
        if (accounts.length) {
          const account = accounts[0]
          const weiBalance = await web3.eth.getBalance(account)
          const ethBalance = web3.utils.fromWei(weiBalance)
          this.setState({
            account,
            ethBalance,
          })
        }
      } catch (err) {
        console.log('err: ', err)
      }
    }
  }

  render() {
    const { ethBalance, account, error } = this.state
    let content
    if (error) {
      content = <Text>Error loading balance</Text>
    } else if (!ethBalance) {
      content = <ActivityIndicator />
    } else {
      content = (
        <View style={styles.container}>
          <Text style={styles.address}>{account}</Text>
          <Text style={styles.balance}>
            {parseFloat(ethBalance).toFixed(8)} ETH
          </Text>
        </View>
      )
    }
    return <View style={styles.container}>{content}</View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  balance: {
    fontSize: 35,
    color: colors.BLUE,
    paddingVertical: 20,
  },
  address: {
    fontSize: 11,
    color: '#555555',
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
  },
})

export default applyContext(WalletInfo)
