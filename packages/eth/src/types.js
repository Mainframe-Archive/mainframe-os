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
  chainId?: ?number,
}

export type JsonRpcRequest = {
  id: number,
  jsonrpc: string,
  method: string,
  params: Array<any>,
}

export type JsonRpcResponse = {
  id: number,
  jsonrpc: string,
  result: any,
  error: ?any,
}

export type TransactionEvent = {
  name: 'hash' | 'mined' | 'confirmed',
  data?: string,
}

export type EventFilterParams = {
  topics: Array<string>,
  fromBlock?: ?number,
  toBlock?: number | string,
  address?: ?string | Array<string>,
}

export type TXEventEmitter = EventEmitter

export type AbstractProvider = {
  +send: (method: string, params: Array<*>) => Promise<*>,
  +on?: (event: string, listener: Function) => *,
  +emit?: (event: string, ...args: Array<any>) => *,
  +unsubscribe?: (id: string, type?: string) => void,
  +clearSubscriptions?: () => void,
  +subscribe?: (
    name: string,
    method: string,
    params: Object,
  ) => Promise<string>,
  isConnecting?: () => boolean,
  connected?: boolean,
  connection?: {
    readyState: number,
  },
}
