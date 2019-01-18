// @flow

import React, { Component, type ElementRef } from 'react'
import { createFragmentContainer, graphql, commitMutation } from 'react-relay'
import styled from 'styled-components/native'
import { Text, Button } from '@morpheus-ui/core'

import { EnvironmentContext } from '../RelayEnvironment'
import WalletImportView from './WalletImportView'
import WalletAddLedgerModal from './WalletAddLedgerModal'

export type WalletAccounts = Array<{
  name: string,
  address: string,
  balances: { mft: string, eth: string },
}>

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
}

const Container = styled.View`
  padding: 10px;
`

const ButtonsContainer = styled.View`
  flex-direction: row;
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

class WalletsView extends Component<Props, State> {
  static contextType = EnvironmentContext

  state = {}

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
    return accounts.map(a => {
      return (
        <WalletView key={a.address}>
          <Text>{a.name}</Text>
          <Text>{a.address}</Text>
          <Text>ETH: {a.balances.eth}</Text>
          <Text>MFT: {a.balances.mft}</Text>
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
            balances {
              eth
              mft
            }
          }
        }
        ledger {
          localID
          accounts {
            name
            address
            balances {
              eth
              mft
            }
          }
        }
      }
    }
  `,
})
