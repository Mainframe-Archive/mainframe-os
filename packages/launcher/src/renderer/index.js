import React from 'react'
import { render } from 'react-dom'
import { parse } from 'query-string'

import './styles.css'
import Launcher from './launcher/Launcher.js'
import AppContainer from './apps/AppContainer.js'

const params = parse(document.location.search)

const app = params.type === 'launcher'
  ? <Launcher />
  : <AppContainer appId={params.appId} />

render(app, document.getElementById('app'))
