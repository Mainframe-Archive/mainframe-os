import React from 'react'
import { render } from 'react-dom'
import './styles.css'
import App from './App.js'

const electron = window.require('electron')
const fs = window.require('fs-extra')
const path = window.require('path')
const ipc = electron.ipcRenderer

render(<App/>, document.getElementById('app'))
