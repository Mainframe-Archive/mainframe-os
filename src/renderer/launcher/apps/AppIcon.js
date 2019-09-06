// @flow

import React from 'react'
import Blockies from 'react-blockies'
import styled from 'styled-components/native'

import { type IconSize } from '../../UIComponents/Avatar'

type Props = {
  id: string,
  size?: IconSize,
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

export default function AppIcon({ id, size }: Props) {
  const iconSize = (size && ICON_SIZE[size]) || ICON_SIZE.medium
  return (
    <Container iconSize={iconSize}>
      <Blockies seed={id} size={8} scale={Math.ceil(iconSize / 8)} />
    </Container>
  )
}
