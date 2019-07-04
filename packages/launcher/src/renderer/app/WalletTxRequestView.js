// @flow

import React, { Component } from 'react'
import { hexToNumberString, fromWei } from 'web3-utils'
import { decodeTransactionData, type DecodedTxResult } from '@mainframe/eth'

import styled from 'styled-components/native'
import { Text } from '@morpheus-ui/core'

import rpc, { getEthClient } from './rpc'

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
  tokenInfo?: {
    symbol: string,
    decimalsUnit: string,
  },
  txInfo?: DecodedTxResult,
}

const Container = styled.View`
  padding: 8px;
`

const AmountContainer = styled.View`
  background-color: #585858;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  padding: 20px;
`

const ParamLabel = styled.View`
  padding-vertical: 3px;
  flex-direction: row;
  justify-content: space-between;
`

const DataContainer = styled.ScrollView`
  flex: 1;
  padding: 10px;
  max-height: 80px;
`

const TransactionInfo = styled.View`
  margin: 20px 0;
`

const GasInfo = styled.View`
  border-color: #979797;
  border-top-width: 1px;
  flex-direction: row;
  padding-top: 20px;
  justify-content: space-between;
`

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
    const { transaction } = this.props
    const txData = transaction.data
    if (txData) {
      try {
        const txInfo = await decodeTransactionData(txData)
        let tokenInfo

        if (txInfo.contractType === 'ERC20') {
          const contract = getEthClient().erc20Contract(transaction.to)
          const [symbol, decimalsUnit] = await Promise.all([
            contract.getTicker(),
            contract.getTokenDecimalsUnit(),
          ])
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
      <>
        <TransactionInfo>
          <ParamLabel>
            <Text color="#9A9A9A" size={10}>
              From
            </Text>
            <Text variant="mono" color="#F9F9F9" size={10}>
              {from}
            </Text>
          </ParamLabel>
          <ParamLabel>
            <Text color="#9A9A9A" size={10}>
              To
            </Text>
            <Text variant="mono" color="#F9F9F9" size={10}>
              {to}
            </Text>
          </ParamLabel>
        </TransactionInfo>
        {this.renderGas()}
        {data ? (
          <ParamLabel>
            <Text color="#9A9A9A" size={10}>
              Data
            </Text>
            <DataContainer>
              <Text color="#F9F9F9" size={10}>
                {data}
              </Text>
            </DataContainer>
          </ParamLabel>
        ) : null}
      </>
    )
  }

  renderAmount(amount: string | number, ticker: string, method: string) {
    return (
      <AmountContainer>
        <Text
          color="white"
          variant={['smallTitle', 'padding0', 'marginBottom10']}>
          {method.toUpperCase()}
        </Text>
        <Text size={24} color="#F9F9F9">
          {amount} {ticker}
        </Text>
      </AmountContainer>
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
      <Container>
        {this.renderAmount(value, ticker, txInfo.signatureName)}
        {this.renderTransactionInfo(transaction.from, txInfo.params.to)}
      </Container>
    )
  }

  renderBasic() {
    const { transaction } = this.props
    const valueString = hexToNumberString(transaction.value)
    const valueEther = transaction.value ? fromWei(valueString, 'ether') : 0
    return (
      <Container>
        {this.renderAmount(valueEther, 'ETH', 'SEND')}
        {this.renderTransactionInfo(
          transaction.from,
          transaction.to,
          transaction.data,
        )}
      </Container>
    )
  }

  renderGas() {
    const gasLimit = hexToNumberString(this.props.transaction.gas)
    const gasPrice = hexToNumberString(this.props.transaction.gasPrice)
    const gasPriceGwei = fromWei(gasPrice, 'gwei')
    return (
      <GasInfo>
        <ParamLabel>
          <Text color="#9A9A9A" size={10}>
            Gas limit{'   '}
          </Text>
          <Text variant="mono" color="#F9F9F9" size={10}>
            {gasLimit}
          </Text>
        </ParamLabel>
        <ParamLabel>
          <Text color="#9A9A9A" size={10}>
            Price{'   '}
          </Text>
          <Text variant="mono" color="#F9F9F9" size={10}>
            {gasPriceGwei} Gwei
          </Text>
        </ParamLabel>
      </GasInfo>
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
