// @flow

import React, { Component } from 'react'
import { Text } from '@morpheus-ui/core'
import styled from 'styled-components/native'

type Props = {
  first?: boolean,
  title: string,
  Icon?: any,
  RightElement?: any,
  onPress?: () => void,
}

type State = {
  hover?: boolean,
}

const TitleArea = styled.View`
  flex: 1;
`

const Container = styled.TouchableOpacity`
  padding: 10px 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-color: #f9f9f9;
  height: 45px;
  ${props =>
    props.hover &&
    `background-color: #FFF;
     shadow-color: #000;
     shadow-offset: {width: 0, height: 0};
     shadow-opacity: 0.1;
     shadow-radius: 8;
  `}
  ${props => props.first && 'border-top-width: 1px;'}
`

const ContainerView = styled.View`
  padding: 10px 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-color: #f9f9f9;
  height: 45px;

  ${props => props.first && 'border-top-width: 1px;'}
`

export default class SettingsItem extends Component<Props, State> {
  state = {}

  onFocus = () => this.setState({ hover: true })
  onBlur = () => this.setState({ hover: false })

  renderInside() {
    const { title, Icon, RightElement } = this.props
    return (
      <>
        <TitleArea>
          {Icon && <Icon />}
          <Text variant="greyDark23" bold size={11}>
            {title}
          </Text>
        </TitleArea>
        {RightElement && <RightElement />}
      </>
    )
  }

  render() {
    const { onPress, first } = this.props

    return onPress ? (
      <Container
        hover={this.state.hover}
        onFocus={this.onFocus}
        onMouseOver={this.onFocus}
        onMouseOut={this.onBlur}
        onBlur={this.onBlur}
        onPress={onPress}
        first={first}>
        {this.renderInside()}
      </Container>
    ) : (
      <ContainerView first={first}>{this.renderInside()}</ContainerView>
    )
  }
}
