// @flow

import React, { Component } from 'react'
import { graphql, createFragmentContainer, QueryRenderer } from 'react-relay'

import { EnvironmentContext } from '../RelayEnvironment'
import RelayLoaderView from '../RelayLoaderView'
import { AppsGrid, renderNewAppButton } from '../apps/AppsView'
import { OwnAppItem } from '../apps/AppItem'
import OwnAppDetailView from './OwnAppDetailView'
import type { OwnAppDetailView_ownApp as OwnApp } from './__generated__/OwnAppDetailView_ownApp.graphql.js'

type Props = {
  apps: {
    own: Array<OwnApp>,
  },
}

type State = {
  selectedApp?: ?OwnApp,
}

class OwnAppsView extends Component<Props, State> {
  state = {}

  onPressCreateApp = () => {}

  onOpenApp = app => {
    this.setState({
      selectedApp: app,
    })
  }

  onCloseAppDetail = () => {
    this.setState({
      selectedApp: undefined,
    })
  }

  render() {
    const { selectedApp } = this.state
    if (selectedApp) {
      return (
        <OwnAppDetailView
          ownApp={selectedApp}
          onClose={this.onCloseAppDetail}
        />
      )
    }
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
        ...OwnAppDetailView_ownApp
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
