// @flow

import React, { Component } from 'react'
import { View, StyleSheet, Switch, ScrollView } from 'react-native-web'
import web3Utils from 'web3-utils'
import Web3EthAbi from 'web3-eth-abi'

import rpc from './rpc'
import colors from '../colors'
import Text from '../UIComponents/Text'
import Button from '../UIComponents/Button'
import globalStyles from '../styles'

type Props = {
  transaction: {
    from: string,
    to: string,
    value: number,
    data: string,
    nonce: number,
    gasPrice: string,
    gas: string,
  },
}

type State = {
  error?: ?string,
  wallets?: ?Object, // TODO define
  txInfo?: {
    params: Object,
    signature: string,
  },
}

const TRANSFER_SIG = 'a9059cbb'
const APPROVE_SIG = '095ea7b3'
const TRANSFER_FROM_SIG = '23b872dd'

const METHOD_LABELS = {
  [TRANSFER_SIG]: 'Transfer',
  [APPROVE_SIG]: 'Approve',
  [TRANSFER_FROM_SIG]: 'Transfer From',
}

const decodableERC20Methods = {
  [TRANSFER_SIG]: [
    // Transfer
    { type: 'address', name: 'to' },
    { type: 'uint256', name: 'amount' },
  ],
  [APPROVE_SIG]: [
    // Approve
    { type: 'address', name: 'spender' },
    { type: 'uint256', name: 'amount' },
  ],
  [TRANSFER_FROM_SIG]: [
    // transferFrom
    { type: 'address', name: 'from' },
    { type: 'address', name: 'to' },
    { type: 'uint256', name: 'amount' },
  ],
}

const truncateAddress = (address: string): string => {
  if (web3Utils.isAddress(address)) {
    const length = address.length
    const start = address.slice(0, 8)
    const end = address.slice(length - 5, length)
    return start + '...' + end
  }
  return address
}

const sendSig = '0xa9059cbb'

export default class WalletTxRequestView extends Component<Props, State> {
  state = {}

  componentDidMount() {
    this.getEthWallets()
    this.attemptToReadData()
  }
  componentDidUpdate(nextProps: Props) {
    if (nextProps !== this.props) {
      this.attemptToReadData()
    }
  }

  async getEthWallets() {
    const wallets = await rpc.getEthWallets()
    this.setState({ wallets })
  }

  async attemptToReadData() {
    const { transaction } = this.props
    const txData = transaction.data
    if (txData) {
      try {
        const methodSig = txData.slice(2, 10)
        const expectedParams = decodableERC20Methods[methodSig]
        if (expectedParams) {
          const paramsData = txData.slice(10, txData.length)
          const params = Web3EthAbi.decodeParameters(expectedParams, paramsData)
          const paramKeys = Object.keys(expectedParams).map(
            k => expectedParams[k].name,
          )
          const cleanedParams = {}
          Object.keys(params).forEach(k => {
            if (paramKeys.includes(k)) {
              cleanedParams[k] = params[k]
            }
          })
          if (params.amount) {
            params.amount = web3Utils.fromWei(params.amount) // TODO: Get token decimal
          }
          this.setState({
            txInfo: {
              signature: methodSig,
              params: cleanedParams,
            },
          })
        }
      } catch (err) {
        this.setState({ error: 'error decoding transaction data' })
      }
    }
  }

  renderTransactionInfo(from: string, to: string, data?: string) {
    return (
      <View style={styles.transactionInfo}>
        <Text style={styles.paramLabel}>
          <Text style={globalStyles.boldText}>From:</Text>{' '}
          {truncateAddress(from)}
        </Text>
        <Text style={styles.paramLabel}>
          <Text style={globalStyles.boldText}>To:</Text> {truncateAddress(to)}
        </Text>
        {this.renderGas()}
        {data ? (
          <View>
            <Text style={styles.paramLabel}>
              <Text style={globalStyles.boldText}>Data:</Text>
            </Text>
            <ScrollView style={styles.dataConatiner}>
              <Text style={styles.dataText}>{data}</Text>
            </ScrollView>
          </View>
        ) : null}
      </View>
    )
  }

  renderAmount(amount: string | number, ticker: string, method: string) {
    return (
      <View style={styles.amountContainer}>
        <Text style={styles.methodTypeLabel}>{method.toUpperCase()}</Text>
        <Text style={styles.amountLabel}>
          {amount} {ticker}
        </Text>
      </View>
    )
  }

  renderDetailed() {
    const { txInfo } = this.state
    const { transaction } = this.props
    // TODO Add alert if also sending eth
    // TODO Get ticker
    if (txInfo) {
      const value = txInfo.params.amount
        ? web3Utils.fromWei(txInfo.params.amount)
        : 0
      return (
        <View style={styles.container}>
          <Text style={styles.header}>Sign Transaction</Text>
          {this.renderAmount(value, 'MFT', METHOD_LABELS[txInfo.signature])}
          {this.renderTransactionInfo(transaction.from, txInfo.params.to)}
        </View>
      )
    }
  }

  renderBasic() {
    const { transaction } = this.props
    const valueString = web3Utils.hexToNumberString(transaction.value)
    const valueEther = transaction.value
      ? web3Utils.fromWei(valueString, 'ether')
      : 0
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Sign Transaction</Text>
        {this.renderAmount(valueEther, 'ETH', 'SEND')}
        {this.renderTransactionInfo(
          transaction.from,
          transaction.to,
          transaction.data,
        )}
      </View>
    )
  }

  renderGas() {
    const gasLimit = web3Utils.hexToNumberString(this.props.transaction.gas)
    const gasPrice = web3Utils.hexToNumberString(
      this.props.transaction.gasPrice,
    )
    const gasPriceGwei = web3Utils.fromWei(gasPrice, 'gwei')
    return (
      <View style={styles.gasInfo}>
        <Text style={[styles.paramLabel, styles.gasLabel]}>
          <Text style={globalStyles.boldText}>Gas limit:</Text> {gasLimit}{' '}
        </Text>
        <Text style={[styles.paramLabel, styles.gasLabel]}>
          <Text style={globalStyles.boldText}>Price:</Text> {gasPriceGwei} Gwei
        </Text>
      </View>
    )
  }

  render() {
    if (this.state.txInfo) {
      return this.renderDetailed()
    } else {
      return this.renderBasic()
    }
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  header: {
    fontWeight: 'bold',
    paddingBottom: 6,
    color: colors.GREY_DARK_48,
    fontSize: 16,
  },
  amountContainer: {
    textAlign: 'center',
    paddingVertical: 12,
    borderColor: colors.LIGHT_GREY_DE,
    borderWidth: 1,
    borderRadius: 5,
  },
  amountLabel: {
    fontSize: 28,
    color: colors.GREY_DARK_48,
  },
  methodTypeLabel: {
    color: colors.BRIGHT_BLUE,
    fontSize: 15,
  },
  addressLabel: {
    maxWidth: 100,
  },
  transactionInfo: {
    borderColor: colors.LIGHT_GREY_DE,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  paramLabel: {
    paddingVertical: 3,
    color: colors.GREY_MED_75,
  },
  gasInfo: {
    flexDirection: 'row',
    marginTop: 3,
  },
  gasLabel: {
    paddingRight: 10,
  },
  dataConatiner: {
    padding: 10,
    maxHeight: 80,
    backgroundColor: colors.LIGHT_GREY_EE,
    borderRadius: 5,
  },
  dataText: {
    fontSize: 12,
    color: colors.GREY_DARK_48,
  },
})
