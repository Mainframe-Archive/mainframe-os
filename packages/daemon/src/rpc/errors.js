// @flow

export class RPCError extends Error {
  code: number
  constructor(code: number, message: string) {
    super(message)
    this.code = code
  }
}

export const parseError = () => new RPCError(-32700, 'Parse Error')

export const methodNotFound = () => new RPCError(-32601, 'Method not found')

export const invalidRequest = () => new RPCError(-32600, 'Invalid Request')
