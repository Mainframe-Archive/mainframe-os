const appEl = document.createElement('div')
const appId = 'sandbox'

appEl.innerHTML = `
  <div class="pure-u-1-1">
    <button class="pure-button">Fetch Balance</button>
  </div>
`
appEl.addEventListener('click', () => {
  window.ipc.send('message', {
    appId,
    method: 'getBalance',
    args: ['0xSomeWalletAddress'],
  })
})
document.body.appendChild(appEl)

window.ipc.on('message', (event, message) => {
  if (message.appId === appId) {
    const balance = document.createElement('div')
    balance.innerHTML = `
      <div class="pure-u-1-1">
        ${message.body}
      </div>
    `
    document.body.appendChild(balance)
  }
})
