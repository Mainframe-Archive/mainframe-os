import React, { Component } from 'react'

const electron = window.require('electron')
const fs = window.require('fs-extra')
const path = window.require('path')
const ipc = electron.ipcRenderer

export default class App extends Component {

  render() {
    // TODO: Temporary applications directory for dev
    const appsPath = path.join(__dirname, '../../../static/', 'applications')
    const files = fs.readdirSync(appsPath)
    const appRows = []

    files.forEach(file => {
      const appPath = path.join(appsPath, file)
      const isDir = fs.lstatSync(appPath).isDirectory()
      if (isDir) {
        const manifestPath = path.join(appPath, 'manifest.json')
        if (fs.existsSync(manifestPath)) {
          const manifest = JSON.parse(fs.readFileSync(manifestPath))

          const onClick = () => {
            ipc.send('launchApp', manifest.id)
          }

          appRows.push(
            <button onClick={onClick} className="app-list-item" key={manifest.id}>
              {manifest.name}
            </button>
          )
        }
      }
    })

    return (
      <div>
      	<h1>Mainframe Launcher</h1>
        {appRows}
      </div>
    )
  }
}
