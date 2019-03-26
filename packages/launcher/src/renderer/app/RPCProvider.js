// @flow

import rpc from './rpc'

const handler = {
  sendPayload: async (payload: Object) => {
    return rpc.web3Send(payload)
  },
}

export default handler
