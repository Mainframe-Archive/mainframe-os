// @flow

import rpc from './rpc'

const handler = {
  sendPayload: async (payload: Object) => {
    return rpc.ethSend(payload)
  },
}

export default handler
