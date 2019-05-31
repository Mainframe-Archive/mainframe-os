// @flow

import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { graphql } from 'relay-runtime'
import styled from 'styled-components/native'

import { ROUTES } from './constants'
import { useSubscription } from './RelayEnvironment'

import SideMenu from './SideMenu'
import ContactsScreen from './contacts/ContactsScreen'
import DevtoolsRouter from './devtools/Router'
import SettingsRouter from './settings/Router'
import WalletsScreen from './wallets/WalletsScreen'

const CONTACT_CHANGED_SUBSCRIPTION = graphql`
  subscription HomeRouterContactChangedSubscription {
    contactChanged {
      contact {
        localID
        peerID
        publicID
        connectionState
        invite {
          ethNetwork
          inviteTX
          stake {
            reclaimedTX
            amount
            state
          }
        }
        profile {
          name
          ethAddress
        }
      }
    }
  }
`

const Container = styled.View`
  flex-direction: row;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`

const ContentContainer = styled.View`
  min-width: 600px;
  flex: 1;
`

export default function HomeRouter() {
  useSubscription(CONTACT_CHANGED_SUBSCRIPTION)

  return (
    <Container testID="launcher-view">
      <SideMenu />
      <ContentContainer>
        <Switch>
          <Route path={ROUTES.APPS} component={() => <h1>Apps</h1>} />
          <Route path={ROUTES.CONTACTS} component={ContactsScreen} />
          <Route path={ROUTES.DEVTOOLS} component={DevtoolsRouter} />
          <Route path={ROUTES.WALLETS} component={WalletsScreen} />
          <Route path={ROUTES.SETTINGS} component={SettingsRouter} />
          <Redirect to={ROUTES.APPS} />
        </Switch>
      </ContentContainer>
    </Container>
  )
}
