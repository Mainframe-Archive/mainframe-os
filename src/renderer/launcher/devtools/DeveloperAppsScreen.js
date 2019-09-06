// @flow

import { Text } from '@morpheus-ui/core'
import React, { useCallback, useState } from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { type Match, Redirect, type RouterHistory } from 'react-router'
import styled from 'styled-components/native'

import { ROUTES } from '../constants'

import RelayRenderer from '../RelayRenderer'
import { OwnAppItem } from '../apps/AppItem'
import AppsGrid from '../apps/AppsGrid'
import NewAppButton from '../apps/NewAppButton'
import CreateAppModal from './CreateAppModal'

import type { DeveloperAppsScreen_developer as Developer } from './__generated__/DeveloperAppsScreen_developer.graphql'
import type { DeveloperAppsScreenQueryResponse as QueryResponse } from './__generated__/DeveloperAppsScreenQuery.graphql'

const Container = styled.View`
  flex: 1;
  padding: 36px 48px 36px 48px;
`

const ScrollView = styled.ScrollView`
  margin-top: -15px;
`

type Props = {
  developer: Developer,
  history: RouterHistory,
}

function Apps(props: Props) {
  const [showModal, toggleModal] = useState(false)

  const openModal = useCallback(() => {
    toggleModal(true)
  }, [])
  const closeModal = useCallback(() => {
    toggleModal(false)
  }, [])

  if (showModal) {
    return (
      // eslint-disable-next-line react/prop-types
      <CreateAppModal
        developer={props.developer}
        onAppCreated={closeModal}
        onRequestClose={closeModal}
      />
    )
  }

  const apps = props.developer.apps.map(a => {
    const onOpen = () => {
      props.history.push(ROUTES.DEVTOOLS_APP_DETAILS.replace(':appID', a.id))
    }
    // $FlowFixMe: injected fragment type
    return <OwnAppItem key={a.id} ownApp={a} onOpenApp={onOpen} />
  })

  return (
    <Container>
      <Text variant={['smallTitle', 'blue', 'bold']}>My Apps</Text>
      <ScrollView>
        <AppsGrid>{apps}</AppsGrid>
        <NewAppButton
          title="ADD"
          onPress={openModal}
          testID="launcher-create-app-button"
        />
      </ScrollView>
    </Container>
  )
}

const RelayContainer = createFragmentContainer(Apps, {
  developer: graphql`
    fragment DeveloperAppsScreen_developer on OwnDeveloper {
      ...CreateAppModal_developer
      apps {
        ...AppItem_ownApp
        id
      }
    }
  `,
})

type ScreenProps = {
  match: Match,
  history: RouterHistory,
}

export default function DevelopersAppsScreen(screenProps: ScreenProps) {
  return (
    <RelayRenderer
      render={({ props }: { props?: ?QueryResponse }) => {
        if (props == null) {
          return null
        }
        // eslint-disable-next-line react/prop-types
        return props.developer == null ? (
          <Redirect to={ROUTES.DEVTOOLS_DEVELOPER_CREATE} />
        ) : (
          <RelayContainer {...props} history={screenProps.history} />
        )
      }}
      query={graphql`
        query DeveloperAppsScreenQuery($developerID: ID!) {
          developer: node(id: $developerID) {
            ... on OwnDeveloper {
              ...DeveloperAppsScreen_developer
            }
          }
        }
      `}
      variables={{ developerID: screenProps.match.params.developerID }}
    />
  )
}
