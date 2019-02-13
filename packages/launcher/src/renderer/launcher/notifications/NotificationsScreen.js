// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Text, Button } from '@morpheus-ui/core'
import { shell } from 'electron'

const Container = styled.View`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

class NotificationsScreen extends Component<{}> {
  openLink() {
    shell.openExternal('https://mainframe.com/developers/')
  }
  render() {
    return (
      <Container>
        <Text variant={['grey']}>{'This feature is coming soon.'}</Text>
        <Text variant={['grey', 'marginBottom10']}>
          {'Sign up to receive the latest Mainframe OS updates.'}
        </Text>
        <Button
          title="GO TO SIGN UP PAGE"
          variant={['small', 'redOutline']}
          onPress={this.openLink}
        />
      </Container>
    )
  }
}

export default NotificationsScreen
