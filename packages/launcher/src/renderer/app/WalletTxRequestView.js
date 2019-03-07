// @flow

import React, { Component } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native-web'
import { hexToNumberString, fromWei } from 'web3-utils'
import {
  decodeTransactionData,
  type DecodedTxResult,
  type EthClient,
} from '@mainframe/eth'

import globalStyles from '../styles'
import Text from '../UIComponents/Text'
import colors from '../colors'
import { truncateAddress } from '../../utils'
import rpc from './rpc'

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
  ethClient: EthClient,
}

type State = {
  error?: ?string,
  wallets?: ?Object, // TODO define
  tokenInfo?: {
    symbol: string,
    decimalsUnit: string,
  },
  txInfo?: DecodedTxResult,
}

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
    const wallets = await rpc.getUserEthWallets()
    this.setState({ wallets })
  }

  async attemptToReadData() {
    const { transaction, ethClient } = this.props
    const txData = transaction.data
    if (txData) {
      try {
        const txInfo = await decodeTransactionData(txData)
        let tokenInfo

        if (txInfo.contractType === 'ERC20') {
          const symbol = await ethClient.getTokenTicker(transaction.to)
          const decimalsUnit = await ethClient.getTokenDecimalsUnit(
            transaction.to,
          )
          tokenInfo = {
            decimalsUnit,
            symbol,
          }
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

    if (txInfo == null || !tokenInfo) {
      return null
    }

    const value =
      txInfo.params.amount && tokenInfo.decimalsUnit
        ? fromWei(txInfo.params.amount, tokenInfo.decimalsUnit)
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
    const valueString = hexToNumberString(transaction.value)
    const valueEther = transaction.value ? fromWei(valueString, 'ether') : 0
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
    const gasLimit = hexToNumberString(this.props.transaction.gas)
    const gasPrice = hexToNumberString(this.props.transaction.gasPrice)
    const gasPriceGwei = fromWei(gasPrice, 'gwei')
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
  amountContainer: {
    borderColor: colors.GREY_DARK_48,
    borderRadius: 5,
    borderWidth: 1,
    paddingVertical: 12,
    textAlign: 'center',
  },
  amountLabel: {
    color: colors.LIGHT_GREY_AE,
    fontSize: 28,
  },
  container: {
    padding: 8,
  },
  dataConatiner: {
    backgroundColor: colors.GREY_DARK_48,
    borderRadius: 5,
    maxHeight: 80,
    padding: 10,
  },
  dataText: {
    color: colors.LIGHT_GREY_AE,
    fontSize: 12,
  },
  gasInfo: {
    flexDirection: 'row',
    marginTop: 3,
  },
  gasLabel: {
    paddingRight: 10,
  },
  header: {
    color: colors.LIGHT_GREY_DE,
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 6,
  },
  methodTypeLabel: {
    color: colors.BRIGHT_BLUE,
    fontSize: 15,
  },
  paramLabel: {
    color: colors.LIGHT_GREY_AE,
    paddingVertical: 3,
  },
  transactionInfo: {
    borderBottomWidth: 1,
    borderColor: colors.GREY_DARK_48,
    paddingVertical: 10,
  },
})
