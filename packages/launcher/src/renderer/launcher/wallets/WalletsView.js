// @flow

import React, { Component, type ElementRef } from 'react'
import { createFragmentContainer, graphql, commitMutation } from 'react-relay'
import styled from 'styled-components/native'
import { Text, Button } from '@morpheus-ui/core'
import web3Utils from 'web3-utils'
import Web3Contract from 'web3-eth-contract'
import { ABI } from '@mainframe/contract-utils'

import { EnvironmentContext } from '../RelayEnvironment'
import rpc from '../rpc'
import WalletImportView from './WalletImportView'
import WalletAddLedgerModal from './WalletAddLedgerModal'

export type WalletAccounts = Array<{ name: string, address: string }>

export type Wallet = {
  localID: string,
  accounts: WalletAccounts,
}

export type Wallets = {
  ethWallets: {
    hd: Array<Wallet>,
    ledger: Array<Wallet>,
  },
}

type Props = {
  wallets: Wallets,
}

type State = {
  showModal?: ?string,
  errorMsg?: ?string,
  balances: {
    [address: string]: {
      mft: string,
      eth: string,
    },
  },
}

const Container = styled.View`
  padding: 10px;
`

const ButtonsContainer = styled.View`
  flex-direction: 'row';
`

const WalletView = styled.View`
  padding: 10px;
  margin-bottom: 10px;
  background-color: ${props => props.theme.colors.LIGHT_GREY_F5};
`

const WalletTypeLabel = styled.Text`
  padding-vertical: 10px;
`

const createWalletMutation = graphql`
  mutation WalletsViewCreateHDWalletMutation($input: CreateHDWalletInput!) {
    createHDWallet(input: $input) {
      hdWallet {
        accounts {
          name
          address
        }
        localID
      }
      viewer {
        wallets {
          ...WalletsView_wallets
        }
      }
    }
  }
`

const addWalletMutation = graphql`
  mutation WalletsViewAddHDWalletAccountMutation(
    $input: AddHDWalletAccountInput!
  ) {
    addHDWalletAccount(input: $input) {
      address
      viewer {
        wallets {
          ...WalletsView_wallets
        }
      }
    }
  }
`

const TOKEN_ADDRESS = {
  testnet: '0xa46f1563984209fe47f8236f8b01a03f03f957e4',
  mainnet: '0xdf2c7238198ad8b389666574f2d8bc411a4b7428',
}

const newEthRequest = (id, method, params) => {
  return {
    id: id,
    jsonrpc: '2.0',
    method,
    params,
  }
}

class WalletsView extends Component<Props, State> {
  static contextType = EnvironmentContext

  state = {
    balances: {},
  }

  componentDidMount() {
    this.getBalances()
  }

  async getBalances() {
    const { ethWallets } = this.props.wallets
    const balances = {}
    for (let i = 0; i < ethWallets.hd[0].accounts.length; i++) {
      const account = ethWallets.hd[0].accounts[0]
      try {
        // TODO: determine eth network
        const ethBalanceReq = newEthRequest(1, 'eth_getBalance', [
          account.address,
          'latest',
        ])
        const contract = new Web3Contract(ABI.ERC20, TOKEN_ADDRESS.testnet)
        const data = contract.methods.balanceOf(account.address).encodeABI()
        const mftBalanceReq = newEthRequest(2, 'eth_call', [
          { data, to: TOKEN_ADDRESS.testnet },
          'latest',
        ])
        const [ethBalance, mftBalance] = await Promise.all([
          rpc.ethereumRequest(ethBalanceReq),
          rpc.ethereumRequest(mftBalanceReq),
        ])
        balances[account.address] = {
          eth: web3Utils.fromWei(mftBalance, 'ether'),
          mft: web3Utils.fromWei(ethBalance, 'ether'),
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(err)
      }
    }

    this.setState({ balances })
  }

  onPressCreateHDWallet = () => {
    const { ethWallets } = this.props.wallets
    let input, walletMutation
    if (ethWallets.hd.length) {
      const newIndex = ethWallets.hd[0].accounts.length
      walletMutation = addWalletMutation
      input = {
        walletID: ethWallets.hd[0].localID,
        index: newIndex,
        name: `Account ${newIndex + 1}`,
      }
    } else {
      walletMutation = createWalletMutation
      input = { type: 'ETHEREUM', name: 'Account 1' }
    }

    commitMutation(this.context, {
      mutation: walletMutation,
      // $FlowFixMe: Relay type
      variables: { input },
      onError: err => {
        const msg =
          err.message || 'Sorry, there was a problem creating the wallet.'
        this.setState({
          errorMsg: msg,
        })
      },
    })
  }

  onPressImport = () => {
    this.setState({
      showModal: 'import_wallet',
    })
  }

  onPressConnectLedger = () => {
    this.setState({
      showModal: 'connect_ledger',
    })
  }

  onCloseModal = () => {
    this.setState({
      showModal: undefined,
    })
  }

  // RENDER

  renderImportView() {
    const { ethWallets } = this.props.wallets
    const currentWallet = ethWallets.hd.length ? ethWallets.hd[0].localID : null
    return this.state.showModal === 'import_wallet' ? (
      <WalletImportView
        onClose={this.onCloseModal}
        currentWalletID={currentWallet}
      />
    ) : null
  }

  renderConnectLedgerView() {
    return this.state.showModal === 'connect_ledger' ? (
      <WalletAddLedgerModal onClose={this.onCloseModal} />
    ) : null
  }

  renderWalletAccounts(accounts: WalletAccounts): Array<ElementRef<any>> {
    const { balances } = this.state
    return accounts.map(a => {
      const balanceLabales = balances[a.address] ? (
        <>
          <Text>ETH: {balances[a.address].eth}</Text>
          <Text>MFT: {balances[a.address].mft}</Text>
        </>
      ) : null
      return (
        <WalletView key={a.address}>
          <Text>{a.name}</Text>
          <Text>{a.address}</Text>
          {balanceLabales}
        </WalletView>
      )
    })
  }

  renderSoftwareWallets() {
    const { ethWallets } = this.props.wallets
    const wallets = ethWallets.hd.length
      ? this.renderWalletAccounts(ethWallets.hd[0].accounts)
      : null
    return (
      <>
        <WalletTypeLabel>{'Software Wallets'}</WalletTypeLabel>
        {wallets}
        <ButtonsContainer>
          <Button
            title="Create Software Wallet"
            onPress={this.onPressCreateHDWallet}
          />
          <Button title="Import From Seed" onPress={this.onPressImport} />
        </ButtonsContainer>
      </>
    )
  }

  renderLedgerWallets() {
    const { ethWallets } = this.props.wallets
    const wallets = ethWallets.ledger.map(w => {
      return this.renderWalletAccounts(w.accounts)
    })
    return (
      <>
        <WalletTypeLabel>{'Ledger Wallets'}</WalletTypeLabel>
        {wallets}
        <Button
          title="Connect Ledger Wallet"
          onPress={this.onPressConnectLedger}
        />
      </>
    )
  }

  render() {
    return (
      <Container>
        {this.renderSoftwareWallets()}
        {this.renderLedgerWallets()}
        {this.renderImportView()}
        {this.renderConnectLedgerView()}
      </Container>
    )
  }
}

export default createFragmentContainer(WalletsView, {
  wallets: graphql`
    fragment WalletsView_wallets on WalletsQuery {
      ethWallets {
        hd {
          localID
          accounts {
            name
            address
          }
        }
        ledger {
          localID
          accounts {
            name
            address
          }
        }
      }
    }
  `,
})
