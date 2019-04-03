// @flow

import React, { Component } from 'react'
import { graphql, createFragmentContainer, QueryRenderer } from 'react-relay'
import { Text } from '@morpheus-ui/core'
import styled from 'styled-components/native'

import { EnvironmentContext } from '../RelayEnvironment'
import RelayLoaderView from '../RelayLoaderView'
import { AppsGrid, NewAppButton } from '../apps/AppsView'
import { OwnAppItem } from '../apps/AppItem'
import CreateAppModal from './CreateAppModal'
import CreateDevIdentityView from './CreateDevIdentityView'
import OwnAppDetailView from './OwnAppDetailView'

import type { OwnAppsView_apps as Apps } from './__generated__/OwnAppsView_apps.graphql'
import type { OwnAppsView_identities as Identities } from './__generated__/OwnAppsView_identities.graphql'

type Props = {
  identities: Identities,
  apps: Apps,
}

type State = {
  selectedAppID?: ?string,
  createModal?: boolean,
}

const Container = styled.View`
  flex: 1;
  padding: 0 5px;
`
const ScrollView = styled.ScrollView``

class OwnAppsView extends Component<Props, State> {
  state = {}

  onPressCreateApp = () => {
    this.setState({ createModal: true })
  }

  onCloseModal = () => {
    this.setState({ createModal: false })
  }

  onOpenApp = (appID: string) => {
    this.setState({ selectedAppID: appID })
  }

  onCloseAppDetail = () => {
    this.setState({ selectedAppID: undefined })
  }

  render() {
    if (!this.props.identities.ownDevelopers.length) {
      return <CreateDevIdentityView />
    }

    if (this.state.createModal) {
      return (
        <CreateAppModal
          onAppCreated={this.onCloseModal}
          onRequestClose={this.onCloseModal}
        />
      )
    }

    if (this.state.selectedAppID) {
      const app = this.props.apps.own.find(
        app => app.localID === this.state.selectedAppID,
      )
      if (app != null) {
        return <OwnAppDetailView ownApp={app} onClose={this.onCloseAppDetail} />
      }
    }

    const apps = this.props.apps.own.map(a => {
      const onOpen = () => this.onOpenApp(a.localID)
      // $FlowFixMe: injected fragment type
      return <OwnAppItem key={a.localID} ownApp={a} onOpenApp={onOpen} />
    })

    return (
      <Container>
        <Text variant={['smallTitle', 'blue', 'bold']}>My Apps</Text>
        <ScrollView>
          <AppsGrid>
            {apps}
            <NewAppButton
              title="ADD"
              onPress={this.onPressCreateApp}
              testID="launcher-create-app-button"
            />
          </AppsGrid>
        </ScrollView>
      </Container>
    )
  }
}

const OwnAppsViewRelayContainer = createFragmentContainer(OwnAppsView, {
  identities: graphql`
    fragment OwnAppsView_identities on Identities {
      ownDevelopers {
        localID
      }
    }
  `,
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
              identities {
                ...OwnAppsView_identities
              }
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
