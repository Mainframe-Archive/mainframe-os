// @flow

import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { graphql } from 'react-relay'

import { ROUTES } from '../constants'
import RelayRenderer from '../RelayRenderer'

import AppDetailsScreen from './AppDetailsScreen'
import CreateDeveloperScreen from './CreateDeveloperScreen'
import DeveloperAppsScreen from './DeveloperAppsScreen'
import type { DevtoolsRouterQueryResponse } from './__generated__/DevtoolsRouterQuery.graphql'

function DevtoolsRouter(props: DevtoolsRouterQueryResponse) {
  const devs = props.devtools.developers

  let redirect = null
  if (devs.length === 0) {
    redirect = <Redirect to={ROUTES.DEVTOOLS_DEVELOPER_CREATE} />
  } else if (devs.length === 1) {
    redirect = (
      <Redirect
        to={ROUTES.DEVTOOLS_DEVELOPER_APPS.replace(':developerID', devs[0].id)}
      />
    )
  } else {
    redirect = <Redirect to={ROUTES.DEVTOOLS_DEVELOPER_LIST} />
  }

  return (
    <Switch>
      <Route path={ROUTES.DEVTOOLS_APP_DETAILS} component={AppDetailsScreen} />
      <Route
        path={ROUTES.DEVTOOLS_DEVELOPER_APPS}
        component={DeveloperAppsScreen}
      />
      <Route
        path={ROUTES.DEVTOOLS_DEVELOPER_CREATE}
        component={CreateDeveloperScreen}
      />
      {redirect}
    </Switch>
  )
}

export default function DevtoolsRenderer() {
  return (
    <RelayRenderer
      render={({ props }) => {
        return props == null ? null : <DevtoolsRouter {...props} />
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
