const appEl = document.createElement('div')

appEl.innerHTML = `
  <div class="pure-u-1-1">
    <button class="pure-button">Fetch API Version</button>
  </div>
`
appEl.addEventListener('click', async () => {
  try {
    const res = await window.ipc.callMain('ipcRequest', {
      method: 'apiVersion',
      args: [],
    })
    const apiVersion = document.createElement('div')
    apiVersion.innerHTML = `
      <div class="pure-u-1-1">
        ${res}
      </div>
    `
    document.body.appendChild(apiVersion)
  } catch (err) {
    console.log('err: ', err)
  }
})
document.body.appendChild(appEl)
