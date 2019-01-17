// @flow
import React, { Component } from 'react'
import {
  graphql,
  createFragmentContainer,
  // $FlowFixMe: missing requestSubscription type even though it is exported
  requestSubscription,
  QueryRenderer,
  type Disposable,
} from 'react-relay'

import { EnvironmentContext } from '../RelayEnvironment'
import RelayLoaderView from '../RelayLoaderView'
import AppsView, { type Apps } from './AppsView'

const subscription = graphql`
  subscription AppsScreenAppCreatedSubscription {
    appCreated {
      name
    }
  }
`

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

  _subscription: ?Disposable

  componentDidMount() {
    this._subscription = requestSubscription(this.context, {
      subscription,
      onNext: payload => {
        // eslint-disable-next-line no-console
        console.log('subscription update', payload)
      },
    })
  }

  componentWillUnmount() {
    if (this._subscription != null) {
      this._subscription.dispose()
    }
  }

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
