// @flow

import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import { ROUTES } from '../constants'

export default function OnboardingRouter() {
  return (
    <Switch>
      <Route
        path={ROUTES.ONBOARDING_USER}
        render={() => <h1>User onboarding</h1>}
      />
      <Route
        path={ROUTES.ONBOARDING_OPEN}
        render={() => <h1>Open existing DB</h1>}
      />
      <Route
        path={ROUTES.ONBOARDING_CREATE}
        render={() => <h1>Create DB</h1>}
      />
      <Redirect to={ROUTES.ONBOARDING_CREATE} />
    </Switch>
  )
}
