// @flow

import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import styled from 'styled-components/native'

import { ROUTES } from '../constants'

import SettingsMenu from './SettingsMenu'

const Container = styled.View`
  flex: 1;
  padding: 5px;
`

export default function SettingsRouter() {
  return (
    <Container>
      <Switch>
        <Route path={ROUTES.SETTINGS} component={SettingsMenu} />
        <Redirect to={ROUTES.SETTINGS} />
      </Switch>
    </Container>
  )
}
