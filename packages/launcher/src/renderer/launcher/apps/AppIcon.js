// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'
import Blockies from 'react-blockies'

import { type IconSize } from '../../UIComponents/Avatar'

type Props = {
  url?: ?string,
  id?: ?string,
  size: IconSize,
}

type State = {
  error: boolean,
}

export const ICON_SIZE = {
  'xx-large': 160,
  'x-large': 120,
  large: 96,
  medium: 72,
  small: 40,
  'x-small': 32,
}

const Container = styled.View`
  overflow: hidden;
  border-radius: 5px;
  position: relative;
  width: ${props => props.iconSize}px;
  height: ${props => props.iconSize}px;
  z-index: 2;
`

export default class AppIcon extends Component<Props, State> {
  static defaultProps = {
    size: 'medium',
  }

  render() {
    const { id, url, size } = this.props
    const iconSize = ICON_SIZE[size]
    return (
      <Container iconSize={iconSize}>
        {url ? (
          <img src={url} width={iconSize} height={iconSize} alt="" />
        ) : id ? (
          <Blockies seed={id} size={8} scale={Math.ceil(iconSize / 8)} />
        ) : null}
      </Container>
    )
  }
}
