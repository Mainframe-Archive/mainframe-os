// @flow

import React, { Component } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native-web'
import web3Utils from 'web3-utils'
import Web3Contract from 'web3-eth-contract'
import {
  ABI,
  getERC20Data,
  decodeTransactionData,
  type ERC20DataResult,
  type DecodedTxResult,
} from '@mainframe/contract-utils'

import globalStyles from '../styles'
import Text from '../UIComponents/Text'
import colors from '../colors'
import { truncateAddress } from '../../utils'
import rpc from './rpc'
import renderRPCProvider from './RPCProvider'

Web3Contract.setProvider(renderRPCProvider)

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
  tokenInfo?: ERC20DataResult,
  txInfo?: DecodedTxResult,
}

export default class WalletTxRequestView extends Component<Props, State> {
  state = {}
  tokenContract: Web3Contract

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
    const wallets = await rpc.getUserEthWallets()
    this.setState({ wallets })
  }

  async attemptToReadData() {
    const { transaction } = this.props
    const txData = transaction.data
    if (txData) {
      try {
        const txInfo = await decodeTransactionData(txData)
        let tokenInfo
        if (txInfo.contractType === 'ERC20') {
          const contract = new Web3Contract(ABI.ERC20, transaction.to)
          tokenInfo = await getERC20Data(contract, transaction.from)
        }
        this.setState({
          tokenInfo,
          txInfo,
        })
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
    const { txInfo, tokenInfo } = this.state
    const { transaction } = this.props
    // TODO Add alert if also sending eth

    if (txInfo == null) {
      return null
    }

    const value = txInfo.params.amount
      ? web3Utils.fromWei(txInfo.params.amount)
      : 0
    const ticker = tokenInfo ? tokenInfo.symbol : 'Tokens'
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Sign Transaction</Text>
        {this.renderAmount(value, ticker, txInfo.signatureName)}
        {this.renderTransactionInfo(transaction.from, txInfo.params.to)}
      </View>
    )
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
    // TODO Display activity when attempting to decode
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
