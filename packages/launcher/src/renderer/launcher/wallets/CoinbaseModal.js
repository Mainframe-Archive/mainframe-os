// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Row, Column, Text, TextField } from '@morpheus-ui/core'

import { remote } from 'electron'
import FormModalView from '../../UIComponents/FormModalView'
import { EnvironmentContext } from '../RelayEnvironment'
import Avatar from '../../UIComponents/Avatar'

import rpc from '../rpc'
import { type Wallets } from './WalletsView'

type Props = {
  address?: string,
  wallets?: Wallets,
  onClose: () => void,
  onComplete?: () => void,
}

type State = {
  amount: number,
  errorMsg: ?string,
  completed: ?boolean,
}

const Container = styled.View`
  min-width: 500px;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px 20px 50px 20px;
`

const AmountContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 30px;
  width: 250px;
`

const AddContactDetail = styled.View`
  padding: 10px;
  margin-top: 20px;
  max-width: 370px;
  border-radius: 3px;
  border-color: #efefef;
  flex-direction: row;
  align-items: center;
  border-width: 1px;
`

const AddContactDetailText = styled.View`
  flex: 1;
  overflow: hidden;
`

const Blocky = styled.View`
  margin-right: 15px;
`

export default class CoinbaseModal extends Component<Props, State> {
  static contextType = EnvironmentContext

  constructor(props) {
    super(props)
    this.state = { amount: 10, completed: false }
  }

  componentDidMount() {
    if (!this.props.address) {
      this.setState({ errorMsg: 'No wallet found' })
    }
  }

  displayError(error: Error | PayloadError) {
    this.setState({
      saving: false,
      errorMsg: error.message,
    })
  }

  render() {
    const { address, onClose, onComplete } = this.props
    const { completed } = this.state
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
        title="Purchase ETH"
        full
        dismissButton={completed ? null : 'CANCEL'}
        onRequestClose={onClose}
        confirmButton={completed ? 'FINISH' : 'PROCEED'}
        onSubmitForm={completed ? onComplete : () => rpc.openCoinbase()}>
        <Container>
          {errorMsg}
          <>
            <Text variant={['modalText', 'center']}>
              {completed
                ? "Congrats! You're all done"
                : 'Funds will be deposited to this Eth address:'}
            </Text>
            {!completed && (
              <>
                <AddContactDetail>
                  <Blocky>
                    <Avatar id={address} size="small" />
                  </Blocky>
                  <AddContactDetailText>
                    <Text bold variant={['ellipsis', 'greyDark23']} size={13}>
                      {address}
                    </Text>
                  </AddContactDetailText>
                </AddContactDetail>
              </>
            )}
          </>
        </Container>
      </FormModalView>
    )
  }
}
