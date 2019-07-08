// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Row, Column, Text, TextField } from '@morpheus-ui/core'
import Script from 'react-load-script'

import { remote } from 'electron'
import FormModalView from '../../UIComponents/FormModalView'
import { EnvironmentContext } from '../RelayEnvironment'
import Avatar from '../../UIComponents/Avatar'

import { type Wallets } from './WalletsView'

type Props = {
  address?: string,
  wallets?: Wallets,
  onClose: () => void,
  // service: 'wyre' | 'coinbase',
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

export default class WyreModal extends Component<Props, State> {
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

  load = () => {
    let deviceToken = localStorage.getItem('DEVICE_TOKEN')
    if (!deviceToken) {
      const array = new Uint8Array(25)
      crypto.getRandomValues(array)
      deviceToken = Array.prototype.map
        .call(array, x => ('00' + x.toString(16)).slice(-2))
        .join('')
      localStorage.setItem('DEVICE_TOKEN', deviceToken)
    }
  }

  openWyreWidget = () => {
    const deviceToken = localStorage.getItem('DEVICE_TOKEN')
    const widget = new Wyre.Widget({
      env: 'test',
      accountId: 'AK-QXYZDJTM-LN9LLA8H-T6Q78E6A-6NTLAENV',
      auth: {
        type: 'secretKey',
        secretKey: deviceToken,
      },
      operation: {
        type: 'debitcard',
        dest: 'ethereum:' + this.props.address,
        sourceCurrency: 'USD',
        destCurrency: 'ETH',
        sourceAmount: this.state.amount,
      },
    })

    widget.on('close', e => {
      // localStorage.setItem('WYRE_STATUS', 'incomplete')
      if (e.error) {
        this.setState({ errorMsg: e.error, completed: false })
      } else {
        this.setState({ completed: false })
      }
    })

    widget.on('complete', e => {
      // localStorage.setItem('WYRE_STATUS', 'complete')
      console.log('event', e)
      this.setState({ completed: true })
    })

    widget.open()

    console.log(widget)

    // let authWindow = new remote.BrowserWindow({
    //   width: 350,
    //   height: 600,
    //   show: false,
    //   webPreferences: { nodeIntegration: false },
    // })
    //
    // authWindow.loadURL(
    //   `https://verify.testwyre.com/widget/v1?env=test&operation=debitcard&accountId=AC_1234&authType=secretKey&destCurrency=ETH&sourceCurrency=USD&sourceAmount=${
    //     this.state.amount
    //   }&dest=ethereum:${this.props.address}&redirectUrl=https://sendwyre.com`,
    // )
    // authWindow.show()
    //
    // // Handle the response from GitHub - See Update from 4/12/2015
    //
    // authWindow.webContents.on('did-navigate', (event, url) => {
    //   console.log(event)
    //   console.log('url: ', url)
    // })
    // authWindow.on(
    //   'complete',
    //   (event, url) => {fproceed
    //     console.log(event, url)
    //   },
    //   false,
    // )
    // // Reset the authWindow on close
    // authWindow.on(
    //   'close',
    //   () => {
    //     authWindow = null
    //   },
    //   false,
    // )
  }

  validate = payload => {
    const value = payload.value
    if (!Number(value)) {
      return 'Amount must be a number'
    } else if (Number(value) > 40) {
      return 'Amount must be less than 40 USD'
    } else if (Number(value) < 5) {
      return 'Amount must be greater than 5 USD'
    }
  }

  updateAmount = amount => {
    this.setState({ amount: Number(amount) })
  }

  render() {
    const { address, onClose, onComplete } = this.props
    const { completed } = this.state
    console.log(completed)
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
      <>
        <Script
          url="https://verify.sendwyre.com/js/widget-loader.js"
          onLoad={this.load}
        />
        <FormModalView
          title="Purchase ETH"
          full
          dismissButton={completed ? null : 'CANCEL'}
          onRequestClose={onClose}
          confirmButton={completed ? 'FINISH' : 'PROCEED'}
          onSubmitForm={completed ? onComplete : this.openWyreWidget}>
          <Container>
            {errorMsg}
            <>
              <Text variant={['modalText', 'center']}>
                {completed
                  ? "Congrats! You're all done"
                  : 'How much USD would you like to deposit to your ETH address?'}
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
                  <AmountContainer>
                    <TextField
                      variant={['numberAmt']}
                      label="USD amount"
                      defaultValue="10"
                      name="amount"
                      validation={this.validate}
                      onChange={this.updateAmount}
                    />
                  </AmountContainer>
                </>
              )}
            </>
          </Container>
        </FormModalView>
      </>
    )
  }
}
