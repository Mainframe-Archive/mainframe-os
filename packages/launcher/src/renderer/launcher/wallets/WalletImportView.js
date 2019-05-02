// @flow

import React, { Component } from 'react'
import { graphql, commitMutation, type PayloadError } from 'react-relay'
import styled from 'styled-components/native'
import { TextField, Row, Column, Text } from '@morpheus-ui/core'
import {
  type FormSubmitPayload,
  type FieldValidateFunctionParams,
} from '@morpheus-ui/forms'

import FormModalView from '../../UIComponents/FormModalView'
import { EnvironmentContext } from '../RelayEnvironment'

type Props = {
  currentWalletID?: ?string,
  onClose: () => void,
  onSuccess?: (address: string) => void,
  full?: boolean,
}

type State = {
  errorMsg?: ?string,
}

const FormContainer = styled.View`
  width: 80%;
  max-width: 450px;
  padding-top: 70px;
`

const IMPORT_ERR_MSG = 'Sorry, there was a problem importing your wallet.'

const walletImportMutation = graphql`
  mutation WalletImportViewImportHDWalletMutation(
    $input: ImportHDWalletInput!
  ) {
    importHDWallet(input: $input) {
      hdWallet {
        accounts {
          address
        }
        localID
      }
      viewer {
        ...WalletsScreen_user
      }
    }
  }
`

const deleteWalletMutation = graphql`
  mutation WalletImportViewDeleteWalletMutation($input: DeleteWalletInput!) {
    deleteWallet(input: $input) {
      viewer {
        ...WalletsScreen_user
      }
    }
  }
`

const seedValidation = ({ value }: FieldValidateFunctionParams) => {
  if (value && typeof value === 'string' && value.split(' ').length !== 12) {
    return 'Seed phrase must consist of 12 words.'
  }
}

export default class WalletImportView extends Component<Props, State> {
  static contextType = EnvironmentContext

  state = {}

  onSubmit = (payload: FormSubmitPayload) => {
    const { valid, fields } = payload
    if (!valid) {
      return
    }

    if (this.props.currentWalletID) {
      commitMutation(this.context, {
        mutation: deleteWalletMutation,
        variables: {
          input: {
            type: 'hd',
            walletID: this.props.currentWalletID,
          },
        },
        onCompleted: (response, errors) => {
          if (errors || !response) {
            const error =
              errors && errors.length ? errors[0] : new Error(IMPORT_ERR_MSG)
            this.displayError(error)
          } else {
            this.commitImportMutation(fields.walletName, fields.seed)
          }
        },
        onError: err => {
          this.displayError(err)
        },
      })
    } else {
      this.commitImportMutation(fields.walletName, fields.seed)
    }
  }

  commitImportMutation = (name: string, seed: string) => {
    commitMutation(this.context, {
      mutation: walletImportMutation,
      variables: {
        input: {
          blockchain: 'ETHEREUM',
          mnemonic: seed,
          name: name,
        },
      },
      onCompleted: ({ importHDWallet }, errors) => {
        if (errors || !importHDWallet) {
          const error =
            errors && errors.length ? errors[0] : new Error(IMPORT_ERR_MSG)
          this.displayError(error)
        } else {
          this.props.onSuccess
            ? this.props.onSuccess(importHDWallet.hdWallet.accounts[0].address)
            : this.props.onClose()
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

  walletNameValidation = ({ value }: FieldValidateFunctionParams) => {
    if (value && typeof value === 'string' && value.length < 3) {
      return 'Wallet name must be at least 3 characters'
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
      <FormModalView
        title="Import Account with Seed Phrase"
        onRequestClose={this.props.onClose}
        dismissButton="BACK"
        confirmButton="IMPORT"
        confirmTestID="import-wallet-button"
        onSubmitForm={this.onSubmit}
        full={this.props.full}>
        <Text variant={['modalText', 'center']}>
          Enter your secret twelve word phrase here
          <br />
          to restore your vault.
        </Text>
        <FormContainer>
          <TextField
            autoFocus
            required
            label="Wallet name"
            name="walletName"
            testID="wallet-import-name-field"
            validation={this.walletNameValidation}
          />
          <TextField
            label="Seed Phrase"
            placeholder="Separate each word with a single space"
            name="seed"
            required
            multiline
            validation={seedValidation}
            numberOfLines={6}
            testID="import-wallet-seed-input"
          />
          <Row size={1}>
            <Column>{errorMsg}</Column>
          </Row>
        </FormContainer>
      </FormModalView>
    )
  }
}
