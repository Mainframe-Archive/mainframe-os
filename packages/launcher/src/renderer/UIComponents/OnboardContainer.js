//@flow

import React, { Component } from 'react'

import styled from 'styled-components/native'

import { Text } from '@morpheus-ui/core'
import bgGraphic from '../../assets/images/onboard-background.png'
import bgIDGraphic from '../../assets/images/identity-onboard-background.png'

type Props = {
  children: any,
  title: string,
  description?: string,
  id?: boolean,
}

const Container = styled.View`
  flex: 1;
`

const TitleContainer = styled.View`
  margin-bottom: ${props => props.theme.spacing * 4};
`

const BgGraphicContainer = styled.View`
  position: fixed;
  right: 0;
  bottom: 0;
  width: 348;
  height: 575;
`
const Content = styled.View`
  max-width: 400;
  margin-left: 100;
`

const FormContainer = styled.View`
  justify-content: center;
  flex-direction: column;
  flex: 1;
`

const BgImage = styled.Image`
  flex: 1;
`

export default class OnboardContainerView extends Component<Props> {
  render() {
    const description = this.props.description ? (
      <Text variant="regular" size={16}>
        {this.props.description}
      </Text>
    ) : null
    return (
      <Container>
        <FormContainer>
          <Content>
            <TitleContainer>
              <Text variant="h1">{this.props.title}</Text>
              {description}
            </TitleContainer>
            {this.props.children}
          </Content>
        </FormContainer>
        <BgGraphicContainer>
          <BgImage
            source={this.props.id ? bgIDGraphic : bgGraphic}
            resizeMode="contain"
          />
        </BgGraphicContainer>
      </Container>
    )
  }
}
