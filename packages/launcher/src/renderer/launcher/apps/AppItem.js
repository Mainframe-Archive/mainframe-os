// @flow

import React, { Component } from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import styled from 'styled-components/native'
import { Button, Text } from '@morpheus-ui/core'

import type { AppItem_installedApp as InstalledApp } from './__generated__/AppItem_installedApp.graphql.js'
import type { AppItem_ownApp as OwnApp } from './__generated__/AppItem_ownApp.graphql.js'
import AppIcon from './AppIcon'

const AppButtonContainer = styled.View`
  padding: 15px 10px;
  flex-direction: column;
  align-items: center;
  width: 110px;
`

const IconContainer = styled.TouchableOpacity`
  width: 72px;
  height: 72px;
  margin-bottom: 10px;
`

type SharedProps = {
  onOpenApp: (appID: string, own: boolean) => any,
}

type InstalledProps = SharedProps & {
  installedApp: InstalledApp,
  onPressUpdate: (appID: string) => void,
}

type OwnProps = SharedProps & {
  ownApp: OwnApp,
}

type SuggestedProps = {
  appID: string,
  mfid: string,
  appName: string,
  devName: string,
  onOpen: (appID: string) => void,
}

type Props = {
  appID: string,
  appName: string,
  devName: ?string,
  onOpen: () => void,
  onUpdate?: ?() => void,
  testID: string,
}

type State = {
  direction: string,
}

type MouseEvent = { clientX: number }

export default class AppItem extends Component<Props, State> {
  state = {
    direction: 'no-skew',
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

  render() {
    const { appID, appName, devName, onOpen, onUpdate, testID } = this.props

    let extra = null
    if (onUpdate != null) {
      extra = (
        <Button
          onPress={onUpdate}
          title="UPDATE"
          variant={['marginTop5', 'mediumUppercase', 'red']}
        />
      )
    } else if (devName != null) {
      extra = <Text variant="appButtonId">{devName}</Text>
    }

    return (
      <AppButtonContainer key={appID}>
        <IconContainer
          className={this.state.direction}
          onMouseMove={this.setDirection}
          onMouseOver={this.startMoving}
          onMouseOut={this.stopMoving}
          onPress={onOpen}
          testID={testID}>
          <AppIcon id={appID} />
        </IconContainer>
        <Text variant="appButtonName">{appName}</Text>
        {extra}
      </AppButtonContainer>
    )
  }
}

export const SuggestedAppItem = (props: SuggestedProps) => {
  const onOpen = () => {
    props.onOpen(props.appID)
  }

  return (
    <AppItem
      appID={props.mfid}
      appName={props.appName}
      devName={props.devName}
      onOpen={onOpen}
      testID="suggested-app-item"
    />
  )
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
