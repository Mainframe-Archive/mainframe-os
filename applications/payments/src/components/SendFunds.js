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
import { isAddress } from 'web3-utils'

import applyContext, { type ContextProps } from './Context'
import { ABI } from '@mainframe/eth'

type Tabs = 'tokens' | 'ether' | 'contact' | 'sign'

type State = {
  recipient: string,
  amount: string,
  data: string,
  errorMsg?: ?string,
  message: string,
  signedMessage?: string,
  currentTX: ?{
    hash?: ?string,
    state: 'broadcast' | 'mined' | 'confirmed',
  },
  processingTransaction?: ?boolean,
  sendType: Tabs,
}

class SendFunds extends Component<ContextProps, State> {
  state = {
    recipient: '',
    amount: '',
    data: '',
    message: '',
    sendType: 'ether',
    currentTX: undefined,
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

  onChangeData = (value: string) => {
    this.setState({
      data: value,
    })
  }

  onChangeMessage = (value: string) => {
    this.setState({
      message: value,
    })
  }

  onPressTab = (type: Tabs) => {
    this.setState({
      sendType: type,
    })
  }

  onFocusContactRecipient = () => {
    this.selectContact()
  }

  async selectContact() {
    const { sdk } = this.props
    try {
      const contact = await sdk.contacts.selectContact()
      if (contact && contact.data.profile.ethAddress) {
        this.setState({
          recipient: contact.data.profile.ethAddress,
        })
      }
    } catch (err) {
      console.log('contacts err: ', err)
    }
  }

  validateSend(): boolean {
    const { web3 } = this.props
    if (!isAddress(this.state.recipient)) {
      this.setState({ errorMsg: 'Please provide a valid recipent address' })
      return false
    }
    if (!this.state.amount) {
      this.setState({ errorMsg: 'Please provide a send amount' })
      return false
    }
    return true
  }

  onPressSendToken = async () => {
    this.sendTransaction(true)
  }

  onPressSendEth = async () => {
    this.sendTransaction()
  }

  onPressPayContact = async () => {
    const { sdk } = this.props
    const params = {
      currency: 'ETH',
      value: this.state.amount,
    }
    this.setState({
      currentTX: undefined,
      errorMsg: undefined,
    })
    try {
      const tx = await sdk.payments.payContact(params)
      this.listenTX(tx)
    } catch (err) {
      this.setState({
        errorMsg: err.message || 'Error sending transaction',
      })
    }
  }

  sendTransaction = async (mft?: boolean) => {
    const { web3, sdk } = this.props

    if (!this.validateSend()) {
      return
    }
    this.setState({
      processingTransaction: true,
      currentTX: undefined,
      errorMsg: undefined,
    })

    const account = await sdk.ethereum.getDefaultAccount()

    const params = {
      from: account,
      to: this.state.recipient,
      value: this.state.amount,
    }

    try {
      const txSub = mft
        ? await sdk.ethereum.sendMFT(params)
        : await sdk.ethereum.sendETH(params)

      this.listenTX(txSub)
    } catch (err) {
      this.setState({
        processingTransaction: false,
        errorMsg: err.message || 'Error sending transaction',
      })
    }
  }

  listenTX(tx) {
    tx.on('hash', hash => {
      this.setState({
        currentTX: {
          hash,
          state: 'broadcast',
        },
      })
    })
      .on('mined', () => {
        this.setState({
          processingTransaction: false,
          currentTX: {
            ...this.state.currentTX,
            state: 'mined',
          },
        })
      })
      .on('confirmed', () => {
        this.setState({
          currentTX: {
            ...this.state.currentTX,
            state: 'confirmed',
          },
        })
      })
      .on('error', error => {
        this.setState({
          processingTransaction: false,
          errorMsg: error.message || 'Error sending transaction',
        })
      })
  }

  onPressSign = async () => {
    const { web3, sdk } = this.props

    const account = await sdk.ethereum.getDefaultAccount()
    const signedMessage = await sdk.ethereum.sign(this.state.message, account)
    this.setState({ signedMessage })
  }

  // RENDER

  renderTokenSend() {
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
      </View>
    )
  }

  renderPayContact() {
    return (
      <View>
        <TextInput
          placeholder="Amount"
          style={styles.textInput}
          onChangeText={this.onChangeAmount}
          value={this.state.amount}
        />
      </View>
    )
  }

  renderSignMessage() {
    const signed = this.state.signedMessage ? (
      <View style={[styles.feedbackContainer, styles.receiptContainer]}>
        <Text>{this.state.signedMessage}</Text>
      </View>
    ) : null
    return (
      <View>
        <TextInput
          placeholder="Message"
          style={styles.textInput}
          onChangeText={this.onChangeMessage}
          value={this.state.message}
          numberOfLines={4}
          multiline
        />
        {signed}
      </View>
    )
  }

  renderTabs() {
    const ethStyles = [styles.tab]
    const tokenStyles = [styles.tab]
    const tabStyles = {
      ether: [styles.tab],
      tokens: [styles.tab],
      contact: [styles.tab],
      sign: [styles.tab],
    }
    tabStyles[this.state.sendType].push(styles.tabSelected)

    return (
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => this.onPressTab('ether')}
          style={tabStyles.ether}>
          <Text style={styles.tabLabel}>ETHER</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.onPressTab('tokens')}
          style={tabStyles.tokens}>
          <Text style={styles.tabLabel}>MFT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.onPressTab('contact')}
          style={tabStyles.contact}>
          <Text style={styles.tabLabel}>PAY CONTACT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.onPressTab('sign')}
          style={tabStyles.sign}>
          <Text style={styles.tabLabel}>SIGN MESSAGE</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderResult() {
    const { currentTX } = this.state
    if (currentTX) {
      const style =
        currentTX.state === 'broadcast'
          ? styles.broadcastContainer
          : styles.receiptContainer
      const label =
        currentTX.state === 'broadcast'
          ? 'Waiting to be mined: '
          : 'Transaction confirmed: '
      return (
        <View style={[styles.feedbackContainer, style]}>
          <Text>
            {label}
            {currentTX.hash}
          </Text>
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
    let content, onPress
    let buttonTitle = 'Send'
    switch (this.state.sendType) {
      case 'tokens':
        content = this.renderTokenSend()
        onPress = this.onPressSendToken
        break
      case 'contact':
        content = this.renderPayContact()
        onPress = this.onPressPayContact
        break
      case 'sign':
        content = this.renderSignMessage()
        onPress = this.onPressSign
        buttonTitle = 'Sign'
        break
      case 'ether':
      default:
        content = this.renderEthSend()
        onPress = this.onPressSendEth
        break
    }

    const button = this.state.processingTransaction ? (
      <ActivityIndicator />
    ) : (
      <Button title={buttonTitle} onPress={onPress} />
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
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tabSelected: {
    color: '#4896EC',
    borderColor: '#4896EC',
  },
  tabLabel: {
    fontSize: 13,
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
    backgroundColor: '#e6f2bf',
    borderColor: '#d3e2a7',
  },
  broadcastContainer: {
    backgroundColor: '#F8F2E2',
    borderColor: '#E7E2D2',
  },
  errorContainer: {
    color: '#473f3e',
    backgroundColor: '#f7d7d7',
    borderColor: '#e5bebe',
  },
})

export default applyContext(SendFunds)
