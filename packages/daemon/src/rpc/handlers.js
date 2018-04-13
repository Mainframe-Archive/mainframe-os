// @flow

import type { Socket } from 'net'
import sodium from 'sodium-native'

import { fromBase64, toBase64, type base64, type ID } from '../utils'
import type Vault from '../vault/Vault'
import vaults from '../vault/vaults'

import { RPCError } from './errors'

const SEED_MIN_LENGTH = 20

class SocketState {
  _socket: Socket
  _isAgent: boolean = false

  constructor(socket: Socket) {
    this._socket = socket
  }

  get isAgent(): boolean {
    return this._isAgent
  }

  get vault(): ?Vault {
    return vaults.getVault(this._socket)
  }

  setAgent(isAgent: boolean = true) {
    this._isAgent = isAgent
  }

  openVault(path: string, key: string): Promise<void> {
    if (!this._isAgent) {
      return Promise.reject(
        new Error('Client must be user agent to open vault'),
      )
    }
    return vaults.open(this._socket, path, fromBase64(key))
  }

  async newVault(path: string, key: string): Promise<void> {
    if (!this._isAgent) {
      return Promise.reject(
        new Error('Client must be user agent to create vault'),
      )
    }
    await vaults.create(this._socket, path, fromBase64(key))
  }
}

const socketState: WeakMap<Socket, SocketState> = new WeakMap()

const getState = (socket: Socket): SocketState => {
  let state = socketState.get(socket)
  if (state == null) {
    state = new SocketState(socket)
    socketState.set(socket, state)
  }
  return state
}

export default {
  mf_isUserAgent: (socket: Socket) => getState(socket).isAgent,

  mf_setUserAgent: (socket: Socket, [agent]: [boolean] = []) => {
    getState(socket).setAgent(agent)
    return 'OK'
  },

  mf_openVault: async (socket: Socket, [path, key]: [string, base64] = []) => {
    try {
      await getState(socket).openVault(path, key)
      return 'OK'
    } catch (err) {
      // TODO: different error code depending on actual error
      throw new RPCError(-32000, err.message)
    }
  },

  mf_newVault: async (socket: Socket, [path, key]: [string, base64] = []) => {
    try {
      await getState(socket).newVault(path, key)
      return 'OK'
    } catch (err) {
      // TODO: different error code depending on actual error
      throw new RPCError(-32000, err.message)
    }
  },

  mf_newIdentity: async (
    socket: Socket,
  ): Promise<{
    id: ID,
    publicKey: base64,
  }> => {
    const vault = getState(socket).vault
    if (vault == null) {
      throw new RPCError(-32000, 'Vault is not open')
    }

    await vault.opened
    const identity = vault.createIdentity()
    return {
      id: identity.id,
      publicKey: toBase64(identity.publicKey),
    }
  },
}
