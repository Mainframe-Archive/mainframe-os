// @flow

import React, { Component, type Node } from 'react'
import styled from 'styled-components/native'

import WalletIcon from '../launcher/wallets/WalletIcon'
import rpc from './rpc'

export const condenseAddress = (a?: ?string, len: number = 8): string => {
  if (!a) return ''
  if (a.length < len + 2) {
    return a
  }
  return a.slice(0, len + 2) + '...' + a.slice(-len, a.length)
}

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
    const wallets = await rpc.getUserEthWallets()
    const defaultWalletAcc = await rpc.getUserDefaultWallet()
    this.setState({ wallets, defaultWalletAcc })
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

  renderWallets(wallets: Array<Wallet>): Array<Node> {
    return wallets.map(w => {
      const accounts = w.accounts.map((a, index) => {
        const onPress = () => this.onSelectWalletAccount(a)
        const setHover = () => this.setHover(a)
        const selected = this.state.defaultWalletAcc === a

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
              {condenseAddress(a)}
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
      walletRows.push(this.renderWallets(wallets.hd))
      walletRows.push(this.renderWallets(wallets.ledger))
    }
    return <ScrollViewStyled>{walletRows}</ScrollViewStyled>
  }
}
