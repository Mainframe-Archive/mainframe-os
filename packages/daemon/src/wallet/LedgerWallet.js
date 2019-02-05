// @flow
import EthereumTx from 'ethereumjs-tx'
import ethUtil from 'ethereumjs-util'
import { toChecksumAddress } from 'web3-utils'

import { getAddressAtIndex, signTransaction } from './ledgerClient'
import AbstractWallet, {
  type WalletSignTXParams,
  type WalletSignDataParams,
} from './AbstractWallet'

type AccountAddress = string

type ActiveAccounts = { [index: string]: AccountAddress }

export type LedgerWalletParams = {
  localID: string,
  name: ?string,
  activeAccounts: { [index: string]: AccountAddress },
  firstAddress: string,
}

export type LedgerWalletSerialized = LedgerWalletParams

export default class LedgerWallet extends AbstractWallet {
  static fromJSON = (params: LedgerWalletSerialized): LedgerWallet =>
    new LedgerWallet(params)

  // $FlowFixMe: Wallet type
  static toJSON = (wallet: LedgerWallet): LedgerWalletSerialized => ({
    activeAccounts: wallet.activeAccounts,
    localID: wallet.localID,
    firstAddress: wallet.firstAddress,
    name: wallet.name,
  })

  // Store address at 0 to identify ledger
  _firstAddress: string
  _activeAccounts: ActiveAccounts

  constructor(params: LedgerWalletParams) {
    super({ ...params, type: 'ledger' })
    this._activeAccounts = params.activeAccounts
    this._firstAddress = params.firstAddress
  }

  // Getters

  get firstAddress(): string {
    return this._firstAddress
  }

  get activeAccounts(): ActiveAccounts {
    return this._activeAccounts
  }

  // Public

  containsAccount(account: string): boolean {
    return Object.values(this._activeAccounts).includes(
      toChecksumAddress(account),
    )
  }

  getAccounts(): Array<string> {
    // $FlowFixMe mixed values are actually strings
    return Object.values(this._activeAccounts)
  }

  getIndexForAccount(account: string): ?string {
    return Object.keys(this._activeAccounts).find(i => {
      return this._activeAccounts[i] === toChecksumAddress(account)
    })
  }

  async addAccounts(indexes: Array<number>): Promise<Array<AccountAddress>> {
    const newAddresses = []
    for (let i = 0; i < indexes.length; i++) {
      const index = indexes[i]
      const stringIndex = String(index)
      if (!this._activeAccounts[stringIndex]) {
        const address = await getAddressAtIndex({ index: index })
        this._activeAccounts[stringIndex] = address
        newAddresses.push(address)
      }
    }
    return newAddresses
  }

  async signTransaction(params: WalletSignTXParams): Promise<string> {
    if (!params.chainId) {
      throw new Error('ethereum chain id not set in tx params')
    }
    const index = this.getIndexForAccount(params.from)
    if (!index) {
      throw new Error('account not registered with this device')
    }
    const tx = new EthereumTx(params)
    tx.v = ethUtil.bufferToHex(tx.getChainId())
    tx.r = '0x00'
    tx.s = '0x00'
    const txHex = tx.serialize().toString('hex')

    const res = await signTransaction(Number(index), txHex)

    tx.v = Buffer.from(res.v, 'hex')
    tx.r = Buffer.from(res.r, 'hex')
    tx.s = Buffer.from(res.s, 'hex')
    const valid = tx.verifySignature()

    if (valid) {
      return ethUtil.addHexPrefix(tx.serialize().toString('hex'))
    } else {
      throw new Error('invalid transaction signature')
    }
  }

  sign(params: WalletSignDataParams) {
    params
    // TODO: Needs implementing
  }
}
