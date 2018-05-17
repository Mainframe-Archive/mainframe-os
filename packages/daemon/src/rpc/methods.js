// @flow

import type { Socket } from 'net'

import { fromBase64, toBase64, type base64, type ID } from '../utils'
import type Vault from '../vault/Vault'
import { getVault, openVault, createVault } from '../vault'

import { RPCError } from './errors'
import web3Client from './web3Client'

const getClientVault = (socket: Socket): Vault => {
  const vault = getVault(socket)
  if (vault == null) {
    throw new RPCError(-32000, 'Vault is not open')
  }
  return vault
}

export default {
  mf_apiVersion: () => 0,

  mf_openVault: async (socket: Socket, [path, key]: [string, base64] = []) => {
    try {
      await openVault(socket, path, fromBase64(key))
      return 'OK'
    } catch (err) {
      // TODO: different error code depending on actual error
      throw new RPCError(-32000, err.message)
    }
  },

  mf_newVault: async (socket: Socket, [path, key]: [string, base64] = []) => {
    try {
      await createVault(socket, path, fromBase64(key))
      return 'OK'
    } catch (err) {
      // TODO: different error code depending on actual error
      throw new RPCError(-32000, err.message)
    }
  },

  mf_newUserIdentity: (socket: Socket): { id: ID } => {
    const vault = getClientVault(socket)
    const id = vault.identities.createOwnUser()
    return { id }
  },

  mf_callWeb3: (
    socket: Socket,
    [appID, identityID, method, params]: [ID, ID, string, any] = [],
  ) => {
    // TODO: check app permissions to ensure call is allowed
    const vault = getClientVault(socket)
    const app = vault.apps.getApp(appID)

    if (app == null) {
      // TODO: error code
      throw new RPCError(-32000, 'App not found')
    }

    return web3Client.request(method, params)
  },
}
