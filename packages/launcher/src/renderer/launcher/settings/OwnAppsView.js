// @flow

import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import { Text } from '@morpheus-ui/core'
import { graphql, createFragmentContainer, QueryRenderer } from 'react-relay'
import type { AppOwnData } from '@mainframe/client'

import { EnvironmentContext } from '../RelayEnvironment'
import RelayLoaderView from '../RelayLoaderView'
import { AppsGrid, renderNewAppButton } from '../apps/AppsView'
import { OwnAppItem } from '../apps/AppItem'

type Props = {
  apps: {
    own: Array<AppOwnData>,
  },
}

const Container = styled.View`
  padding: 10px;
`

class OwnAppsView extends Component<Props> {
  onPressCreateApp = () => {
    console.log('create app')
  }

  onOpenApp = app => {
    console.log('open app')
  }

  render() {
    const apps = this.props.apps.own.map(a => {
      const onOpen = () => this.onOpenApp(a)
      return <OwnAppItem key={a.localID} ownApp={a} onOpenApp={onOpen} />
    })
    const createButton = renderNewAppButton(
      'NEW APP',
      this.onPressCreateApp,
      'launcher-create-app-button',
    )
    return (
      <AppsGrid>
        {apps}
        {createButton}
      </AppsGrid>
    )
  }
}

const OwnAppsViewRelayContainer = createFragmentContainer(OwnAppsView, {
  apps: graphql`
    fragment OwnAppsView_apps on Apps {
      own {
        localID
        name
        ...AppItem_ownApp
      }
    }
  `,
})

export default class OwnAppsViewRenderer extends Component<{}> {
  static contextType = EnvironmentContext

  render() {
    return (
      <QueryRenderer
        environment={this.context}
        query={graphql`
          query OwnAppsViewQuery {
            viewer {
              apps {
                ...OwnAppsView_apps
              }
            }
          }
        `}
        variables={{}}
        render={({ error, props }) => {
          if (error || !props) {
            return <RelayLoaderView error={error ? error.message : undefined} />
          } else {
            return (
              <OwnAppsViewRelayContainer {...props.viewer} {...this.props} />
            )
          }
        }}
      />
    )
  }
}
