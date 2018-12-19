// @flow
import React, { Component } from 'react'
import { graphql, createFragmentContainer, QueryRenderer } from 'react-relay'

import { EnvironmentContext } from '../RelayEnvironment'
import RelayLoaderView from '../RelayLoaderView'
import AppsView, { type Apps } from './AppsView'

type RendererProps = {}

type Props = RendererProps & {
  apps: Apps,
}

class AppsScreen extends Component<Props> {
  render() {
    return <AppsView apps={this.props.apps} />
  }
}

const AppsScreenRelayContainer = createFragmentContainer(AppsScreen, {
  apps: graphql`
    fragment AppsScreen_apps on AppsQuery {
      ...AppsView_apps
    }
  `,
})

export default class AppsScreenRenderer extends Component<{}> {
  static contextType = EnvironmentContext

  render() {
    return (
      <QueryRenderer
        environment={this.context}
        query={graphql`
          query AppsScreenQuery {
            viewer {
              apps {
                ...AppsScreen_apps
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
              <AppsScreenRelayContainer {...props.viewer} {...this.props} />
            )
          }
        }}
      />
    )
  }
}
