// @flow

import React, { Component } from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import type { AppOwnData, AppInstalledData } from '@mainframe/client'
import styled from 'styled-components/native'

import { Text } from '@morpheus-ui/core'

const AppButtonContainer = styled.TouchableOpacity`
  padding: 15px 10px;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 110px;
`

const AppIcon = styled.View`
  width: 72px;
  height: 72px;
  background-color: #232323;
  border-radius: 5px;
  margin-bottom: 10px;
`

type AppData = AppOwnData | AppInstalledData

type SharedProps = {
  onOpenApp: (app: AppData, own: boolean) => any,
}

type InstalledProps = SharedProps & {
  installedApp: AppInstalledData,
}

type OwnProps = SharedProps & {
  ownApp: AppData,
}

type Props = SharedProps & {
  app: AppData | AppInstalledData,
  isOwn?: boolean,
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
    const { app, isOwn, onOpenApp } = this.props
    const open = () => onOpenApp(app, !!isOwn)
    const testID = isOwn ? 'own-app-item' : 'installed-app-item'
    // $FlowFixMe: app type
    const devName = isOwn ? app.developer.name : app.manifest.author.name
    return (
      <AppButtonContainer onPress={open} key={app.localID} testID={testID}>
        <AppIcon
          className={this.state.direction}
          onMouseMove={this.setDirection}
          onMouseOver={this.startMoving}
          onMouseOut={this.stopMoving}
        />
        <Text variant="appButtonName">{app.name}</Text>
        <Text variant="appButtonId">{devName}</Text>
      </AppButtonContainer>
    )
  }
}

const InstalledView = (props: InstalledProps) => (
  <AppItem app={props.installedApp} onOpenApp={props.onOpenApp} />
)
const OwnView = (props: OwnProps) => (
  <AppItem app={props.ownApp} onOpenApp={props.onOpenApp} isOwn />
)

export const InstalledAppItem = createFragmentContainer(InstalledView, {
  installedApp: graphql`
    fragment AppItem_installedApp on App {
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
