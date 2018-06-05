// @flow

import type { PermissionCheckResult } from '@mainframe/app-permissions'
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

// Permission errors (session-level)

export const permissionError = (message: string = 'Permission error') => {
  return new RPCError(4100, message)
}

export const permissionUnknowError = (
  message: string = 'Unknow permission',
) => {
  return new RPCError(4101, message)
}

export const permissionNotSetError = (
  message: string = 'Permission not set',
) => {
  return new RPCError(4102, message)
}

export const permissionInputError = (message: string = 'Invalid input') => {
  return new RPCError(4103, message)
}

export const permissionDeniedError = (
  message: string = 'Permission denied',
) => {
  return new RPCError(4104, message)
}

export const permissionErrorFromResult = (result: PermissionCheckResult) => {
  switch (result) {
    case 'unknown_key':
      return permissionUnknowError()
    case 'not_set':
      return permissionNotSetError()
    case 'invalid_input':
      return permissionInputError()
    case 'denied':
      return permissionDeniedError()
    default:
      return permissionError()
  }
}
