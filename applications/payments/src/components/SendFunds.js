// @flow

import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native-web'

import applyContext, { type ContextProps } from './Context'
import { ABI } from '@mainframe/contract-utils'

type State = {
  recipient: string,
  tokenAddress: string,
  amount: string,
  data: string,
  errorMsg?: ?string,
  txReceipt?: ?string,
  processingTransaction?: ?boolean,
  sendType: 'tokens' | 'ether',
}

class SendFunds extends Component<ContextProps, State> {
  state = {
    recipient: '',
    amount: '',
    data: '',
    tokenAddress: '',
    sendType: 'ether',
  }

  // HANDLERS

  onChangeRecipient = (value: string) => {
    // TODO fetch balance when not ether
    this.setState({
      recipient: value,
    })
  }

  onChangeAmount = (value: string) => {
    this.setState({
      amount: value,
    })
  }

  onChangeTokenAddress = (value: string) => {
    this.setState({
      tokenAddress: value,
    })
  }

  onChangeData = (value: string) => {
    this.setState({
      data: value,
    })
  }

  onPressShowEthSend = () => {
    this.setState({
      sendType: 'ether',
    })
  }

  onPressShowTokenSend = () => {
    this.setState({
      sendType: 'tokens',
    })
  }

  onFocusRecipient = () => {
    this.selectContacts()
  }

  async selectContacts() {
    try {
      const { contacts } = await this.props.sdk.contacts.selectContacts({
        multi: true,
      })
      if (contacts.length && contacts[0].data.profile.ethAddress) {
        this.setState({
          recipient: contacts[0].data.profile.ethAddress,
        })
      }
    } catch (err) {
      console.log('select contacts err: ', err)
    }
  }

  validateSend(): boolean {
    const { web3 } = this.props
    if (!web3.utils.isAddress(this.state.recipient)) {
      this.setState({ errorMsg: 'Please provide a valid recipent address' })
      return false
    }
    if (!this.state.amount) {
      this.setState({ errorMsg: 'Please provide a send amount' })
      return false
    }
    return true
  }

  validateSendTokens() {
    const { web3 } = this.props
    if (this.validateSend()) {
      if (!web3.utils.isAddress(this.state.tokenAddress)) {
        this.setState({ errorMsg: 'Please provide a valid token address' })
        return false
      }
    }
    return true
  }

  onPressSendToken = async () => {
    const { web3 } = this.props
    if (!this.validateSend()) {
      return
    }
    const tokenContract = new web3.eth.Contract(
      ABI.ERC20,
      this.state.tokenAddress,
    )
    const accounts = await web3.eth.getAccounts()
    // TODO: fetch decimal
    const amount = web3.utils.toWei(this.state.amount)
    try {
      this.sendTransaction(() => {
        return tokenContract.methods
          .transfer(this.state.recipient, amount)
          .send({
            from: accounts[0],
          })
      })
    } catch (err) {
      this.setState({
        processingTransaction: false,
        errorMsg: err.message || 'Error processing transaction',
      })
    }
  }

  onPressSendEth = async () => {
    const { web3 } = this.props
    const accounts = await web3.eth.getAccounts()
    const amount = web3.utils.toWei(this.state.amount || '0')

    try {
      this.sendTransaction(() => {
        return this.props.web3.eth.sendTransaction({
          data: this.state.data,
          to: this.state.recipient,
          from: accounts[0],
          value: amount,
        })
      })
    } catch (err) {
      this.setState({
        processingTransaction: false,
        errorMsg: err.message || 'Error processing transaction',
      })
    }
  }

  sendTransaction = txFunc => {
    this.setState({
      processingTransaction: true,
      txReceipt: undefined,
      errorMsg: undefined,
    })
    txFunc()
      .on('error', err => {
        console.warn(err)
        this.setState({
          processingTransaction: false,
          errorMsg: err.message || 'Error processing transaction',
        })
      })
      .on('receipt', receipt => {
        console.log(receipt)
        this.setState({
          processingTransaction: false,
          txReceipt: receipt.transactionHash,
        })
      })
  }

  // RENDER

  renderTokenSend() {
    return (
      <View>
        <TextInput
          placeholder="Token address"
          style={styles.textInput}
          onChangeText={this.onChangeTokenAddress}
          value={this.state.tokenAddress}
        />
        <TextInput
          placeholder="Recipient address"
          style={styles.textInput}
          onChangeText={this.onChangeRecipient}
          value={this.state.recipient}
          onFocus={this.onFocusRecipient}
        />
        <TextInput
          placeholder="Amount"
          style={styles.textInput}
          onChangeText={this.onChangeAmount}
          value={this.state.amount}
        />
      </View>
    )
  }

  renderEthSend() {
    return (
      <View>
        <TextInput
          placeholder="Recipient address"
          style={styles.textInput}
          onChangeText={this.onChangeRecipient}
          value={this.state.recipient}
          onFocus={this.onFocusRecipient}
        />
        <TextInput
          placeholder="Amount"
          style={styles.textInput}
          onChangeText={this.onChangeAmount}
          value={this.state.amount}
        />
        <TextInput
          multiline
          placeholder="Data"
          style={[styles.textInput, styles.dataInput]}
          onChangeText={this.onChangeData}
          value={this.state.data}
        />
      </View>
    )
  }

  renderTabs() {
    const ethStyles = [styles.tab]
    const tokenStyles = [styles.tab]
    if (this.state.sendType === 'ether') {
      ethStyles.push(styles.tabSelected)
    } else {
      tokenStyles.push(styles.tabSelected)
    }

    return (
      <View style={styles.tabs}>
        <TouchableOpacity onPress={this.onPressShowEthSend} style={ethStyles}>
          <Text style={styles.tabLabel}>ETHER</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.onPressShowTokenSend}
          style={tokenStyles}>
          <Text style={styles.tabLabel}>TOKENS</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderResult() {
    if (this.state.txReceipt) {
      return (
        <View style={[styles.feedbackContainer, styles.receiptContainer]}>
          <Text>{this.state.txReceipt}</Text>
        </View>
      )
    }
  }

  renderError() {
    if (this.state.errorMsg) {
      return (
        <View style={[styles.feedbackContainer, styles.errorContainer]}>
          <Text>{this.state.errorMsg}</Text>
        </View>
      )
    }
  }

  render() {
    const content =
      this.state.sendType === 'ether'
        ? this.renderEthSend()
        : this.renderTokenSend()

    const onPress =
      this.state.sendType === 'ether'
        ? this.onPressSendEth
        : this.onPressSendToken

    const button = this.state.processingTransaction ? (
      <ActivityIndicator />
    ) : (
      <Button title="Send" onPress={onPress} />
    )
    return (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          {this.renderTabs()}
          {this.renderResult()}
          {this.renderError()}
          {content}
          {button}
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
  textInput: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  tabs: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    borderBottomWidth: 2,
    color: '#999999',
    borderColor: '#dddddd',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tabSelected: {
    color: '#4896EC',
    borderColor: '#4896EC',
  },
  tabLabel: {
    fontSize: 16,
    letterSpacing: 2,
  },
  dataInput: {
    height: 75,
  },
  feedbackContainer: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 3,
  },
  receiptLabel: {
    fontSize: 12,
  },
  receiptContainer: {
    color: '#535748',
    backgroundColor: '#e6f2bf',
    borderColor: '#d3e2a7',
  },
  errorContainer: {
    color: '#473f3e',
    backgroundColor: '#f7d7d7',
    borderColor: '#e5bebe',
  },
})

export default applyContext(SendFunds)
