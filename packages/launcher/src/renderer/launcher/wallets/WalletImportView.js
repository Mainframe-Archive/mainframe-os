// @flow

import React, { Component } from 'react'
import { graphql, commitMutation, type PayloadError } from 'react-relay'
import styled from 'styled-components/native'
import { Button, TextField, Row, Column, Text } from '@morpheus-ui/core'
import { Form, type FormSubmitPayload } from '@morpheus-ui/forms'

import ModalView from '../../UIComponents/ModalView'
import { EnvironmentContext } from '../RelayEnvironment'

type Props = {
  currentWalletID: ?string,
  onClose: () => void,
  userID: string,
}

type State = {
  errorMsg?: ?string,
}

const FormContainer = styled.View`
  padding-top: 20px;
`

const IMPORT_ERR_MSG = 'Sorry, there was a problem importing your wallet.'

const walletImportMutation = graphql`
  mutation WalletImportViewImportHDWalletMutation(
    $input: ImportHDWalletInput!
    $userID: String!
  ) {
    importHDWallet(input: $input) {
      hdWallet {
        accounts {
          name
          address
        }
        localID
      }
      viewer {
        wallets {
          ...WalletsView_wallets @arguments(userID: $userID)
        }
      }
    }
  }
`

const deleteWalletMutation = graphql`
  mutation WalletImportViewDeleteWalletMutation(
    $input: DeleteWalletInput!
    $userID: String!
  ) {
    deleteWallet(input: $input) {
      viewer {
        wallets {
          ...WalletsView_wallets @arguments(userID: $userID)
        }
      }
    }
  }
`

export default class WalletImportView extends Component<Props, State> {
  static contextType = EnvironmentContext

  state = {}

  onSubmit = (payload: FormSubmitPayload) => {
    const { valid, fields } = payload
    if (!valid) {
      return
    }

    if (this.props.currentWalletID) {
      const deleteInput = {
        type: 'hd',
        walletID: this.props.currentWalletID,
      }

      commitMutation(this.context, {
        mutation: deleteWalletMutation,
        variables: { input: deleteInput, userID: this.props.userID },
        onCompleted: (response, errors) => {
          if (errors || !response) {
            const error =
              errors && errors.length ? errors[0] : new Error(IMPORT_ERR_MSG)
            this.displayError(error)
          } else {
            this.commitImportMutation(fields.seed)
          }
        },
        onError: err => {
          this.displayError(err)
        },
      })
    } else {
      this.commitImportMutation(fields.seed)
    }
  }

  commitImportMutation = (seed: string) => {
    const importInput = {
      type: 'ETHEREUM',
      mnemonic: seed,
      name: 'Account 1',
      linkToUserId: this.props.userID,
    }

    commitMutation(this.context, {
      mutation: walletImportMutation,
      variables: { input: importInput, userID: this.props.userID },
      onCompleted: (response, errors) => {
        if (errors || !response) {
          const error =
            errors && errors.length ? errors[0] : new Error(IMPORT_ERR_MSG)
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
    const msg = error.message || IMPORT_ERR_MSG
    this.setState({
      errorMsg: msg,
    })
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
          Import an existing Ethereum wallet using your 12 word seed phrase.
        </Text>
        <FormContainer>
          <Form onSubmit={this.onSubmit}>
            <Row size={1} top>
              <Column>
                <TextField
                  autoFocus
                  label="Seed Phrase"
                  name="seed"
                  required
                  multiline
                  numberOfLines={3}
                  testID="import-wallet-seed-input"
                />
              </Column>
            </Row>
            {errorMsg}
            <Row size={2} top>
              <Column styles="align-items:flex-end;" smOffset={1}>
                <Button
                  variant=""
                  title="IMPORT"
                  testID="import-wallet-button"
                  submit
                />
              </Column>
            </Row>
          </Form>
        </FormContainer>
      </ModalView>
    )
  }
}
