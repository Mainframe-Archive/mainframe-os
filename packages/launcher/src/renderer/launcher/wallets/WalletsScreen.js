// @flow
import React, { Component } from 'react'
import { graphql, createFragmentContainer, QueryRenderer } from 'react-relay'

import { EnvironmentContext } from '../RelayEnvironment'
import RelayLoaderView from '../RelayLoaderView'
import WalletsView, { type Wallets } from './WalletsView'

type RendererProps = {}

type Props = RendererProps & {
  wallets: Wallets,
}

class WalletsScreen extends Component<Props> {
  render() {
    return <WalletsView wallets={this.props.wallets} />
  }
}

const WalletsScreenRelayContainer = createFragmentContainer(WalletsScreen, {
  wallets: graphql`
    fragment WalletsScreen_wallets on WalletsQuery {
      ...WalletsView_wallets
    }
  `,
})

export default class WalletsScreenRenderer extends Component<{}> {
  static contextType = EnvironmentContext

  render() {
    return (
      <QueryRenderer
        environment={this.context}
        query={graphql`
          query WalletsScreenQuery {
            viewer {
              wallets {
                ...WalletsScreen_wallets
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
              <WalletsScreenRelayContainer {...props.viewer} {...this.props} />
            )
          }
        }}
      />
    )
  }
}
