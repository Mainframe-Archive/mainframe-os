// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'
import Blockies from 'react-blockies'

type IconSize = 'small' | 'medium' | 'large' | 'x-large' | 'xx-large'
type Props = {
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
}

const Container = styled.View`
  overflow: hidden;
  border-radius: 5px;
  position: relative;
  width: ${props => props.iconSize}px;
  height: ${props => props.iconSize}px;
  background-color: #000;
`

export default class AppIcon extends Component<Props, State> {
  static defaultProps = {
    size: 'medium',
  }

  render() {
    const { id, size } = this.props
    const iconSize = ICON_SIZE[size]
    return (
      <Container iconSize={iconSize}>
        {id ? (
          <Blockies seed={id} size={8} scale={Math.ceil(iconSize / 8)} />
        ) : null}
      </Container>
    )
  }
}
