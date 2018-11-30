// @flow
import EthereumTx from 'ethereumjs-tx'
import ethUtil from 'ethereumjs-util'
import { toChecksumAddress } from 'web3-utils'
import type {
  EthTransactionParams,
  WalletEthSignDataParams,
} from '@mainframe/client'
import { uniqueID, type ID } from '@mainframe/utils-id'

import { getAddressAtIndex, signTransaction } from './ledgerClient'
import { type AbstractWalletParams } from './AbstractSoftwareWallet'

type AccountAddress = string

type LedgerWalletParams = AbstractWalletParams & {
  activeAccounts: { [index: number]: AccountAddress },
  firstAddress: string,
  walletID: ID,
}

export type LedgerWalletSerialized = LedgerWalletParams

export default class LedgerWallet {
  static fromJSON = (params: LedgerWalletSerialized): LedgerWallet =>
    new LedgerWallet(params)

  // $FlowFixMe: Wallet type
  static toJSON = (hdWallet: HDWallet): HDWalletSerialized => ({
    activeAccounts: hdWallet._activeAccounts,
    walletID: hdWallet._walletID,
    firstAddress: hdWallet._firstAddress,
  })

  // Store address at 0 to identify ledger
  _walletID: ID
  _firstAddress: string
  _activeAccounts: { [index: number]: AccountAddress }

  constructor(params?: LedgerWalletParams) {
    if (params) {
      this._activeAccounts = params.activeAccounts
      this._walletID = params.walletID
      this._firstAddress = params.firstAddress
    } else {
      this._activeAccounts = {}
      this._walletID = uniqueID()
    }
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
      return this._activeAccounts[Number(i)] === toChecksumAddress(account)
    })
  }

  addAccounts(indexes: Array<number>): Array<AccountAddress> {
    const newAddresses = []
    indexes.forEach(async i => {
      if (!this._activeAccounts[i]) {
        const address = await getAddressAtIndex({ index: i })
        this._activeAccounts[i] = address
        newAddresses.push(address)
      }
    })
    return newAddresses
  }

  async signTransaction(params: EthTransactionParams): Promise<string> {
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

  sign(params: WalletEthSignDataParams) {
    params
    // TODO: Needs implementing
  }
}
