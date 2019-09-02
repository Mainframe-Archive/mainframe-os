// @flow

import { Text, Button } from '@morpheus-ui/core'
import { clipboard } from 'electron'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { useToast } from './ToastContext'

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

type Props = {
  value: string,
  variant?: string | Array<string>,
  noStyles?: boolean,
}

export default function CopyableBlock(props: Props) {
  const showMessage = useToast()

  const onCopy = useCallback(() => {
    clipboard.writeText(props.value)
    showMessage('Copied to clipboard')
  }, [])

  return (
    <Container noStyles={props.noStyles}>
      <TextContainer>
        <Text variant={props.variant || 'copyableBlock'}>{props.value}</Text>
      </TextContainer>
      <ButtonContainer>
        <Button
          title="COPY"
          onPress={onCopy}
          variant={['small', 'completeOnboarding']}
        />
      </ButtonContainer>
    </Container>
  )
}
