//@flow
import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Button, Text } from '@morpheus-ui/core'

//import Icons
import ContactsIcon from '@morpheus-ui/icons/ContactsMd'
import ContactsFilledIcon from '@morpheus-ui/icons/ContactsFilledMd'
import WalletsIcon from '@morpheus-ui/icons/WalletsMd'
import WalletsFilledIcon from '@morpheus-ui/icons/WalletsFilledMd'
import SkipIcon from '@morpheus-ui/icons/ArrowRightSm'

const BUTTONS: Object = {
  wallets: {
    title: 'Setup your wallet',
    Icon: WalletsIcon,
    HoverIcon: WalletsFilledIcon,
  },
  contacts: {
    title: 'Connect with others',
    Icon: ContactsIcon,
    HoverIcon: ContactsFilledIcon,
  },
}

const BUTTONS_LIST = ['wallets', 'contacts']

const ButtonsContainer = styled.View`
  padding: 20px 0;
  flex-direction: row;
  align-items: center;
  overflow-x: auto;
`

const ButtonWrapper = styled.View`
  margin-right: 20px;
`

type Props = {
  onSelectItem: (item: string) => void,
  onSkip: () => void,
}

export default class CompleteOnboardSession extends Component<Props> {
  render() {
    return (
      <>
        <Text>
          <Text variant="bold">Well done!</Text> Just a couple more steps and
          you will be all set.
        </Text>

        <ButtonsContainer>
          {BUTTONS_LIST.map(item => {
            return (
              <ButtonWrapper key={item}>
                <Button
                  variant="completeOnboarding"
                  {...BUTTONS[item]}
                  onPress={() => {
                    this.props.onSelectItem(item)
                  }}
                />
              </ButtonWrapper>
            )
          })}
          <ButtonWrapper>
            <Button
              theme={{
                fontSize: 9,
                borderColor: 'transparent',
                iconWidth: 8,
                iconHeight: 8,
                iconMargin: 5,
              }}
              variant="completeOnboarding"
              title="SKIP"
              Icon={SkipIcon}
              onPress={this.props.onSkip}
            />
          </ButtonWrapper>
        </ButtonsContainer>
      </>
    )
  }
}
