// @flow
import type EventEmitter from 'events'

export type DecodedTxResult = {
  contractType: 'ERC20',
  signatureHex: string,
  signatureName: string,
  params: Object,
}

export type SendParams = {
  to?: string,
  from: string,
  value: number,
  confirmations?: number,
}

export type TXParams = {
  nonce: number,
  from: string,
  to: string,
  value: number,
  data: string,
  gas: string,
  gasPrice: string,
  chainId: number,
}

export type RequestPayload = {
  id: number,
  jsonrpc: string,
  method: string,
  params: Array<any>,
}

export type TransactionEvent = {
  name: 'hash' | 'mined' | 'confirmed',
  data?: string,
}

export type TXEventEmitter = EventEmitter

// Web3 JS provider interface
export type AbstractProvider = {
  +send: (payload: Object, cb: (?Error, ?any) => void) => Promise<any>,
  +on?: (event: string, listener: Function) => any,
  +emit?: (event: string, ...args: Array<any>) => boolean,
}
