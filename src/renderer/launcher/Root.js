// @flow

import { ThemeProvider } from '@morpheus-ui/core'
import React from 'react'
import { MemoryRouter, Route, Switch } from 'react-router'
import styled from 'styled-components/native'

import THEME from '../theme'
import { ROUTES } from './constants'

import HomeRouter from './HomeRouter'
import OnboardingRouter from './onboarding/Router'
import { ToastProvider } from './ToastContext'

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
        <ToastProvider>
          <Container>
            <TitleBar className="draggable" />
            <Switch>
              <Route path="/onboarding" component={OnboardingRouter} />
              <Route path="/" component={HomeRouter} />
            </Switch>
          </Container>
        </ToastProvider>
      </MemoryRouter>
    </ThemeProvider>
  )
}
