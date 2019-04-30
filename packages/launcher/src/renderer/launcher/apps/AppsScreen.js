// @flow
import React, { Component } from 'react'
import { graphql, createFragmentContainer, QueryRenderer } from 'react-relay'

import { EnvironmentContext } from '../RelayEnvironment'
import RelayLoaderView from '../RelayLoaderView'
import AppsView from './AppsView'
import type { AppsScreen_viewer as Viewer } from './__generated__/AppsScreen_viewer.graphql'

// type RendererProps = {}
//
// type Props = RendererProps & {
//   viewer: Viewer,
// }
//
// class AppsScreen extends Component<Props> {
//   render() {
//     return <AppsView viewer={this.props.viewer} />
//   }
// }

const AppsScreenRelayContainer = createFragmentContainer(AppsView, {
  viewer: graphql`
    fragment AppsScreen_viewer on Viewer {
      ...AppsView_viewer
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
              id
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
