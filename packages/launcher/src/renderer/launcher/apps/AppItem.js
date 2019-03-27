// @flow

import React, { Component } from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import type { AppInstalledData } from '@mainframe/client'
import styled from 'styled-components/native'
import { Text } from '@morpheus-ui/core'
import type OwnApp from '../settings/__generated__/OwnAppDetailView_ownApp.graphql.js'
import AppIcon from './AppIcon'

export const AppShadow = styled.View`
  margin-top: 2px;
  width: 50px;
  height: 1px;
  margin-top: -1px;

  ${props => props.small && `width: 35px;`}
`

const AppButtonContainer = styled.TouchableOpacity`
  padding: 20px;
  margin-left: 12px;
  flex-direction: column;
  align-items: center;
  width: 110px;
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

const IconContainer = styled.View`
  width: 72px;
  align-items: center;
  margin-bottom: 15px;
  ${props =>
    props.hover &&
    `
      margin-top: -3px;
      margin-bottom: 18px;
  `}
`

type SharedProps = {
  icon?: ?string,
  onOpenApp: (app: AppInstalledData | OwnApp, own: boolean) => any,
}

type InstalledProps = SharedProps & {
  installedApp: AppInstalledData,
}

type OwnProps = SharedProps & {
  ownApp: OwnApp,
}

type Props = {
  appID: string,
  appName: string,
  devName: string,
  onOpen: () => void,
  testID: string,
  icon?: ?string,
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

  toggleHover = () => {
    this.setState({ hover: !this.state.hover })
  }

  render() {
    const { appID, appName, devName, onOpen, testID, icon } = this.props
    return (
      <AppButtonContainer
        onPress={onOpen}
        key={appID}
        testID={testID}
        className="transition"
        hover={this.state.hover}
        onMouseOver={this.toggleHover}
        onMouseOut={this.toggleHover}>
        <IconContainer
          hover={this.state.hover}
          className={this.state.direction}
          onMouseMove={this.setDirection}
          onMouseOver={this.startMoving}
          onMouseOut={this.stopMoving}>
          <AppIcon url={icon} id={appID} />
          <AppShadow
            className={
              this.state.hover ? 'app-shadow app-shadow-hover' : 'app-shadow'
            }
          />
        </IconContainer>
        <Text variant={['appButtonName', 'ellipsis']}>{appName}</Text>
        <Text variant="appButtonId">{devName}</Text>
      </AppButtonContainer>
    )
  }
}

const InstalledView = (props: InstalledProps) => {
  const app = props.installedApp
  const onOpen = () => {
    props.onOpenApp(app, false)
  }
  return (
    <AppItem
      icon={props.icon}
      appID={app.mfid}
      appName={app.name}
      devName={app.manifest.author.name}
      onOpen={onOpen}
      testID="installed-app-item"
    />
  )
}

const OwnView = (props: OwnProps) => {
  const app = props.ownApp
  const onOpen = () => {
    props.onOpenApp(app, true)
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
        permissions {
          optional {
            WEB_REQUEST
            BLOCKCHAIN_SEND
          }
          required {
            WEB_REQUEST
            BLOCKCHAIN_SEND
          }
        }
        author {
          id
          name
        }
      }
      users {
        localID
        identity {
          profile {
            name
          }
        }
        settings {
          permissionsSettings {
            permissionsChecked
            grants {
              BLOCKCHAIN_SEND
              WEB_REQUEST {
                granted
                denied
              }
            }
          }
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
      versions {
        version
        permissions {
          optional {
            WEB_REQUEST
            BLOCKCHAIN_SEND
          }
          required {
            WEB_REQUEST
            BLOCKCHAIN_SEND
          }
        }
      }
      users {
        localID
        identity {
          profile {
            name
          }
        }
      }
    }
  `,
})
