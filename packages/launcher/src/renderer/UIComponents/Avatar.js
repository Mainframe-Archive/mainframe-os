// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native/'
import Blockies from 'react-blockies'

export type IconSize =
  | 'x-small'
  | 'small'
  | 'medium'
  | 'large'
  | 'x-large'
  | 'xx-large'

type Props = {
  id?: ?string,
  size: IconSize,
}

type State = {
  error: boolean,
}

export const AVATAR_SIZE = {
  'xx-large': 160,
  'x-large': 80,
  large: 48,
  medium: 40,
  small: 32,
  'x-small': 24,
}

const Container = styled.View`
  overflow: hidden;
  border-radius: 50%;
  position: relative;
  width: ${props => props.avatarSize}px;
  height: ${props => props.avatarSize}px;
  shadow-color: #000;
  shadow-offset: {width: 0, height: 0};
  shadow-opacity: 0.3;
  shadow-radius: 10;
`

export default class Avatar extends Component<Props, State> {
  static defaultProps = {
    size: 'small',
  }

  render() {
    const { id, size } = this.props
    const avatarSize = AVATAR_SIZE[size]
    return id ? (
      <Container avatarSize={avatarSize}>
        <Blockies seed={id} size={8} scale={Math.ceil(avatarSize / 8)} />
      </Container>
    ) : null
  }
}
