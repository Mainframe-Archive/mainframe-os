const appEl = document.createElement('div')
const appId = 'sandbox'

appEl.innerHTML = `
  <div class="pure-u-1-1">
    <button class="pure-button">Fetch Balance</button>
  </div>
`
appEl.addEventListener('click', async () => {
  try {
    const res = await Promise.all([
      window.ipc.callMain('ipcRequest', {
        method: 'getBalance',
        args: ['0xSomeWalletAddress'],
      }),
      window.ipc.callMain('ipcRequest', {
        method: 'getPublicKey',
      })
    ])
    const balance = document.createElement('div')
    balance.innerHTML = `
      <div class="pure-u-1-1">
        ${res}
      </div>
    `
    document.body.appendChild(balance)
  } catch (err) {
    console.log(err)
  }
})
document.body.appendChild(appEl)
