const appEl = document.createElement('div')
const appId = 'sandbox'

appEl.innerHTML = `
  <div class="pure-u-1-1">
    <button class="pure-button">Fetch Balance</button>
  </div>
`
appEl.addEventListener('click', async () => {
  try {
    const res = await window.ipc.callMain('ipcRequest', {
      appId,
      method: 'getBalance',
      args: ['0xSomeWalletAddress'],
    })
    const balance = document.createElement('div')
    balance.innerHTML = `
      <div class="pure-u-1-1">
        ${res}
      </div>
    `
    document.body.appendChild(balance)
  } catch (err) {
    console.log('err: ', err)
  }
})
document.body.appendChild(appEl)
