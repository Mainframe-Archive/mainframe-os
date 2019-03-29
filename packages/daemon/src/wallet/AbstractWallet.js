// @flow

export type WalletEthSignTxParams = {
  nonce: number,
  from: string,
  to: string,
  value: number,
  data: string,
  gas: string,
  gasPrice: string,
  chainId: number,
}

export type WalletSignDataParams = {
  address: string,
  data: string,
}

export type AbstractWalletParams = {
  localID: string,
  name: ?string,
  type: string,
}

export default class AbstractWallet {
  _localID: string
  _name: ?string
  _type: string

  constructor(params: AbstractWalletParams) {
    this._localID = params.localID
    this._name = params.name
    this._type = params.type
  }

  // Getters

  get id(): string {
    return this._localID
  }

  get localID(): string {
    return this._localID
  }

  get name(): string {
    return this._name || this.localID
  }

  get type(): string {
    return this._type
  }
}
