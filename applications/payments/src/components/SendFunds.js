// @flow

import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native-web'

import applyContext, { type ContextProps } from './Context'
import tokenABI from '../abi/ERC20'

type State = {
  recipient: string,
  tokenAddress: string,
  amount: string,
  data: string,
  errorMsg?: ?string,
  sendType: 'tokens' | 'ether',
}

class SendFunds extends Component<ContextProps, State> {
  state = {
    recipient: '0x20Aa9b43C0bfb9c10326BdB707ab4E7f765a4706',
    amount: '',
    data:
      '0x264762040000000000000000000000002343e938363c59c82b6fbabda2a2c40f00c92fb7',
    // tokenAddress: '0xA46f1563984209fe47f8236f8B01a03f03F957E4', // TODO change to empty string
    tokenAddress: '0x6E6Bda8B1ec708Bd4Ce4f000B464557657988806', // Stake
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
    // const mfTokenAddr = '0xA46f1563984209fe47f8236f8B01a03f03F957E4'
    const tokenContract = new web3.eth.Contract(
      tokenABI,
      this.state.tokenAddress,
    )
    const accounts = await web3.eth.getAccounts()
    // TODO: fetch decimal
    const amount = web3.utils.toWei(this.state.amount)
    try {
      tokenContract.methods
        .transfer(this.state.recipient, amount)
        .send({
          from: accounts[0],
        })
        .on('error', err => {
          console.log(err)
        })
        .on('receipt', receipt => {
          console.log(receipt)
        })
    } catch (err) {
      console.log('err send: ', err)
    }
  }

  onPressSendEth = async () => {
    const { web3 } = this.props
    const accounts = await web3.eth.getAccounts()
    const amount = web3.utils.toWei(this.state.amount || '0')
    try {
      this.props.web3.eth
        .sendTransaction({
          data: this.state.data,
          to: this.state.recipient,
          from: accounts[0],
          value: amount,
        })
        .on('error', err => {
          console.log(err)
        })
        .on('receipt', receipt => {
          console.log(receipt)
        })
    } catch (err) {
      console.log('err send eth: ', err)
    }
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
        />
        <TextInput
          placeholder="Amount"
          style={styles.textInput}
          onChangeText={this.onChangeAmount}
          value={this.state.amount}
        />
        <Button title="Send" onPress={this.onPressSendToken} />
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
        <Button title="Send" onPress={this.onPressSendEth} />
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

  render() {
    const content =
      this.state.sendType === 'ether'
        ? this.renderEthSend()
        : this.renderTokenSend()
    return (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          {this.renderTabs()}
          {content}
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
})

export default applyContext(SendFunds)
