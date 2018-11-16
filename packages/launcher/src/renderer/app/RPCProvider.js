// @flow

import rpc from './rpc'

type Callback = (?Error, ?any) => any

const handler = {
  send: async (payload: Object, cb: Callback) => {
    try {
      const res = await rpc.web3Send(payload)
      const jsonResponse = {
        jsonrpc: '2.0',
        id: payload.id,
        result: res,
      }
      cb(null, jsonResponse)
    } catch (err) {
      cb(err)
    }
  },
}

export default handler
