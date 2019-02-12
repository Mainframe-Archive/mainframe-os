// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Text } from '@morpheus-ui/core'

const Container = styled.View`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

class NotificationsScreen extends Component<{}> {
  render() {
    return (
      <Container>
        <Text>{'This feature is coming soon. Sign up here for updates.'}</Text>
      </Container>
    )
  }
}

export default NotificationsScreen
