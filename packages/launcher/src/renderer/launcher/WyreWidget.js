// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Row, Column, Text, TextField } from '@morpheus-ui/core'
import Script from 'react-load-script'

import Avatar from '../UIComponents/Avatar'
import { EnvironmentContext } from './RelayEnvironment'

import rpc from './rpc'
import { type Wallets } from './WalletsView'

const TitleBar = styled.View`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 20px;
  background-color: transparent;
`

export default class WyreWidget extends Component<Props, State> {
  componentDidMount() {
    let deviceToken = localStorage.getItem('DEVICE_TOKEN')
    if (!deviceToken) {
      const array = new Uint8Array(25)
      crypto.getRandomValues(array)
      deviceToken = Array.prototype.map
        .call(array, x => ('00' + x.toString(16)).slice(-2))
        .join('')
      localStorage.setItem('DEVICE_TOKEN', deviceToken)
    }
  }

  load = () => {
    const deviceToken = localStorage.getItem('DEVICE_TOKEN')
    rpc.getWyreDeviceToken()

    const widget = new Wyre.Widget({
      env: 'test',
      accountId: 'AK-QXYZDJTM-LN9LLA8H-T6Q78E6A-6NTLAENV',
      auth: {
        type: 'secretKey',
        secretKey: deviceToken,
      },
      operation: {
        type: 'debitcard',
        dest: 'ethereum:0x75bdf6a2ced3a0d0eff704555e3350b5010f5e00',
        sourceCurrency: 'USD',
        destCurrency: 'ETH',
      },
    })

    widget.on('close', e => {
      if (e.error) {
        this.setState({ errorMsg: e.error, completed: false })
      } else {
        this.setState({ completed: false })
      }
    })

    widget.on('complete', e => {
      console.log('event', e)
      this.setState({ completed: true })
    })

    widget.open()
  }

  render() {
    return (
      <>
        <TitleBar className="draggable" />
        <Script
          url="https://verify.sendwyre.com/js/widget-loader.js"
          onLoad={this.load}
        />
      </>
    )
  }
}
