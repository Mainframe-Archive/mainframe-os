// @flow

import { Text } from '@morpheus-ui/core'
import React, { Component } from 'react'
import styled from 'styled-components/native'

import Avatar from '../../UIComponents/Avatar'
import ToastMessage from '../../UIComponents/ToastMessage'

type Props = {
  message: string,
  address: string,
  firstLine: string,
  secondLine: string,
  onRequestClose: () => void,
}

const AvatarWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 0px;
  margin-top: 10px;
`

const Blocky = styled.View`
  margin-right: 15px;
`

const WalletContainer = styled.View`
  display: flex;
  flex-direction: column;
`

export default class Notification extends Component<Props> {
  render() {
    const {
      message,
      address,
      firstLine,
      secondLine,
      onRequestClose,
    } = this.props
    return (
      <ToastMessage onRequestClose={onRequestClose}>
        <Text color="#fff" size={13} variant={['bold', 'marginTop5']}>
          {message}
        </Text>
        <AvatarWrapper marginTop>
          <Blocky>
            <Avatar id={address} size="small" />
          </Blocky>
          <WalletContainer>
            <Text
              color="#fff"
              variant={['greyDark23', 'ellipsis']}
              theme={{ fontStyle: 'normal' }}
              size={12}>
              {firstLine}
            </Text>
            <Text
              color="#fff"
              variant={['greyDark23', 'mono']}
              theme={{ fontStyle: 'normal' }}
              size={12}>
              {secondLine}
            </Text>
          </WalletContainer>
        </AvatarWrapper>
      </ToastMessage>
    )
  }
}
