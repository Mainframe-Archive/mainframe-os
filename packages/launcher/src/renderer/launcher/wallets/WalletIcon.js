// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'
import Blockies from 'react-blockies'

type IconSize = 'small' | 'medium' | 'large' | 'x-large' | 'xx-large'
type Props = {
  address: string,
  size: IconSize,
}

type State = {
  error: boolean,
}

export const ICON_SIZE = {
  'xx-large': 120,
  'x-large': 96,
  large: 72,
  medium: 40,
  small: 24,
}

const Container = styled.View`
  overflow: hidden;
  border-radius: 3px;
  position: relative;
  width: ${props => props.iconSize}px;
  height: ${props => props.iconSize}px;
  z-index: 2;
  shadow-color: #000;
  shadow-offset: {width: 0, height: 0};
  shadow-opacity: 0.3;
  shadow-radius: 10;
`

export default class WalletIcon extends Component<Props, State> {
  static defaultProps = {
    size: 'small',
  }

  render() {
    const { address, size } = this.props
    const iconSize = ICON_SIZE[size]
    return (
      <Container iconSize={iconSize}>
        <Blockies seed={address} size={8} scale={Math.ceil(iconSize / 8)} />
      </Container>
    )
  }
}
