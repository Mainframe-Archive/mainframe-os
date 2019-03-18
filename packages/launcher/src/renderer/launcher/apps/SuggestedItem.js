// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Text, Button } from '@morpheus-ui/core'
import AppIcon from './AppIcon'
import { AppShadow } from './AppItem'

const AppButtonContainer = styled.TouchableOpacity`
  padding: 20px;
  margin-left: 12px;
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
  ${props =>
    props.hover &&
    `
    margin-top: -3px;
    margin-bottom: 3px;
  `}
`

export type SuggestedAppData = {
  hash: string,
  mfid: string,
  icon?: ?string,
  name: string,
  description?: ?string,
  longDescription?: ?string,
}

type Props = {
  appData: SuggestedAppData,
  onOpen: (app: Object) => void,
  onPressInstall: (hash: string, icon?: ?string) => void,
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
    this.props.onOpen(this.props.appData)
  }

  onPressInstall = () => {
    this.props.onPressInstall(this.props.appData.hash)
  }
  render() {
    const { hash, name, description, icon, mfid } = this.props.appData
    return (
      <AppButtonContainer
        className="transition"
        hover={this.state.hover}
        onMouseOver={this.toggleHover}
        onMouseOut={this.toggleHover}
        onPress={this.onOpen}
        key={hash}>
        <IconContainer className="transition" hover={this.state.hover}>
          <AppIcon url={icon} id={mfid} />
          <AppShadow
            className={
              this.state.hover ? 'app-shadow app-shadow-hover' : 'app-shadow'
            }
          />
        </IconContainer>
        <DataContainer>
          <Text variant="suggestedAppButtonName">{name}</Text>
          <Text variant="suggestedAppDescription">{description}</Text>
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
