// @flow

import { ThemeProvider } from '@morpheus-ui/core'
import React from 'react'
import { Link, MemoryRouter, Route, Switch } from 'react-router-dom'
import styled from 'styled-components/native'

import THEME from '../theme'

import { ROUTES } from './constants'
import OnboardingRouter from './onboarding/Router'

const Container = styled.View`
  flex: 1;
`

const TitleBar = styled.View`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 20px;
  background-color: transparent;
`

type Props = {
  db?: 'opened' | 'created' | null,
  userID?: ?string,
}

export default function Root({ db, userID }: Props) {
  let initialRoute
  if (userID != null) {
    initialRoute = ROUTES.HOME
  } else if (db === 'opened') {
    initialRoute = ROUTES.ONBOARDING_USER
  } else if (db === 'created') {
    initialRoute = ROUTES.ONBOARDING_OPEN
  } else {
    initialRoute = ROUTES.ONBOARDING_CREATE
  }

  return (
    <ThemeProvider theme={THEME}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Container>
          <TitleBar className="draggable" />
          <Switch>
            <Route path="/onboarding" component={OnboardingRouter} />
            <Route
              path="/"
              render={() => (
                <div>
                  <br />
                  <h1>Home</h1>
                  <Link to="/onboarding">Onboarding</Link>
                </div>
              )}
            />
          </Switch>
        </Container>
      </MemoryRouter>
    </ThemeProvider>
  )
}
