//@flow

import React, { Component, type Node } from 'react'
import { Text, Tooltip } from '@morpheus-ui/core'
import styled from 'styled-components/native'
import { type txParam } from './InviteContactModal'

type Props = {
  title: string,
  tooltipInfo: { title: string, question: string, answer: string },
  txParam: ?txParam,
  button: ?Node,
}

const AddContactDetail = styled.View`
  padding: 10px;
  margin-top: -10px;
  width: 440px;
  border-radius: 3px;
  border-color: #efefef;
  flex-direction: row;
  align-items: center;
  ${props => props.maxHeight && `max-height: 46px;`}
  ${props => props.border && `border-width: 1px;`}
`

const AddContactDetailText = styled.View`
  flex: 1;
  overflow: hidden;
  padding-right: 20px;
`

const GasContainer = styled.View`
  display: flex;
  max-width: 100%;
  flex-direction: row;
`

const TitleTooltipContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  ${props => props.paddingTop && `padding-top: 30px;`}
`

export default class Transaction extends Component<Props> {
  render() {
    const { title, tooltipInfo, txParam, button } = this.props
    return (
      <>
        <TitleTooltipContainer paddingTop>
          <Text variant="smallTitle">{tooltipInfo.title}</Text>
          <Tooltip>
            <Text variant="tooltipTitle">{tooltipInfo.question}</Text>
            <Text variant="tooltipText">{tooltipInfo.answer}</Text>
          </Tooltip>
        </TitleTooltipContainer>
        <AddContactDetail border maxHeight>
          <AddContactDetailText>
            <Text variant={['greyDark23', 'bold']} size={12}>
              {title}
            </Text>
            {txParam && (
              <GasContainer>
                <Text color="#303030" size={11} variant="marginRight15">
                  {'Gas price: ' + txParam.gasPriceGwei}
                </Text>
                <Text color="#303030" size={11}>
                  {'Max Cost: ' + txParam.maxCost + ' ETH'}
                </Text>
              </GasContainer>
            )}
          </AddContactDetailText>
          {button && button}
        </AddContactDetail>
      </>
    )
  }
}
