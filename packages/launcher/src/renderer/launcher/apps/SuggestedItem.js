// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Text, Button } from '@morpheus-ui/core'
import AppIcon from './AppIcon'
import { AppShadow } from './AppItem'

const AppButtonContainer = styled.TouchableOpacity`
  padding: 20px;
  margin-left: 5px;
  flex-direction: row;
  border-radius: 10px;

  ${props =>
    props.hover &&
    `
    shadow-color: #000;
    shadow-offset: {width: 0, height: 0};
    shadow-opacity: 0.1;
    shadow-radius: 10;
  `}
`

const DataContainer = styled.View`
  flex-direction: column;
  justify-content: space-between;
  width: 80px;
  margin-left: 20px;
`

const IconContainer = styled.View`
  width: 72px;
  align-items: center;
`

type Props = {
  appID: string,
  mfid: string,
  appName: string,
  description: string,
  onOpen: (appID: string) => void,
  onPressInstall: (appID: string) => void,
}

type State = {
  hover: boolean,
}

export default class SuggestedItem extends Component<Props, State> {
  state = { hover: false }

  toggleHover = () => {
    this.setState({ hover: !this.state.hover })
  }

  onOpen = () => {
    this.props.onOpen(this.props.appID)
  }

  onPressInstall = () => {
    this.props.onPressInstall(this.props.appID)
  }
  render() {
    const { appID, appName, description } = this.props
    return (
      <AppButtonContainer
        className="transition"
        hover={this.state.hover}
        onMouseOver={this.toggleHover}
        onMouseOut={this.toggleHover}
        onPress={this.onOpen}
        key={appID}>
        <IconContainer>
          <AppIcon id={appID} />
          <AppShadow
            className={
              this.state.hover ? 'app-shadow app-shadow-hover' : 'app-shadow'
            }
          />
        </IconContainer>
        <DataContainer>
          <Text variant="suggestedAppButtonName">{appName}</Text>
          <Text variant="suggestedAppButtonId">{description}</Text>
          <Button
            title="INSTALL"
            onPress={this.onPressInstall}
            variant={['xSmall', 'suggestedInstall']}
          />
        </DataContainer>
      </AppButtonContainer>
    )
  }
}
