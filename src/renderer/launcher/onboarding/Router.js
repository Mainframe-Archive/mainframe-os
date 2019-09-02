// @flow

import React from 'react'
import { Redirect, Route, Switch } from 'react-router'

import { ROUTES } from '../constants'

import CreateDB from './CreateDB'
import CreateUser from './CreateUser'
import CreateWallet from './CreateWallet'
import OpenDB from './OpenDB'

export default function OnboardingRouter() {
  return (
    <Switch>
      <Route path={ROUTES.ONBOARDING_OPEN} component={OpenDB} />
      <Route path={ROUTES.ONBOARDING_CREATE} component={CreateDB} />
      <Route path={ROUTES.ONBOARDING_USER} component={CreateUser} />
      <Route path={ROUTES.ONBOARDING_WALLET} component={CreateWallet} />
      <Redirect to={ROUTES.ONBOARDING_CREATE} />
    </Switch>
  )
}
