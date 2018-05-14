const {ipcRenderer} = require('electron')

const getChannels = (channel) => ({
  sendChannel: `ipc-send-channel-${channel}`,
  dataChannel: `ipc-response-data-channel-${channel}`,
  errorChannel: `ipc-response-error-channel-${channel}`
})

const callMain = (channel, data) => new Promise((resolve, reject) => {
  const {sendChannel, dataChannel, errorChannel} = getChannels(channel)

  const cleanup = () => {
    ipcRenderer.removeAllListeners(dataChannel)
    ipcRenderer.removeAllListeners(errorChannel)
  }

  ipcRenderer.on(dataChannel, (event, result) => {
    cleanup()
    resolve(result)
  })

  ipcRenderer.on(errorChannel, (event, error) => {
    cleanup()
    reject(error)
  })

  ipcRenderer.send(sendChannel, data)
})

const ipc = { callMain }

window.ipc = ipc
