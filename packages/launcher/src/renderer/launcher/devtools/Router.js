// @flow

import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { graphql } from 'react-relay'

import { ROUTES } from '../constants'
import RelayRenderer from '../RelayRenderer'

import CreateDeveloperScreen from './CreateDeveloperScreen'
import OwnAppsScreen from './OwnAppsScreen'

// TODO: handle redirections based on number of developer accounts

function DevtoolsRouter() {
  return (
    <Switch>
      <Route path={ROUTES.DEVTOOLS_APPS} component={OwnAppsScreen} />
      <Route
        path={ROUTES.DEVTOOLS_DEVELOPERS_CREATE}
        component={CreateDeveloperScreen}
      />
      <Redirect to={ROUTES.DEVTOOLS_APPS} />
    </Switch>
  )
}

export default function DevtoolsRenderer() {
  return (
    <RelayRenderer
      render={({ props }) => {
        return props == null ? null : (
          <DevtoolsRouter developers={props.devtools.developers} />
        )
      }}
      query={graphql`
        query DevtoolsRouterQuery {
          devtools {
            developers {
              id
            }
          }
        }
      `}
    />
  )
}
