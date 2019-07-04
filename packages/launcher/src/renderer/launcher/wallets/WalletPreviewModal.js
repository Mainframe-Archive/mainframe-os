// @flow

import { Text, Button, Checkbox, Row, Column } from '@morpheus-ui/core'
import EtherscanIcon from '@morpheus-ui/icons/Etherscan'
import { shell } from 'electron'
import QRCode from 'qrcode.react'
import React, { Component } from 'react'
import styled from 'styled-components/native'

import CopyableBlock from '../CopyableBlock'
import FormModalView from '../../UIComponents/FormModalView'

type Props = {
  address: string,
  onClose?: () => void,
  onDeleteWallet: () => void,
  onCheckDefault: () => void,
  default?: boolean,
  full?: boolean,
}

type State = {
  alert?: boolean,
}

const Container = styled.View`
  width: 100%;
  max-width: 600px;
  min-width: 300px;
  flex: 1;
  align-items: center;
  justify-content: center;
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

const AlertBackdrop = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`

const Alert = styled.View`
  position: absolute;
  bottom: -10px;
  width: 350px;
  left: 50%;
  margin-left: -175px;
  min-height: 100px;
  background-color: #FFF;
  shadow-color: #000;
  shadow-offset: {width: 0, height: 0};
  shadow-opacity: 0.1;
  shadow-radius: 30;
`

const AlertContent = styled.View`
  padding: 20px;
`

const ArrowDownCSS = styled.View`
  position: absolute;
  bottom: -10px;
  left: 50%;
  margin-left: -10px;
  width: 0;
  height: 0;
  border-left-color: transparent;
  border-top-color: #fff;
  border-right-color: transparent;
  border-width: 10px;
  border-bottom-width: 0;
`

export default class WalletCreateModal extends Component<Props, State> {
  state = {}

  toggleAlert = () => this.setState({ alert: !this.state.alert })

  openEtherscan = () => {
    shell.openExternal(`https://etherscan.io/address/${this.props.address}`)
  }

  render() {
    return (
      <FormModalView
        full={this.props.full}
        onRequestClose={this.props.onClose}
        title="Address Details"
        // Disable Delete while not implemented
        // dismissButton="DELETE"
        onPressDismiss={this.toggleAlert}
        dismissButtonDisabled={this.state.alert}>
        <Container>
          <Address>
            <QRContainer>
              <QRCode value={this.props.address} />
            </QRContainer>
            <CopyableBlock
              value={this.props.address}
              noStyles
              variant={['mono', 'greyMed', 'paddingLeft20', 'center']}
            />
          </Address>
          <Buttons>
            <Button
              variant={['completeOnboarding', 'walletOnboarding', 'medium']}
              theme={{ minWidth: 200 }}
              title="View account on Etherscan"
              Icon={EtherscanIcon}
              onPress={this.openEtherscan}
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
        {this.state.alert && (
          <>
            <AlertBackdrop onPress={this.toggleAlert} />
            <Alert>
              <AlertContent>
                <Text size={11} theme={{ marginBottom: 10 }} variant="red">
                  Do you really want to delete this address?
                </Text>
                <Text size={11} theme={{ marginBottom: 10 }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                  consectetur mi in malesuada porttitor.
                </Text>
                <Row size={1}>
                  <Column styles="align-items:center; justify-content: center; flex-direction: row;">
                    <Button
                      title="NO"
                      variant={['no-border', 'grey', 'modalButton']}
                      onPress={this.toggleAlert}
                    />
                    <Button
                      title="YES"
                      variant={['red', 'modalButton']}
                      onPress={this.props.onDeleteWallet}
                    />
                  </Column>
                </Row>
              </AlertContent>
              <ArrowDownCSS />
            </Alert>
          </>
        )}
      </FormModalView>
    )
  }
}
