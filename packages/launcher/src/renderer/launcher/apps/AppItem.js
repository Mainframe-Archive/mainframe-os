// @flow

import React, { Component } from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import styled from 'styled-components/native'
import { Button, Text } from '@morpheus-ui/core'
import CloseIcon from '@morpheus-ui/icons/Close'

import CircleLoader from '../../UIComponents/CircleLoader'
import type { AppItem_installedApp as InstalledApp } from './__generated__/AppItem_installedApp.graphql.js'
import type { AppItem_ownApp as OwnApp } from './__generated__/AppItem_ownApp.graphql.js'
import AppIcon from './AppIcon'

export const AppShadow = styled.View`
  margin-top: 2px;
  width: 50px;
  height: 1px;
  margin-top: -1px;

  ${props => props.small && `width: 35px;`}
`
const AppButtonContainer = styled.TouchableOpacity`
  position: relative;
  padding: 20px;
  margin-left: 12px;
  flex-direction: column;
  align-items: center;
  width: 110px;
  height: 155px;
  border-radius: 10px;

  ${props =>
    !props.disabled &&
    props.hover &&
    `
    shadow-color: #000;
    shadow-offset: {width: 0, height: 0};
    shadow-opacity: 0.1;
    shadow-radius: 10;
  `}

  ${props => props.disabled && 'cursor: not-allowed;'}
`

const IconContainer = styled.View`
  position: relative;
  width: 72px;
  align-items: center;
  margin-bottom: 15px;
  ${props =>
    !props.disabled &&
    props.hover &&
    `
      margin-top: -3px;
      margin-bottom: 18px;
  `}

  ${props => props.disabled && 'opacity: 0.3;'}
`

const LoaderContainer = styled.View`
  width: 72px;
  height: 72px;
  border-radius: 3px;
  background-color: #0000009e;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 20px;
  left: 19px;
`

const CircleContainer = styled.View`
  width: 45px;
  height: 45px;
  border-radius: 100%;
  background-color: #1b1b1b;
  align-items: center;
  justify-content: center;
`

const UpdateBadge = styled.View`
  position: absolute;
  z-index: 2;
  top: -8px;
  right: -8px;
  width: 19px;
  height: 19px;
  background-color: #da1157;
  border-radius: 100%;
  shadow-color: #000;
  shadow-offset: {width: 0, height: 0};
  shadow-opacity: 0.1;
  shadow-radius: 10;
`

const DeleteBadge = styled.TouchableOpacity`
  position: absolute;
  align-items: center;
  justify-content: center;
  z-index: 2;
  top: 12px;
  right: 12px;
  width: 20px;
  height: 20px;
  background-color: #FFF;
  border-radius: 100%;
  shadow-color: #000;
  shadow-offset: {width: 0, height: 0};
  shadow-opacity: 0.1;
  shadow-radius: 10;
`

const UpdateButton = styled.View`
  opacity: 0;
  position: absolute;
  bottom: 15px;
  ${props => props.hover && 'opacity: 1;'}
`

type SharedProps = {
  editing?: boolean,
  icon?: ?string,
  onOpenApp: (appID: string, own: boolean) => any,
}

type InstalledProps = SharedProps & {
  editing: boolean,
  installedApp: InstalledApp,
  onPressUpdate: (appID: string) => void,
}

type OwnProps = SharedProps & {
  ownApp: OwnApp,
}

type Props = {
  editing?: boolean,
  appID: string,
  appName: string,
  devName: ?string,
  onOpen: () => void,
  onUpdate?: ?() => void,
  testID: string,
  icon?: ?string,
  installing?: ?boolean,
}

type State = {
  direction: string,
  hover: boolean,
}

type MouseEvent = { clientX: number }

export default class AppItem extends Component<Props, State> {
  state = {
    direction: 'no-skew',
    hover: false,
  }

  mousePosition: number = 0

  setDirection = ({ clientX }: MouseEvent): void => {
    if (clientX !== this.mousePosition) {
      const direction =
        clientX > this.mousePosition ? 'skew-right' : 'skew-left'
      this.mousePosition = clientX
      this.setState({
        direction,
      })
    }
  }

  startMoving = ({ clientX }: MouseEvent): void => {
    this.mousePosition = clientX
    this.setState({
      direction: 'no-skew',
    })
  }

  stopMoving = (): void => {
    this.mousePosition = 0
    this.setState({
      direction: 'no-skew',
    })
  }

  setHover = () => {
    this.setState({ hover: true })
  }

  releaseHover = () => {
    this.setState({ hover: false })
  }

  render() {
    const {
      appID,
      appName,
      devName,
      icon,
      onOpen,
      onUpdate,
      testID,
      installing,
      editing,
    } = this.props

    return (
      <AppButtonContainer
        disabled={installing}
        onPress={onOpen}
        key={appID}
        testID={testID}
        hover={this.state.hover}
        onMouseOver={this.setHover}
        onMouseOut={this.releaseHover}>
        <IconContainer
          disabled={installing}
          hover={this.state.hover}
          className={editing ? 'app-editing' : this.state.direction}
          onMouseMove={this.setDirection}
          onMouseOver={this.startMoving}
          onMouseOut={this.stopMoving}>
          <AppIcon url={icon} id={appID} />
          <AppShadow
            className={
              this.state.hover ? 'app-shadow app-shadow-hover' : 'app-shadow'
            }
          />
          {!installing && !editing && onUpdate && <UpdateBadge />}
        </IconContainer>
        {editing && (
          <DeleteBadge>
            <CloseIcon
              color={this.state.hover ? '#DA1157' : '#000000'}
              width={10}
              height={10}
            />
          </DeleteBadge>
        )}
        <Text
          variant={[
            'appButtonName',
            'ellipsis',
            installing ? 'opacity50' : '',
          ]}>
          {appName}
        </Text>
        <Text variant="appButtonId">{devName}</Text>
        {onUpdate && (
          <UpdateButton className="transition" hover={this.state.hover}>
            <Button
              onPress={onUpdate}
              title="UPDATE"
              variant={['updateButton']}
            />
          </UpdateButton>
        )}
        {installing ? (
          <LoaderContainer>
            <CircleContainer>
              <CircleLoader />
            </CircleContainer>
          </LoaderContainer>
        ) : null}
      </AppButtonContainer>
    )
  }
}

const InstalledView = (props: InstalledProps) => {
  const app = props.installedApp

  const onOpen = () => {
    props.onOpenApp(app.localID, false)
  }
  const onUpdate =
    app.update == null
      ? undefined
      : () => {
          props.onPressUpdate(app.localID)
        }

  return (
    <AppItem
      editing={props.editing}
      installing={app.installationState === 'DOWNLOADING'}
      icon={props.icon}
      appID={app.mfid}
      appName={app.name}
      devName={app.manifest.author.name}
      onOpen={onOpen}
      onUpdate={onUpdate}
      testID="installed-app-item"
    />
  )
}

const OwnView = (props: OwnProps) => {
  const app = props.ownApp
  const onOpen = () => {
    props.onOpenApp(app.localID, true)
  }

  return (
    <AppItem
      editing={props.editing}
      appID={app.mfid}
      appName={app.name}
      devName={app.developer.name}
      onOpen={onOpen}
      testID="own-app-item"
    />
  )
}

export const InstalledAppItem = createFragmentContainer(InstalledView, {
  installedApp: graphql`
    fragment AppItem_installedApp on App {
      mfid
      localID
      name
      installationState
      manifest {
        author {
          id
          name
        }
      }
      update {
        manifest {
          version
        }
      }
    }
  `,
})

export const OwnAppItem = createFragmentContainer(OwnView, {
  ownApp: graphql`
    fragment AppItem_ownApp on OwnApp {
      mfid
      localID
      name
      developer {
        id
        name
      }
    }
  `,
})
