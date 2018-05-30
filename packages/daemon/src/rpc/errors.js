// @flow

import ExtendableError from 'es6-error'

export type ErrorObject = {
  code: number,
  message: string,
}

export class RPCError extends ExtendableError {
  code: number
  constructor(code: number, message: string) {
    super(message)
    this.code = code
  }
}

// JSON-RPC spec

export const parseError = () => new RPCError(-32700, 'Parse Error')

export const methodNotFound = () => new RPCError(-32601, 'Method not found')

export const invalidRequest = () => new RPCError(-32600, 'Invalid Request')

// Mainframe protocol

export const daemonError = (message: string) => new RPCError(1000, message)

export const vaultError = (message: string) => new RPCError(2000, message)

export const clientError = (message: string) => new RPCError(3000, message)

export const sessionError = (message: string) => new RPCError(4000, message)
