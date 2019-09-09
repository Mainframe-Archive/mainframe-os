// @flow

import { Text } from '@morpheus-ui/core'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components/native'

import PlusIcon from '../../UIComponents/Icons/PlusIcon'

const InstallIcon = styled.View`
  width: 72px;
  height: 72px;
  border-radius: 5px;
  margin-bottom: 10px;
  align-items: center;
  justify-content: center;
  border: 1px solid #a9a9a9;
  ${props => props.hover && 'border: 1px solid #DA1157;'}
`

const AppInstallContainer = styled.TouchableOpacity`
  padding: 20px;
  margin-left: 12px;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 110px;
`

type Props = {
  title: string,
  onPress: () => void,
  testID: string,
}

export default function NewAppButton(props: Props) {
  const [hover, setHover] = useState(false)
  const toggleHover = useCallback(() => {
    setHover(h => !h)
  }, [])

  const color = hover ? '#DA1157' : '#808080'

  return (
    <AppInstallContainer
      onPress={props.onPress}
      testID={props.testID}
      onMouseOver={toggleHover}
      onMouseOut={toggleHover}>
      <InstallIcon hover={hover}>
        <PlusIcon color={color} />
      </InstallIcon>
      <Text
        className="transition"
        theme={{
          width: '72px',
          fontSize: '11px',
          padding: '5px 0',
          color,
          border: hover ? '1px solid #DA1157' : '1px solid #a9a9a9',
          borderRadius: '3px',
          textAlign: 'center',
        }}>
        {props.title}
      </Text>
    </AppInstallContainer>
  )
}
