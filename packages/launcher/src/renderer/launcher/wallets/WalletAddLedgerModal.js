// @flow

import React, { Component } from 'react'
import { graphql, commitMutation, type PayloadError } from 'react-relay'
import { ActivityIndicator, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import { Row, Column, Text } from '@morpheus-ui/core'

import rpc from '../rpc'
import ModalView from '../../UIComponents/ModalView'
import { EnvironmentContext } from '../RelayEnvironment'

type Props = {
  userID: string,
  onClose: () => void,
}

type State = {
  errorMsg?: ?string,
  fetchingAccounts?: ?boolean,
  accounts?: ?Array<string>,
}

const AccountsContainer = styled.View`
  padding: 10px;
  background-color: ${props => props.theme.colors.LIGHT_GREY_F5};
  margin-top: 10px;
`

const AccountItem = styled.Text`
  padding-vertical: 6px;
  font-size: 12;
`

const ActivityContainer = styled.Text`
  padding: 10px;
`

const MUTATION_ERR_MSG =
  'Sorry, there was a problem connecting your ledger wallet.'
const ACCOUNT_FETCH_ERR_MSG =
  'Sorry, there was a problem connecting your ledger wallet, please check you have it unlocked and the Ethereum app open.'

const addLedgerWalletMutation = graphql`
  mutation WalletAddLedgerModalAddLedgerWalletAccountMutation(
    $input: AddLedgerWalletAccountInput!
    $userID: String!
  ) {
    addLedgerWalletAccount(input: $input) {
      viewer {
        wallets {
          ...WalletsView_wallets @arguments(userID: $userID)
        }
      }
    }
  }
`

export default class WalletAddLedgerModal extends Component<Props, State> {
  static contextType = EnvironmentContext

  state = {}

  componentDidMount() {
    this.fetchAccounts()
  }

  async fetchAccounts() {
    this.setState({ fetchingAccounts: true })
    try {
      const accounts = await rpc.getLedgerAccounts(1)
      this.setState({
        accounts,
        fetchingAccounts: false,
      })
    } catch (err) {
      this.setState({
        fetchingAccounts: false,
        errorMsg: err.message || ACCOUNT_FETCH_ERR_MSG,
      })
    }
  }

  onSelectAccount = (index: number) => {
    // TODO input name
    const input = {
      index,
      name: `Ledger ${index}`,
      linkToUserId: this.props.userID,
    }

    commitMutation(this.context, {
      mutation: addLedgerWalletMutation,
      variables: { input, userID: this.props.userID },
      onCompleted: (response, errors) => {
        if (errors || !response) {
          const error =
            errors && errors.length ? errors[0] : new Error(MUTATION_ERR_MSG)
          this.displayError(error)
        } else {
          this.props.onClose()
        }
      },
      onError: err => {
        this.displayError(err)
      },
    })
  }

  displayError(error: Error | PayloadError) {
    this.setState({
      errorMsg: error.message,
    })
  }

  renderAccounts() {
    if (this.state.fetchingAccounts) {
      return (
        <ActivityContainer>
          <ActivityIndicator />
        </ActivityContainer>
      )
    }
    if (this.state.accounts) {
      const accounts = this.state.accounts.map((a, i) => {
        const onPress = () => this.onSelectAccount(i)
        return (
          <TouchableOpacity key={a} onPress={onPress}>
            <AccountItem>{a}</AccountItem>
          </TouchableOpacity>
        )
      })
      return <AccountsContainer>{accounts}</AccountsContainer>
    }
  }

  render() {
    const errorMsg = this.state.errorMsg ? (
      <Row size={1}>
        <Column>
          <Text variant="error">{this.state.errorMsg}</Text>
        </Column>
      </Row>
    ) : null

    return (
      <ModalView onRequestClose={this.props.onClose}>
        <Text variant="h2">Import Wallet</Text>
        <Text>
          Please select an account after unlocking yor ledger wallet and opening
          the Ethereum app.
        </Text>
        {this.renderAccounts()}
        {errorMsg}
      </ModalView>
    )
  }
}
