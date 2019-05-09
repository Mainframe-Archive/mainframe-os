// @flow

import React, { Component } from 'react'
import { graphql, commitMutation, type PayloadError } from 'react-relay'
import styled from 'styled-components/native'
import { Row, Column, Text, Checkbox, Pagination } from '@morpheus-ui/core'
import memoize from 'memoize-one'
import { flatten } from 'lodash'

import Loader from '../../UIComponents/Loader'
import rpc from '../rpc'
import FormModalView from '../../UIComponents/FormModalView'
import { EnvironmentContext } from '../RelayEnvironment'

import { type Wallet } from './WalletsView'

type Props = {
  wallets: Array<Wallet>,
  full?: boolean,
  onClose: () => void,
  onSuccess?: (address: string) => void,
}

type State = {
  saving: boolean,
  connected?: boolean,
  selectedItems: Array<number>,
  currentPage: number,
  errorMsg?: ?string,
  fetchingAccounts?: ?boolean,
  accounts?: ?Array<string>,
  ledgerName: string,
  hover: ?string,
}

const Container = styled.View`
  min-width: 500px;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px 20px 50px 20px;
`

const AccountsContainer = styled.View`
  flex: 1;
  margin-bottom: 20px;
  max-height: 600px;
`

const ScrollView = styled.ScrollView``

const AccountItem = styled.View`
  padding: 10px 10px 3px 10px;
  ${props => props.hover && `background-color: #f9f9f9;`}
`

const ActivityContainer = styled.View`
  padding: 10px;
  align-items: center;
  justify-content: center;
`

const MUTATION_ERR_MSG =
  'Sorry, there was a problem connecting your ledger wallet.'
const ACCOUNT_FETCH_ERR_MSG =
  'Sorry, there was a problem connecting your ledger wallet, please check you have it unlocked and the Ethereum app open.'

const addLedgerWalletMutation = graphql`
  mutation WalletAddLedgerModalAddLedgerWalletAccountsMutation(
    $input: AddLedgerWalletAccountsInput!
  ) {
    addLedgerWalletAccounts(input: $input) {
      ledgerWallet {
        accounts {
          address
        }
      }
      viewer {
        ...WalletsScreen_user
      }
    }
  }
`
export default class WalletAddLedgerModal extends Component<Props, State> {
  static contextType = EnvironmentContext

  state = {
    currentPage: 1,
    selectedItems: [],
    ledgerName: '',
    hover: '',
    saving: false,
  }

  componentDidMount() {
    this.fetchAccounts()
  }

  onChangePage = (pageNumber: number) => {
    this.fetchAccounts(pageNumber)
  }

  fetchAccounts = async (pageNumber: number = 1) => {
    this.setState({ fetchingAccounts: true })
    try {
      const accounts = await rpc.getLedgerAccounts(pageNumber)
      const name =
        pageNumber === 1 && accounts.length
          ? `Ledger ${accounts[0].substring(0, 4)}`
          : this.state.ledgerName

      this.setState({
        ledgerName: name,
        currentPage: pageNumber,
        connected: true,
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

  onSelectAccount = (address: number) => {
    let newArray
    if (this.state.selectedItems.indexOf(address) >= 0) {
      newArray = this.state.selectedItems.filter(a => a !== address)
    } else {
      newArray = [...this.state.selectedItems, address]
    }
    this.setState({
      selectedItems: newArray,
    })
  }

  onCreate = () => {
    this.setState({ saving: true })
    const input = {
      indexes: [...this.state.selectedItems],
      name: this.state.ledgerName,
    }

    commitMutation(this.context, {
      mutation: addLedgerWalletMutation,
      variables: { input },
      onCompleted: ({ addLedgerWalletAccounts }, errors) => {
        if (errors || !addLedgerWalletAccounts) {
          const error =
            errors && errors.length ? errors[0] : new Error(MUTATION_ERR_MSG)

          this.displayError(error)
        } else {
          this.props.onSuccess
            ? this.props.onSuccess(
                addLedgerWalletAccounts.ledgerWallet.accounts[0].address,
              )
            : this.props.onClose()
        }
      },
      onError: err => {
        this.displayError(err)
      },
    })
  }

  displayError(error: Error | PayloadError) {
    this.setState({
      saving: false,
      errorMsg: error.message,
    })
  }

  getAddresses = memoize((wallets: Array<Wallet>) => {
    const addresses = flatten(wallets.map(w => w.accounts))
    return addresses
  })

  hasAddress = memoize((addresses: Array<Object>, address: string) => {
    return addresses.filter(acc => address === acc.address).length > 0
  })

  renderAccounts() {
    if (!this.state.connected) {
      return (
        <ActivityContainer>
          <Text variant={['center', 'modalText', 'marginBottom20']}>
            Please unlock your Ledger and open the Ethereum app.
          </Text>
          <Loader />
        </ActivityContainer>
      )
    }

    if (this.state.saving) {
      return (
        <ActivityContainer>
          <Text variant={['center', 'modalText', 'marginBottom20']}>
            Saving your addresses...
          </Text>
          <Loader />
        </ActivityContainer>
      )
    }

    if (this.state.fetchingAccounts) {
      return (
        <ActivityContainer>
          <Text variant={['center', 'modalText', 'marginBottom20']}>
            Fetching addresses...
          </Text>
          <Loader />
        </ActivityContainer>
      )
    }

    const addresses = this.getAddresses(this.props.wallets)

    if (this.state.accounts) {
      const accounts = this.state.accounts.map((a, i) => {
        const index = i + (this.state.currentPage - 1) * 10
        const onPress = () => this.onSelectAccount(index)
        const selected = this.state.selectedItems.indexOf(index) >= 0
        const disabled = this.hasAddress(addresses, a)

        const setHover = () => this.setState({ hover: a })
        const releaseHover = () => this.setState({ hover: '' })

        return (
          <AccountItem
            hover={this.state.hover === a}
            onMouseOver={setHover}
            onMouseLeave={releaseHover}
            key={a}>
            <Checkbox
              variant="mono"
              defaultValue={selected || disabled}
              onChange={onPress}
              label={a}
              disabled={disabled}
            />
          </AccountItem>
        )
      })
      return (
        <>
          <Text variant={['center', 'modalText', 'marginBottom20']}>
            Select one or multiple addresses
          </Text>
          <AccountsContainer>
            <ScrollView>{accounts}</ScrollView>
          </AccountsContainer>
          <Pagination
            numPages={1000}
            maxDisplay={10}
            defaultPage={this.state.currentPage}
            label="Page"
            onSelectPage={this.onChangePage}
          />
        </>
      )
    }
  }

  render() {
    const errorMsg = this.state.errorMsg ? (
      <Row size={1}>
        <Column>
          <Text variant={['modalText', 'error', 'center']}>
            {this.state.errorMsg}
          </Text>
        </Column>
      </Row>
    ) : null

    return (
      <FormModalView
        title="Connect with a ledger wallet"
        full={this.props.full}
        onRequestClose={this.state.saving ? undefined : this.props.onClose}
        dismissButtonDisabled={this.state.saving}
        dismissButton="CANCEL"
        confirmButton="IMPORT"
        confirmButtonDisabled={
          !this.state.selectedItems.length || this.state.saving
        }
        onSubmitForm={this.onCreate}>
        <Container>
          {this.renderAccounts()}
          {errorMsg}
        </Container>
      </FormModalView>
    )
  }
}
