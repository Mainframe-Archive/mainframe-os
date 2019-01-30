// @flow

import React, { Component } from 'react'
import { graphql, commitMutation } from 'react-relay'
import { Button, TextField, Row, Column, Text } from '@morpheus-ui/core'
import {
  type FormSubmitPayload,
  type FieldValidateFunctionParams,
} from '@morpheus-ui/forms'
import styled from 'styled-components/native'

import { EnvironmentContext } from '../RelayEnvironment'
import FormModalView from '../../UIComponents/FormModalView'

type Wallet = {
  accounts: Array<{
    address: string,
  }>,
  mnemonic: string,
  localID: string,
}

type State = {
  errorMsg?: ?string,
  step: 'create' | 'backup' | 'confirm_backup',
  confirmedWords: Array<string>,
  seedWords: Array<{ value: string, index: number }>,
  wallet?: ?Wallet,
}

type Props = {
  userID: string,
  onClose?: () => void,
  onSetupWallet: (wallet: Wallet) => void,
  full?: boolean,
}

const Container = styled.View`
  max-width: 500px;
`

const ConfirmedWords = styled.View`
  flex-direction: row;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  flex-wrap: wrap;
`

const HorizontalView = styled.View`
  flex-direction: row;
  padding: 10px 0;
`

const VerticalView = styled.View`
  flex-direction: column;
  padding: 0 10px;
`

const SeedPhraseContainer = styled.View`
  background-color: #f9f9f9;
  padding: 8px 0;
  min-width: 280px;
`

const WordLabels = styled.View`
  padding: 5px 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`

const LabelWrapper = styled.View`
  padding: 0;
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
    if (this.state.wallet && this.state.confirmedWords.length === 12) {
      this.props.onSetupWallet(this.state.wallet)
    }
  }

  renderCreateForm() {
    const errorMsg = this.state.errorMsg ? (
      <Text variant="error">{this.state.errorMsg}</Text>
    ) : null

    return (
      <FormModalView
        full={this.props.full}
        title="New Software Wallet"
        dismissButton="CANCEL"
        confirmButton="CREATE"
        onSubmitForm={this.onSubmit}
        onRequestClose={this.props.onClose}
        confirmTestID="wallet-create-submit-button">
        <Container>
          <Text
            size={12}
            variant={['greyMed', 'center']}
            theme={{ marginBottom: '30px' }}>
            {createDescription}
          </Text>
          <TextField
            required
            label="Wallet name"
            name="walletName"
            testID="wallet-create-name-field"
            validation={this.walletNameValidation}
          />
          {errorMsg}
        </Container>
      </FormModalView>
    )
  }

  renderDisplaySeed() {
    const { wallet } = this.state
    if (!wallet) {
      return null
    }
    const seedWords = wallet.mnemonic.split(' ')
    const left = []
    const right = []
    seedWords.forEach((w, i) => {
      const col = i < 6 ? left : right
      col.push(
        <Text size={13} color="#303030" key={w} theme={{ padding: '4px 0' }}>
          <Text
            size={11}
            color="#C0C0C0"
            theme={{
              display: 'inline-block',
              width: 20,
              textAlign: 'right',
              marginRight: '5px',
            }}>{`${i + 1}.`}</Text>
          {w}
        </Text>,
      )
    })
    return (
      <FormModalView
        full={this.props.full}
        title="Secret Backup Phrase"
        confirmButton="CONFIRM"
        confirmTestID="wallet-create-confirm-backup-button"
        onPressConfirm={this.onPressBackupComplete}>
        <Container>
          <Text
            size={12}
            variant={['greyMed', 'center']}
            theme={{ marginBottom: '30px' }}>
            {backupDescription}
          </Text>
          <HorizontalView>
            <VerticalView>
              <Text variant="smallTitle" color="#232323" bold>
                SEED PHRASE
              </Text>
              <SeedPhraseContainer>
                <Row size={2} styles="background-color:#F9F9F9; padding:20px;">
                  <Column>{left}</Column>
                  <Column>{right}</Column>
                </Row>
              </SeedPhraseContainer>
              <Text
                size={10}
                variant="error"
                theme={{ maxWidth: '300px', marginTop: '10px' }}>
                Never disclose your backup phrase. Anyone with this phrase can
                take your Ether forever.
              </Text>
            </VerticalView>
            <VerticalView>
              <Text variant="smallTitle" color="#232323" bold>
                TIPS
              </Text>
              <Text size={12} color="#585858" theme={{ maxWidth: '180' }}>
                {`\nStore this phrase in a password manager like 1Password.\n\nWrite this phrase on a piece of paper and store in a secure location.`}
              </Text>
            </VerticalView>
          </HorizontalView>
        </Container>
      </FormModalView>
    )
  }

  renderConfirmBackup() {
    const { confirmedWords, seedWords, wallet } = this.state
    if (!wallet) {
      return null
    }

    const one = []
    const two = []
    const three = []

    const originalSeedWords = wallet.mnemonic.split(' ')

    originalSeedWords.forEach((w, i) => {
      const col = i < 4 ? one : i < 8 ? two : three
      col.push(
        <Text size={13} color="#303030" key={w} theme={{ padding: '4px 0' }}>
          <Text
            size={11}
            color="#C0C0C0"
            theme={{
              display: 'inline-block',
              width: 20,
              textAlign: 'right',
              marginRight: '5px',
            }}>{`${i + 1}.`}</Text>
          {confirmedWords.indexOf(w) >= 0 ? w : ''}
        </Text>,
      )
    })

    const rowOne = []
    const rowTwo = []
    seedWords.forEach((w, i) => {
      const row = i < 6 ? rowOne : rowTwo
      const onPress = () => this.onPressConfirmWord(w.value, w.index)

      const button = (
        <LabelWrapper key={w.value}>
          <Button
            testID={`seed-word-${w.index}`}
            onPress={onPress}
            title={w.value}
            variant={
              confirmedWords.indexOf(w.value) >= 0
                ? 'selectedSeedWord'
                : 'seedWord'
            }
          />
        </LabelWrapper>
      )

      row.push(button)
    })

    return (
      <FormModalView
        full={this.props.full}
        title="confirm your Secret Backup Phrase"
        dismissButton="BACK"
        confirmButton="CONFIRM"
        confirmTestID="wallet-create-backup-test-submit"
        onPressConfirm={this.onPressConfirmBackup}
        onPressDismiss={this.onPressShowSeed}>
        <Container>
          <Text
            size={12}
            variant={['greyMed', 'center']}
            theme={{ marginBottom: '30px' }}>
            Please select each word in order to make sure your phrase is
            correct.
          </Text>
          <ConfirmedWords>
            <Row size={3}>
              <Column>{one}</Column>
              <Column>{two}</Column>
              <Column>{three}</Column>
            </Row>
          </ConfirmedWords>
          <WordLabels>{rowOne}</WordLabels>
          <WordLabels>{rowTwo}</WordLabels>
        </Container>
      </FormModalView>
    )
  }

  render() {
    switch (this.state.step) {
      case 'backup':
        return this.renderDisplaySeed()
      case 'confirm_backup':
        return this.renderConfirmBackup()
      case 'create':
      default:
        return this.renderCreateForm()
    }
  }
}
