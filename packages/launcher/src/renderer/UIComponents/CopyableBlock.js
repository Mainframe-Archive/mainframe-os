//@flow

import React, { Component } from 'react'
import { Text, Button } from '@morpheus-ui/core'
import { clipboard } from 'electron'
import styled from 'styled-components/native'

import LauncherContext from '../launcher/LauncherContext'

type Props = {
  value: string,
  variant?: string | Array<string>,
  noStyles?: boolean,
  showAlert: (message: string) => void,
}

type State = {
  copied?: boolean,
}

const Container = styled.View`
  position: relative;
  flex-direction: row;
  align-items: center;
  ${props =>
    !props.noStyles &&
    `background-color: #f9f9f9;
     border-radius: 3px;`}
`

const TextContainer = styled.View`
  flex: 1;
`

const ButtonContainer = styled.View`
  padding: 20px;
`

class CopyableBlock extends Component<Props, State> {
  state = {}

  onCopy = () => {
    clipboard.writeText(this.props.value)
    this.props.showAlert('Copied to clipboard')
  }

  render() {
    return (
      <Container noStyles={this.props.noStyles}>
        <TextContainer>
          <Text variant={this.props.variant || 'copyableBlock'}>
            {this.props.value}
          </Text>
        </TextContainer>
        <ButtonContainer>
          <Button
            title="COPY"
            onPress={this.onCopy}
            variant={['small', 'completeOnboarding']}
          />
        </ButtonContainer>
      </Container>
    )
  }
}

export default LauncherContext(CopyableBlock)
