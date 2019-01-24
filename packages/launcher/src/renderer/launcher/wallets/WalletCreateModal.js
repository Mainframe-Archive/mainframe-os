// @flow

import React, { Component } from 'react'
import { graphql, commitMutation } from 'react-relay'
import { Button, TextField, Row, Column, Text } from '@morpheus-ui/core'
import {
  Form,
  type FormSubmitPayload,
  type FieldValidateFunctionParams,
} from '@morpheus-ui/forms'
import styled from 'styled-components/native'

import { EnvironmentContext } from '../RelayEnvironment'
import ModalView from '../../UIComponents/ModalView'

type State = {
  errorMsg?: ?string,
  step: 'create' | 'backup' | 'confirm_backup',
  confirmedWords: Array<string>,
  seedWords: Array<{ value: string, index: number }>,
  wallet?: ?{
    mnemonic: string,
    localID: string,
  },
}

type Props = {
  userID: string,
  onClose?: () => void,
  onSetupWallet: () => void,
}

const Container = styled.View`
  max-width: 500px;
`

const ConfirmedWords = styled.View`
  flex-direction: row;
  padding: 10px;
  height: 180px;
  background-color: #f5f5f5;
  flex-wrap: wrap;
`

const ConfirmedWord = styled.View`
  margin: 8px;
  border-radius: 3px;
  padding: 10px;
  background-color: ${props => props.theme.colors.DARK_BLUE};
`

const createDescription = `Create a new Ethereum wallet by generating a 12 word seed phrase.
\nThis will allow you to create an unlimited number of addresses for sending and receiving. Once generate you should back up the seed phrase and store it in a safe place.`

const backupDescription = `Below is your 12 word seed phrase, write down the words and store them in a safe place, never save or share them anywhere online.`

const createWalletMutation = graphql`
  mutation WalletCreateModalCreateHDWalletMutation(
    $input: CreateHDWalletInput!
    $userID: String!
  ) {
    createHDWallet(input: $input) {
      hdWallet {
        accounts {
          name
          address
        }
        mnemonic
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

export default class WalletCreateModal extends Component<Props, State> {
  static contextType = EnvironmentContext

  state = {
    step: 'create',
    confirmedWords: [],
    seedWords: [],
    wallet: undefined,
  }

  onSubmit = (payload: FormSubmitPayload) => {
    if (payload.valid) {
      this.createWallet(payload.fields.walletName)
    }
  }

  createWallet = async (name: string) => {
    const input = {
      name,
      blockchain: 'ETHEREUM',
      userID: this.props.userID,
    }
    commitMutation(this.context, {
      mutation: createWalletMutation,
      // $FlowFixMe: Relay type
      variables: { input, userID: this.props.userID },
      onError: err => {
        const msg =
          err.message || 'Sorry, there was a problem creating the wallet.'
        this.setState({
          errorMsg: msg,
        })
      },
      onCompleted: (res, errors) => {
        if (errors && errors.length) {
          this.setState({
            errorMsg: errors[0].message,
          })
        } else {
          const words = res.createHDWallet.hdWallet.mnemonic
            .split(' ')
            .map((w, i) => ({
              value: w,
              index: i,
            }))

          const shuffledWords = words.sort(() => 0.5 - Math.random())

          this.setState({
            wallet: res.createHDWallet.hdWallet,
            seedWords: shuffledWords,
            step: 'backup',
          })
        }
      },
    })
  }

  walletNameValidation = ({ value }: FieldValidateFunctionParams) => {
    if (value && typeof value === 'string' && value.length < 3) {
      return 'Wallet name must be at least 3 characters'
    }
  }

  onPressBackupComplete = () => {
    this.setState({
      step: 'confirm_backup',
    })
  }

  onPressConfirmWord = (word: string, selctedIndex: number) => {
    const { confirmedWords } = this.state
    if (selctedIndex === confirmedWords.length) {
      confirmedWords.push(word)
      this.setState({ confirmedWords })
    }
  }

  onPressShowSeed = () => {
    if (this.state.seedWords) {
      this.setState({
        step: 'backup',
      })
    }
  }

  onPressConfirmBackup = () => {
    if (this.state.confirmedWords.length === 12) {
      this.props.onSetupWallet()
    }
  }

  renderCreateForm() {
    const errorMsg = this.state.errorMsg ? (
      <Text variant="error">{this.state.errorMsg}</Text>
    ) : null
    return (
      <Container>
        <Text styles="margin-bottom: 30px; text-align: center; font-size: 15;">
          {createDescription}
        </Text>
        <Form onSubmit={this.onSubmit}>
          <TextField
            styles="width: 100%;"
            label="Wallet name"
            name="walletName"
            testID="wallet-create-name-field"
            validation={this.walletNameValidation}
          />
          {errorMsg}
          <Row size={1}>
            <Column styles="align-items:center; justify-content: center; flex-direction: row;">
              <Button
                title="CANCEL"
                variant={['no-border', 'grey', 'modalButton']}
                onPress={this.props.onClose}
              />
              <Button
                title="CREATE"
                variant={['red', 'modalButton']}
                testID="wallet-create-submit-button"
                submit
              />
            </Column>
          </Row>
        </Form>
      </Container>
    )
  }

  renderDisplaySeed() {
    const { wallet } = this.state
    if (!wallet) {
      return
    }
    const seedWords = wallet.mnemonic.split(' ')
    const left = []
    const right = []
    seedWords.forEach((w, i) => {
      const col = i < 6 ? left : right
      col.push(
        <Text key={w} styles="padding:8px; color:#303030; font-size: 15;">
          {`${i + 1}: ${w}`}
        </Text>,
      )
    })
    return (
      <Container>
        <Text styles="margin-bottom: 30px; text-align: center; font-size: 15;">
          {backupDescription}
        </Text>
        <Row size={2}>
          <Column size={1}>
            <Row size={2} styles="background-color:#f5f5f5; padding:20px;">
              <Column>{left}</Column>
              <Column>{right}</Column>
            </Row>
            <Text variant="error">
              Never disclose your backup phrase. Anyone with this phrase can
              take your Ether with no possibilty to retrieve it.
            </Text>
          </Column>
          <Column>
            <Text styles="margin-top:10px;">TIPS</Text>
            <Text>
              {`\nStore this phrase in a password manager like 1Password.\n\nWrite this phrase on a piece of paper and store in a secure location.`}
            </Text>
          </Column>
        </Row>
        <Row size={1}>
          <Column styles="align-items:center; justify-content: center; flex-direction: row;">
            <Button
              title="NEXT"
              testID="wallet-create-confirm-backup-button"
              variant={['red', 'modalButton']}
              onPress={this.onPressBackupComplete}
            />
          </Column>
        </Row>
      </Container>
    )
  }

  renderConfirmBackup() {
    const { confirmedWords, seedWords } = this.state
    const correctWords = confirmedWords.map(w => {
      return (
        <ConfirmedWord key={w}>
          <Text styles="font-size: 15; color: #fff;">{w}</Text>
        </ConfirmedWord>
      )
    })

    const wordLabels = seedWords.map(w => {
      const onPress = () => this.onPressConfirmWord(w.value, w.index)
      return (
        <Button
          testID={`seed-word-${w.index}`}
          key={w.value}
          onPress={onPress}
          title={w.value}
        />
      )
    })
    return (
      <Container>
        <Text styles="margin-bottom: 30px; text-align: center; font-size: 15;">
          Please select each word in order to make sure your phrase is correct.
        </Text>
        <ConfirmedWords>{correctWords}</ConfirmedWords>
        <Row>{wordLabels}</Row>
        <Row size={1}>
          <Column styles="align-items:center; justify-content: center; flex-direction: row;">
            <Button
              title="BACK"
              variant={['no-border', 'grey', 'modalButton']}
              onPress={this.onPressShowSeed}
            />
            <Button
              title="CONFIRM"
              testID="wallet-create-backup-test-submit"
              variant={['red', 'modalButton']}
              onPress={this.onPressConfirmBackup}
            />
          </Column>
        </Row>
      </Container>
    )
  }

  render() {
    let content
    switch (this.state.step) {
      case 'backup':
        content = this.renderDisplaySeed()
        break
      case 'confirm_backup':
        content = this.renderConfirmBackup()
        break
      case 'create':
      default:
        content = this.renderCreateForm()
        break
    }
    return (
      <ModalView title="CREATE ETHEREUM WALLET" onSubmit={this.onSubmit}>
        {content}
      </ModalView>
    )
  }
}
