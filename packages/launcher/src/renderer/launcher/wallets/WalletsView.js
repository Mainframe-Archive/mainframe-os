// @flow

import React, { Component, type ElementRef } from 'react'
import { createFragmentContainer, graphql, commitMutation } from 'react-relay'
import styled from 'styled-components/native'
import { Text, Button } from '@morpheus-ui/core'

import { EnvironmentContext } from '../RelayEnvironment'
import type { CurrentUser } from '../LauncherContext'
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
  user: CurrentUser,
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
  mutation WalletsViewCreateHDWalletMutation(
    $input: CreateHDWalletInput!
    $userID: String!
  ) {
    createHDWallet(input: $input) {
      hdWallet {
        accounts {
          name
          address
        }
        localID
      }
      viewer {
        identities {
          ...Launcher_identities
        }
        wallets {
          ...WalletsView_wallets @arguments(userID: $userID)
        }
      }
    }
  }
`

const addWalletMutation = graphql`
  mutation WalletsViewAddHDWalletAccountMutation(
    $input: AddHDWalletAccountInput!
    $userID: String!
  ) {
    addHDWalletAccount(input: $input) {
      address
      viewer {
        identities {
          ...Launcher_identities
        }
        wallets {
          ...WalletsView_wallets @arguments(userID: $userID)
        }
      }
    }
  }
`

const setDefaultWalletMutation = graphql`
  mutation WalletsViewSetDefaultWalletMutation(
    $input: SetDefaultWalletInput!
    $userID: String!
  ) {
    setDefaultWallet(input: $input) {
      viewer {
        identities {
          ...Launcher_identities
        }
        wallets {
          ...WalletsView_wallets @arguments(userID: $userID)
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
        userID: this.props.user.localID,
        index: newIndex,
        name: `Account ${newIndex + 1}`,
      }
    } else {
      walletMutation = createWalletMutation
      input = {
        blockchain: 'ETHEREUM',
        name: 'Account 1',
        userID: this.props.user.localID,
      }
    }

    commitMutation(this.context, {
      mutation: walletMutation,
      // $FlowFixMe: Relay type
      variables: { input, userID: this.props.user.localID },
      onError: err => {
        const msg =
          err.message || 'Sorry, there was a problem creating the wallet.'
        this.setState({
          errorMsg: msg,
        })
      },
    })
  }

  onPressSetDefault = (address: string) => {
    const { user } = this.props
    const input = {
      address,
      userID: user.localID,
    }

    commitMutation(this.context, {
      mutation: setDefaultWalletMutation,
      variables: { input, userID: user.localID },
      onError: err => {
        const msg =
          err.message ||
          'Sorry, there was a problem setting your default wallet.'
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
        userID={this.props.user.localID}
      />
    ) : null
  }

  renderConnectLedgerView() {
    return this.state.showModal === 'connect_ledger' ? (
      <WalletAddLedgerModal
        userID={this.props.user.localID}
        onClose={this.onCloseModal}
      />
    ) : null
  }

  renderWalletAccounts(accounts: WalletAccounts): Array<ElementRef<any>> {
    return accounts.map(a => {
      const isDefault = a.address === this.props.user.defaultEthAddress
      const onPress = () => this.onPressSetDefault(a.address)
      const setDefaultButton = <Button title="Set Default" onPress={onPress} />
      const defaultFlag = isDefault ? (
        <Text>Default wallet</Text>
      ) : (
        setDefaultButton
      )
      return (
        <WalletView key={a.address}>
          <Text>{a.name}</Text>
          <Text>{a.address}</Text>
          <Text>ETH: {a.balances.eth}</Text>
          <Text>MFT: {a.balances.mft}</Text>
          {defaultFlag}
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
    fragment WalletsView_wallets on WalletsQuery
      @argumentDefinitions(userID: { type: "String!" }) {
      ethWallets(userID: $userID) {
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
