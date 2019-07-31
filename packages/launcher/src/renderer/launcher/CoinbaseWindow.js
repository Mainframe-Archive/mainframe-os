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

export default class CoinbaseWindow extends Component<Props, State> {
  componentDidMount() {
    console.log('https://sleepy-oasis-35263.herokuapp.com/authorize')
  }

  render() {
    return (
      <>
        <TitleBar className="draggable" />
        <iframe src="https://sleepy-oasis-35263.herokuapp.com/authorize" />
      </>
    )
  }
}
