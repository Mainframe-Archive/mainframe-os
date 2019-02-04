// @flow

import React, { Component, type ElementRef } from 'react'
import styled from 'styled-components/native'

import colors from '../colors'

type Props = {
  title: string,
  Icon: ElementRef<any>,
}

const Header = styled.View`
  padding-vertical: 12px;
  flex-direction: row;
`

const Title = styled.Text`
  padding-left: 10px;
  color: ${colors.LIGHT_GREY_AE};
  font-size: 13px;
  font-weight: bold;
  margin-top: 5px;
`

export default class AlertHeader extends Component<Props> {
  render() {
    const { Icon, title } = this.props
    return (
      <Header>
        <Icon width={25} height={25} color={colors.LIGHT_GREY_AE} />
        <Title>{title}</Title>
      </Header>
    )
  }
}
