// @flow

import React, { Component, type Node } from 'react'
import { TouchableOpacity } from 'react-native-web'
import styled from 'styled-components/native'

import colors from '../colors'
import rpc from './rpc'

type Wallet = {
  name: string,
  localID: string,
  accounts: Array<string>,
}

type Wallets = {
  hd: Array<Wallet>,
  ledger: Array<Wallet>,
}

type Props = {
  onSelectedWalletAccount: (address: string) => void,
}

type State = {
  wallets?: Wallets,
  defaultWalletAcc?: string,
}

const ScrollViewStyled = styled.ScrollView`
  max-height: 250px;
`

const AccountRow = styled.View`
  border-bottom-width: 1px;
  border-color: ${colors.GREY_DARK_48};
  padding-vertical: 12px;
  max-width: 250px;
`

const AccountLabel = styled.Text`
  font-size: 12px;
  color: ${props => (props.selected ? colors.WHITE : colors.LIGHT_GREY_DE)};
  font-weight: ${props => (props.selected ? 'bold' : 'normal')};
`

const WalletName = styled.Text`
  color: #eee;
  font-weight: bold;
  margin-top: 10px;
`

export default class WalletPickerView extends Component<Props, State> {
  state = {}

  componentDidMount() {
    this.fetchWallets()
  }

  async fetchWallets() {
    const wallets = await rpc.getUserEthWallets()
    const defaultWalletAcc = await rpc.getUserDefaultWallet()
    console.log(wallets)
    this.setState({ wallets, defaultWalletAcc })
  }

  onSelectWalletAccount = (address: string) => {
    this.props.onSelectedWalletAccount(address)
  }

  renderWallets(wallets: Array<Wallet>): Array<Node> {
    return wallets.map(w => {
      const accounts = w.accounts.map(a => {
        const onPress = () => this.onSelectWalletAccount(a)
        const selected = this.state.defaultWalletAcc === a
        const accountText = selected ? `✔   ${a}` : a
        return (
          <TouchableOpacity key={a} onPress={onPress}>
            <AccountRow>
              <AccountLabel selected={selected} numberOfLines={1}>
                {accountText}
              </AccountLabel>
            </AccountRow>
          </TouchableOpacity>
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
      walletRows.push(this.renderWallets(wallets.hd))
      walletRows.push(this.renderWallets(wallets.ledger))
    }
    return <ScrollViewStyled>{walletRows}</ScrollViewStyled>
  }
}
