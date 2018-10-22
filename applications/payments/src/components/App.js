// @flow
import React, { Component } from 'react'
import MainframeSDK from '@mainframe/sdk'
import Web3 from 'web3'

import { Provider } from './Context.js'
import Payments from './Payments'

export default class App extends Component<{}> {
  sdk: MainframeSDK
  web3: Web3

  constructor(props) {
    super(props)
    this.sdk = new MainframeSDK()
    this.web3 = new Web3(this.sdk.blockchain.getWeb3Provider())
  }

  render() {
    return (
      <Provider value={{ web3: this.web3, sdk: this.sdk }}>
        <Payments />
      </Provider>
    )
  }
}
