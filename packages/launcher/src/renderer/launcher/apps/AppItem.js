// @flow

import React, { Component } from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import type { AppInstalledData } from '@mainframe/client'
import styled from 'styled-components/native'
import { Text } from '@morpheus-ui/core'
import type OwnApp from '../settings/__generated__/OwnAppDetailView_ownApp.graphql.js'
import AppIcon from './AppIcon'

const AppButtonContainer = styled.TouchableOpacity`
  padding: 15px 10px;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 110px;
`

const IconContainer = styled.View`
  width: 72px;
  height: 72px;
  margin-bottom: 10px;
`

type SharedProps = {
  onOpenApp: (app: AppInstalledData | OwnApp, own: boolean) => any,
}

type InstalledProps = SharedProps & {
  installedApp: AppInstalledData,
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
  devName: string,
  onOpen: () => void,
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
    const { appID, appName, devName, onOpen, testID } = this.props
    return (
      <AppButtonContainer onPress={onOpen} key={appID} testID={testID}>
        <IconContainer
          className={this.state.direction}
          onMouseMove={this.setDirection}
          onMouseOver={this.startMoving}
          onMouseOut={this.stopMoving}>
          <AppIcon id={appID} />
        </IconContainer>
        <Text variant="appButtonName">{appName}</Text>
        <Text variant="appButtonId">{devName}</Text>
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
    props.onOpenApp(app, false)
  }

  return (
    <AppItem
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
