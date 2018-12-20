// @flow

import React, { Component } from 'react'
import { type ElementRef } from 'react-native-web'
import { createFragmentContainer, graphql, commitMutation } from 'react-relay'
import styled from 'styled-components/native'
import { Text, Button } from '@morpheus-ui/core'

import { EnvironmentContext } from '../RelayEnvironment'
import WalletImportView from './WalletImportView'

export type Wallet = {
  localID: string,
  accounts: Array<{ name: string, address: string }>,
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
  showImport?: ?boolean,
  errorMsg?: ?string,
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
      showImport: true,
    })
  }

  onCloseModal = () => {
    this.setState({
      showImport: false,
    })
  }

  // RENDER

  renderImportView() {
    const { ethWallets } = this.props.wallets
    const currentWallet = ethWallets.hd.length ? ethWallets.hd[0].localID : null
    return this.state.showImport ? (
      <WalletImportView
        onClose={this.onCloseModal}
        currentWalletID={currentWallet}
      />
    ) : null
  }

  renderWalletAccounts(accounts) {
    return accounts.map(a => {
      return (
        <WalletView key={a.address}>
          <Text>{a.name}</Text>
          <Text>{a.address}</Text>
        </WalletView>
      )
    })
  }

  renderWallets(): Array<ElementRef> {
    const { ethWallets } = this.props.wallets
    return Object.keys(ethWallets).map(type => {
      let wallets
      if (type === 'hd' && ethWallets.hd.length) {
        wallets = this.renderWalletAccounts(ethWallets.hd[0].accounts)
      } else if (type === 'ledger') {
        wallets = ethWallets[type].map(w => {
          return this.renderWalletAccounts(w.accounts)
        })
      }
      const createButton =
        type === 'hd' ? (
          <Button
            title="Create Software Wallet"
            onPress={this.onPressCreateHDWallet}
          />
        ) : null
      const importButton =
        type === 'hd' ? (
          <Button title="Import From Seed" onPress={this.onPressImport} />
        ) : null
      const header = type === 'hd' ? 'Software Wallets' : 'Ledger Wallets'
      return (
        <>
          <WalletTypeLabel>{header}</WalletTypeLabel>
          {wallets}
          <ButtonsContainer>
            {createButton}
            {importButton}
          </ButtonsContainer>
        </>
      )
    })
  }

  render() {
    return (
      <Container>
        {this.renderWallets()}
        {this.renderImportView()}
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
          accounts
        }
      }
    }
  `,
})
