//@flow

import React, { Component } from 'react'

import styled from 'styled-components/native'

import { Text, Tooltip } from '@morpheus-ui/core'
import bgGraphic from '../../../assets/images/onboard-background.png'
import bgIDGraphic from '../../../assets/images/identity-onboard-background.png'
import bgWalletGraphic from '../../../assets/images/wallet-onboard-background.png'

type Props = {
  children: any,
  title: string,
  description?: string,
  id?: boolean,
  wallet?: boolean,
  tooltipContent?: ?any,
  step?: 1 | 2 | 3,
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

const Steps = styled.View`
  flex-direction: row;
  margin: 0 0 50px 90px;
`

const StepIndicator = styled.Text`
  border-top-width: 1px;
  border-top-color: #d3d3d3;
  border-top-style: solid;
  width: 45px;
  font-size: 11px;
  margin: 0 5px;
  color: transparent;
  text-align: center;
  padding: 5px;

  ${props => props.selected && `color: #1F3464; border-top-color: #1F3464;`}
`

const DescriptionContainer = styled.View`
  flex-direction: row;
  align-items: center;
`

export default class OnboardContainerView extends Component<Props> {
  render() {
    const description = this.props.description ? (
      <DescriptionContainer>
        <Text variant="regular" size={16}>
          {this.props.description}
        </Text>
        {this.props.tooltipContent && (
          <Tooltip>{this.props.tooltipContent}</Tooltip>
        )}
      </DescriptionContainer>
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
        {this.props.step && (
          <Steps>
            {/*eslint-disable react-native/no-raw-text */}
            <StepIndicator selected={this.props.step === 1}>1</StepIndicator>
            <StepIndicator selected={this.props.step === 2}>2</StepIndicator>
            <StepIndicator selected={this.props.step === 3}>3</StepIndicator>
            {/*eslint-enable react-native/no-raw-text */}
          </Steps>
        )}
        <BgGraphicContainer>
          <BgImage
            source={
              this.props.id
                ? bgIDGraphic
                : this.props.wallet
                ? bgWalletGraphic
                : bgGraphic
            }
            resizeMode="contain"
          />
        </BgGraphicContainer>
      </Container>
    )
  }
}
