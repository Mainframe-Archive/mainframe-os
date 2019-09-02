// @flow

import { truncateAddress } from '@mainframe/eth'
import React, { Component, type Node } from 'react'
import styled from 'styled-components/native'

import type { AppWallet, AppWallets } from '../../types'

import WalletIcon from '../launcher/wallets/WalletIcon'
import rpc from './rpc'

type Props = {
  onSelectedWalletAccount: (address: string) => void,
}

type State = {
  wallets?: AppWallets,
  hover?: ?string,
}

const ScrollViewStyled = styled.ScrollView`
  max-height: 380px;
`

const AccountRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  border-top-width: 1px;
  border-color: #303030;
  padding: 20px;
  max-width: 250px;
  ${props => props.first && `border-color: transparent;`}
  ${props => props.selected && `background-color: #585858;`}
  ${props => props.hover && `background-color: #2C2C2C;`}
`
const AccountLabel = styled.Text`
  font-family: 'IBM Plex Mono';
  font-size: 12px;
  padding-left: 20px;
  color: #fff;
`

const WalletName = styled.Text`
  font-family: 'Muli';
  font-size: 10px;
  color: #a9a9a9;
  font-weight: bold;
  padding: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
`

export default class WalletPickerView extends Component<Props, State> {
  state = {}

  componentDidMount() {
    this.fetchWallets()
  }

  async fetchWallets() {
    this.setState({ wallets: await rpc.getUserWallets() })
  }

  onSelectWalletAccount = (address: string) => {
    this.props.onSelectedWalletAccount(address)
  }

  releaseHover = () => {
    this.setState({ hover: null })
  }

  setHover = (id: string) => {
    this.setState({ hover: id })
  }

  renderWallets(
    wallets: Array<AppWallet>,
    defaultAccount: ?string,
  ): Array<Node> {
    return wallets.map(w => {
      const accounts = w.accounts.map((a, index) => {
        const onPress = () => this.props.onSelectedWalletAccount(a)
        const setHover = () => this.setHover(a)
        const selected = defaultAccount === a

        return (
          <AccountRow
            key={a}
            className="transition"
            onPress={onPress}
            onFocus={setHover}
            onBlur={this.releaseHover}
            onMouseOver={setHover}
            onMouseOut={this.releaseHover}
            first={index === 0}
            selected={selected}
            hover={this.state.hover === a}>
            <WalletIcon size="small" address={a} />
            <AccountLabel selected={selected} numberOfLines={1}>
              {truncateAddress(a)}
            </AccountLabel>
          </AccountRow>
        )
      })
      return (
        <>
          <WalletName>{w.name}</WalletName>
          {accounts}
        </>
      )
    })
  }

  render() {
    const { wallets } = this.state
    const walletRows = []
    if (wallets) {
      walletRows.push(this.renderWallets(wallets.hd, wallets.defaultAccount))
      walletRows.push(
        this.renderWallets(wallets.ledger, wallets.defaultAccount),
      )
    }
    return <ScrollViewStyled>{walletRows}</ScrollViewStyled>
  }
}
