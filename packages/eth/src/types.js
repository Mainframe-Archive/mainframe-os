// @flow
import type EventEmitter from 'events'

export type ERC20DataResult = {
  symbol: string,
  decimals: number,
  balance: string,
}

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

export type TransactionEvent = {
  name: 'hash' | 'mined' | 'confirmed',
  data?: string,
}

export type TXEventEmitter = EventEmitter
