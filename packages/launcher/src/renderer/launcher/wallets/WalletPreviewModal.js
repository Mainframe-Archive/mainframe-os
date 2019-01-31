// @flow

import React, { Component } from 'react'
import { Text, Button, Checkbox } from '@morpheus-ui/core'
import styled from 'styled-components/native'
import QRCode from 'qrcode-react'
import EtherscanIcon from '@morpheus-ui/icons/Etherscan'
import UploadSmIcon from '@morpheus-ui/icons/UploadSm'

import FormModalView from '../../UIComponents/FormModalView'

type Props = {
  address: string,
  onClose?: () => void,
  onDeleteWallet: () => void,
  onCheckDefault: () => void,
  default?: boolean,
  full?: boolean,
}

const Container = styled.View`
  width: 100%;
  max-width: 450px;
  min-width: 300px;
`

const Address = styled.View`
  padding: 20px;
  border-width: 1px;
  border-color: #f6f6f6;
  border-radius: 3px;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 300px;
  margin-bottom: 20px;
  margin-right: 20px;
`

const QRContainer = styled.View`
  margin-bottom: 20px;
`
const CheckBoxContainer = styled.View`
  margin: 20px 0;
  align-items: center;
  justify-content: center;
`

const Buttons = styled.View`
  margin: 20px 0;
  max-width: 450px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

export default class WalletCreateModal extends Component<Props> {
  render() {
    return (
      <FormModalView
        full={this.props.full}
        onRequestClose={this.props.onClose}
        title="Address Details"
        dismissButton="DELETE"
        onPressDismiss={this.props.onDeleteWallet}>
        <Container>
          <Address>
            <QRContainer>
              <QRCode value={this.props.address} />
            </QRContainer>
            <Text size={13} variant={['mono', 'greyMed', 'center']}>
              {this.props.address}
            </Text>
          </Address>
          <Buttons>
            <Button
              variant={[
                'completeOnboarding',
                'walletOnboarding',
                'medium',
                'marginRight20',
              ]}
              theme={{ minWidth: 200 }}
              title="View account on Etherscan"
              Icon={EtherscanIcon}
            />
            <Button
              variant={['completeOnboarding', 'walletOnboarding', 'medium']}
              theme={{ minWidth: 200 }}
              title="Export private key"
              Icon={UploadSmIcon}
            />
          </Buttons>
          <CheckBoxContainer>
            <Checkbox
              defaultValue={this.props.default}
              label="Make this my default address"
              checkedLabel="This is my default address"
              disabled={this.props.default}
              onChange={this.props.onCheckDefault}
            />
          </CheckBoxContainer>
        </Container>
      </FormModalView>
    )
  }
}
