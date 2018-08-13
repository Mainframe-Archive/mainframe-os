const { ipcRenderer } = require('electron')

const generateId = () =>
  Math.random()
    .toString(36)
    .slice(2)

const requestChannel = 'sdk-request-channel'
const responseChannel = 'sdk-response-channel'

const request = (channel, data) =>
  new Promise((resolve, reject) => {
    console.log('new request: ', channel, data)
    const request = {
      id: generateId(),
      data,
    }
    const listener = (event, msg) => {
      if (msg.id === request.id) {
        if (msg.error || !msg.result) {
          reject(msg.error)
        } else {
          resolve(msg.result)
        }
        ipcRenderer.removeListener(responseChannel, listener)
      }
    }
    ipcRenderer.on(responseChannel, listener)
    ipcRenderer.send(requestChannel, request)
  })

window.mainframe = { request }
