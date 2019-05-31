// @flow

import { Text } from '@morpheus-ui/core'
import React, { useCallback, useState } from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { type Match, Redirect } from 'react-router-dom'
import styled from 'styled-components/native'

import { ROUTES } from '../constants'

import RelayRenderer from '../RelayRenderer'
import { AppsGrid, NewAppButton } from '../apps/AppsView'
import { OwnAppItem } from '../apps/AppItem'
import CreateAppModal from './CreateAppModal'
// import OwnAppDetailView from './OwnAppDetailView'

import type { OwnAppsScreen_devtools as Devtools } from './__generated__/OwnAppsScreen_devtools.graphql'
import type { OwnAppsScreenQueryResponse as QueryResponse } from './__generated__/OwnAppsScreenQuery.graphql'

type Props = {
  developerID: ?string,
  devtools: Devtools,
  onOpenMenu: () => void,
}

// TODO: merge these 2 containers

const Container = styled.View`
  flex: 1;
  padding-top: 36px;
`

const AppsContainer = styled.View`
  flex: 1;
  margin-top: 10px;
  padding: 0 48px 36px 48px;
`

// const Nav = styled.View`
//   padding-left: 48px;
//   flex-direction: row;
// `
// const NavItem = styled.TouchableOpacity`
//   flex-direction: row;
//   align-items: center;
// `

const ScrollView = styled.ScrollView`
  margin-top: -15px;
`

// class AppsView extends Component<Props, State> {
//   state = {}
//
//   onPressCreateApp = () => {
//     this.setState({ createModal: true })
//   }
//
//   onCloseModal = () => {
//     this.setState({ createModal: false })
//   }
//
//   onOpenApp = (appID: string) => {
//     this.setState({ selectedAppID: appID })
//   }
//
//   onCloseAppDetail = () => {
//     this.setState({ selectedAppID: undefined })
//   }
//
//   render() {
//     // if (this.state.createModal) {
//     //   return (
//     //     <CreateAppModal
//     //       onAppCreated={this.onCloseModal}
//     //       onRequestClose={this.onCloseModal}
//     //     />
//     //   )
//     // }
//
//     const apps = this.props.apps.own.map(a => {
//       const onOpen = () => this.onOpenApp(a.localID)
//       // $FlowFixMe: injected fragment type
//       return <OwnAppItem key={a.localID} ownApp={a} onOpenApp={onOpen} />
//     })
//   }
// }

function Apps(props: Props) {
  const [showModal, toggleModal] = useState(false)

  const openModal = useCallback(() => {
    toggleModal(true)
  }, [])
  const closeModal = useCallback(() => {
    toggleModal(false)
  }, [])

  if (props.developerID != null && showModal) {
    return (
      <CreateAppModal
        developerID={props.developerID}
        onAppCreated={closeModal}
        onRequestClose={closeModal}
      />
    )
  }

  const apps = props.devtools.apps.map(a => {
    const onOpen = () => {
      console.log('open app', a.localID)
    }
    // $FlowFixMe: injected fragment type
    return <OwnAppItem key={a.localID} ownApp={a} onOpenApp={onOpen} />
  })

  return (
    <Container>
      <AppsContainer>
        <Text variant={['smallTitle', 'blue', 'bold']}>My Apps</Text>
        <ScrollView>
          <AppsGrid>{apps}</AppsGrid>
          {props.developerID ? (
            <NewAppButton
              title="ADD"
              onPress={openModal}
              testID="launcher-create-app-button"
            />
          ) : null}
        </ScrollView>
      </AppsContainer>
    </Container>
  )
}

const RelayContainer = createFragmentContainer(Apps, {
  devtools: graphql`
    fragment OwnAppsScreen_devtools on Devtools
      @argumentDefinitions(developerID: { type: "ID" }) {
      apps(developerID: $developerID) {
        ...AppItem_ownApp
        localID
      }
    }
  `,
})

type ScreenProps = {
  match: Match,
}

// TODO: should this screen always be scoped to a specific developer?
// Might be easier to avoid various possible states

export default function OwnAppsScreen(props: ScreenProps) {
  const { developerID } = props.match.params

  return (
    <RelayRenderer
      render={({ props }: { props?: ?QueryResponse }) => {
        if (props == null) {
          return null
        }
        return props.devtools.developers.length > 0 ? (
          <RelayContainer developerID={developerID} {...props} />
        ) : (
          <Redirect to={ROUTES.DEVTOOLS_DEVELOPERS_CREATE} />
        )
      }}
      query={graphql`
        query OwnAppsScreenQuery($developerID: ID) {
          devtools {
            ...OwnAppsScreen_devtools @arguments(developerID: $developerID)
            developers {
              id
            }
          }
        }
      `}
      variables={{ developerID }}
    />
  )
}
