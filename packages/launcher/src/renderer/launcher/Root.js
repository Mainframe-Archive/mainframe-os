// @flow

import { ThemeProvider } from '@morpheus-ui/core'
import React from 'react'
import { MemoryRouter, Route, Switch } from 'react-router-dom'
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
  route?: ?string,
}

export default function Root({ route }: Props) {
  return (
    <ThemeProvider theme={THEME}>
      <MemoryRouter initialEntries={[route || ROUTES.ONBOARDING_CREATE]}>
        <Container>
          <TitleBar className="draggable" />
          <Switch>
            <Route path="/onboarding" component={OnboardingRouter} />
            <Route
              path="/"
              render={() => (
                <div>
                  <h1>Home</h1>
                </div>
              )}
            />
          </Switch>
        </Container>
      </MemoryRouter>
    </ThemeProvider>
  )
}
