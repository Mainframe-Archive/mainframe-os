// @flow

const generateId = () =>
  Math.random()
    .toString(36)
    .slice(2)

export const channels = {
  mainToApp: {
    request: 'main-to-app-request',
    response: 'main-to-app-response',
  },
  appToMain: {
    request: 'app-to-main-request',
    response: 'app-to-main-response',
  },
}

export const IPC_ERRORS: Object = {
  invalidParams: {
    message: 'Invalid params',
    code: 32602,
  },
  internalError: {
    message: 'Internal error',
    code: 32603,
  },
  invalidRequest: {
    message: 'Invalid request',
    code: 32600,
  },
  methodNotFound: {
    message: 'Method not found',
    code: 32601,
  },
}

export default (
  sender: Object,
  receiver: Object,
  chanKey: string,
  method: string,
  args: Array<any>,
) =>
  new Promise((resolve, reject) => {
    const request = {
      id: generateId(),
      data: {
        method,
        args,
      },
    }
    const listener = (event, msg) => {
      if (msg.id === request.id) {
        if (msg.error) {
          reject(msg.error)
        } else {
          resolve(msg.result)
        }
        receiver.removeListener(channels[chanKey].response, listener)
      }
    }
    receiver.on(channels[chanKey].response, listener)
    sender.send(channels[chanKey].request, request)
  })
