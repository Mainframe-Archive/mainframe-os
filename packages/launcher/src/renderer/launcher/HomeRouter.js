// @flow

import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import styled from 'styled-components/native'

import { ROUTES } from './constants'
import SideMenu from './SideMenu'
import WalletsScreen from './wallets/WalletsScreen'

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
  return (
    <Container testID="launcher-view">
      <SideMenu />
      <ContentContainer>
        <Switch>
          <Route path={ROUTES.APPS} component={() => <h1>Apps</h1>} />
          <Route path={ROUTES.CONTACTS} component={() => <h1>Contacts</h1>} />
          <Route path={ROUTES.WALLETS} component={WalletsScreen} />
          <Redirect to={ROUTES.APPS} />
        </Switch>
      </ContentContainer>
    </Container>
  )
}
