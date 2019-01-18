// @flow
import React, { Component } from 'react'
import { graphql, createFragmentContainer, QueryRenderer } from 'react-relay'

import { EnvironmentContext } from '../RelayEnvironment'
import LauncherContext from '../LauncherContext'
import RelayLoaderView from '../RelayLoaderView'
import WalletsView, { type Wallets } from './WalletsView'

type RendererProps = {
  userID: string,
}

type Props = RendererProps & {
  wallets: Wallets,
}

class WalletsScreen extends Component<Props> {
  render() {
    return (
      <WalletsView userID={this.props.userID} wallets={this.props.wallets} />
    )
  }
}

const WalletsScreenRelayContainer = createFragmentContainer(WalletsScreen, {
  wallets: graphql`
    fragment WalletsScreen_wallets on WalletsQuery
      @argumentDefinitions(userID: { type: "String!" }) {
      ...WalletsView_wallets @arguments(userID: $userID)
    }
  `,
})

export class WalletsScreenRenderer extends Component<RendererProps> {
  static contextType = EnvironmentContext

  render() {
    return (
      <QueryRenderer
        environment={this.context}
        query={graphql`
          query WalletsScreenQuery($userID: String!) {
            viewer {
              wallets {
                ...WalletsScreen_wallets @arguments(userID: $userID)
              }
            }
          }
        `}
        variables={{ userID: this.props.userID }}
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

export default class WalletsScreenContextWrapper extends Component<{}> {
  static contextType = LauncherContext
  render() {
    return <WalletsScreenRenderer userID={this.context.userID} />
  }
}
