// @flow

import React, { useState } from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { graphql } from 'relay-runtime'
import styled from 'styled-components/native'

import { ROUTES } from './constants'
import { useSubscription } from './RelayEnvironment'

import SideMenu, { type MenuBadges } from './SideMenu'
import AppsScreen from './apps/AppsScreen'
import ContactsScreen from './contacts/ContactsScreen'
import DevtoolsRouter from './devtools/DevtoolsRouter'
import SettingsRouter from './settings/SettingsRouter'
import WalletsScreen from './wallets/WalletsScreen'
import type { HomeRouterAppUpdatesChangedSubscriptionResponse as AppUpdatesData } from './__generated__/HomeRouterAppUpdatesChangedSubscription.graphql'
import type { HomeRouterContactRequestChangedSubscriptionResponse as ContactRequestsData } from './__generated__/HomeRouterContactRequestsChangedSubscription.graphql'
import type { HomeRouterSystemUpdateChangedSubscriptionResponse as SystemUpdateData } from './__generated__/HomeRouterSystemUpdateChangedSubscription.graphql'

const APP_UPDATES_CHANGED_SUBSCRIPTION = graphql`
  subscription HomeRouterAppUpdatesChangedSubscription {
    appUpdatesChanged {
      appUpdatesCount
    }
  }
`

const CONTACT_REQUESTS_CHANGED_SUBSCRIPTION = graphql`
  subscription HomeRouterContactRequestsChangedSubscription {
    contactRequestsChanged {
      viewer {
        contactRequests {
          localID
        }
      }
    }
  }
`

const SYSTEM_UPDATE_CHANGED_SUBSCRIPTION = graphql`
  subscription HomeRouterSystemUpdateChangedSubscription {
    systemUpdateChanged {
      systemUpdate {
        status
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
  const [badges, setBadges] = useState<MenuBadges>({
    apps: false,
    contacts: false,
    wallets: false,
    settings: false,
  })

  useSubscription(APP_UPDATES_CHANGED_SUBSCRIPTION, (data: AppUpdatesData) => {
    setBadges(b => ({ ...b, apps: data.appUpdatesChanged.appUpdatesCount > 0 }))
  })
  useSubscription(
    CONTACT_REQUESTS_CHANGED_SUBSCRIPTION,
    (data: ContactRequestsData) => {
      const { contactRequests } = data.contactRequestsChanged.viewer
      setBadges(b => ({ ...b, contacts: contactRequests.length > 0 }))
    },
  )
  useSubscription(
    SYSTEM_UPDATE_CHANGED_SUBSCRIPTION,
    (data: SystemUpdateData) => {
      const { status } = data.systemUpdateChanged.systemUpdate
      const hasUpdate =
        status === 'UPDATE_AVAILABLE' ||
        status === 'UPDATE_DOWNLOADING' ||
        status === 'UPDATE_DOWNLOADED'
      setBadges(b => ({ ...b, settings: hasUpdate }))
    },
  )

  return (
    <Container>
      <SideMenu badges={badges} />
      <ContentContainer>
        <Switch>
          <Route path={ROUTES.APPS} component={AppsScreen} />
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
