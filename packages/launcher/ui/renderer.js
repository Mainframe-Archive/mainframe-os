const electron = window.require('electron')
const fs = window.require('fs-extra')
const path = window.require('path')
const ipc = electron.ipcRenderer

const files = fs.readdirSync(path.join(__dirname, '../', 'applications'))

files.forEach(file => {
  const appPath = path.join(__dirname, '../', 'applications', file)
  const isDir = fs.lstatSync(appPath).isDirectory()
  if (isDir) {
    const manifestPath = path.join(appPath, 'manifest.json')

    if (fs.existsSync(manifestPath)) {

      const manifest = require(manifestPath)
      const appEl = document.createElement('div')

      appEl.innerHTML = `
        <div class="pure-u-1-1 app-list-item">
          <button class="pure-button" id=${manifest.id}>${manifest.name}</button>
        </div>
      `
      appEl.addEventListener('click', function () {
        ipc.send('launchApp', manifest.id)
      })
      document.body.appendChild(appEl)
    }
  }
})
