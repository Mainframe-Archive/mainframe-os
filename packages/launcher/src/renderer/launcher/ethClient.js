// @flow

import { EthClient } from '@mainframe/eth'

import rpc from './rpc'

export default new EthClient({
  send: async (method: string, params: Array<*>): Promise<*> => {
    return rpc.ethSend({ method, params })
  },
})
