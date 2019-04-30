// @flow
import React, { Component } from 'react'
import { graphql, createFragmentContainer, QueryRenderer } from 'react-relay'

import { EnvironmentContext } from '../RelayEnvironment'
import RelayLoaderView from '../RelayLoaderView'
import IdentitiesView, { type Identities } from './IdentitiesView'

type RendererProps = {}

type Props = RendererProps & {
  identities: Identities,
}

class IdentitiesScreen extends Component<Props> {
  render() {
    return <IdentitiesView identities={this.props.identities} />
  }
}

const IdentitiesScreenRelayContainer = createFragmentContainer(
  IdentitiesScreen,
  {
    identities: graphql`
      fragment IdentitiesScreen_identities on Identities {
        ...IdentitiesView_identities
      }
    `,
  },
)

export default class IdentitiesScreenRenderer extends Component<{}> {
  static contextType = EnvironmentContext

  render() {
    return (
      <QueryRenderer
        environment={this.context}
        query={graphql`
          query IdentitiesScreenQuery {
            viewer {
              id
              # identities {
              #   ...IdentitiesScreen_identities
              # }
            }
          }
        `}
        variables={{}}
        render={({ error, props }) => {
          if (error || !props) {
            return <RelayLoaderView error={error ? error.message : undefined} />
          } else {
            return (
              <IdentitiesScreenRelayContainer
                {...props.viewer}
                {...this.props}
              />
            )
          }
        }}
      />
    )
  }
}
