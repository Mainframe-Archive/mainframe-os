// @flow
import {
  type WalletAddHDAccountParams,
  type WalletAddLedgerResult,
  type WalletCreateHDParams,
  type WalletCreateHDResult,
  type WalletImportMnemonicParams,
  type WalletImportResult,
  type WalletSignTxParams,
  type WalletSignTxResult,
  idType as toClientId,
} from '@mainframe/client'

import { uniqueID } from '@mainframe/utils-id'

import { mapObject } from '../utils'
import HDWallet, { type HDWalletLabeledSerialized } from './HDWalletLabeled'
import LedgerWallet, {
  type LedgerWalletLabeledSerialized,
} from './LedgerWalletLabeled'
import { getAddressAtIndex } from './ledgerClient'

const hdWalletsToJSON = mapObject(HDWallet.toJSON)
const hdWalletsFromJSON = mapObject(HDWallet.fromJSON)
const ledgerWalletsToJSON = mapObject(LedgerWallet.toJSON)
const ledgerWalletsFromJSON = mapObject(LedgerWallet.fromJSON)

export type WalletTypes = 'hd' | 'ledger'

export type WalletCollection = {
  hd: { [id: string]: HDWallet },
  ledger: { [id: string]: LedgerWallet },
}

export type Wallets = {
  ethereum: WalletCollection,
}

export type NamedWalletAccount = { name: string, address: string }

export type WalletsRepositoryParams = {
  wallets: {
    ethereum: WalletCollection,
  },
}

export type WalletsRepositorySerialized = {
  wallets: {
    ethereum: {
      hd: { [id: string]: HDWalletLabeledSerialized },
      ledger: { [id: string]: LedgerWalletLabeledSerialized },
    },
  },
}

export default class WalletsRepository {
  static fromJSON = (
    serialized: WalletsRepositorySerialized,
  ): WalletsRepository => {
    return new WalletsRepository({
      wallets: {
        ethereum: {
          // $FlowFixMe: mapping type
          hd: hdWalletsFromJSON(serialized.wallets.ethereum.hd),
          // $FlowFixMe: mapping type
          ledger: ledgerWalletsFromJSON(serialized.wallets.ethereum.ledger),
        },
      },
    })
  }

  static toJSON = (
    registry: WalletsRepository,
  ): WalletsRepositorySerialized => {
    return {
      wallets: {
        ethereum: {
          // $FlowFixMe: mapping type
          hd: hdWalletsToJSON(registry.ethWallets.hd),
          // $FlowFixMe: mapping type
          ledger: ledgerWalletsToJSON(registry.ethWallets.ledger),
        },
      },
    }
  }

  _wallets: Wallets

  constructor(params?: WalletsRepositoryParams) {
    if (params) {
      this._wallets = params.wallets
    } else {
      this._wallets = {
        ethereum: {
          hd: {},
          ledger: {},
        },
      }
    }
  }

  get ethWallets(): WalletCollection {
    return this._wallets.ethereum
  }

  getEthWalletByID(id: string): ?LedgerWallet | ?HDWallet {
    return this.ethWallets.hd[id] || this.ethWallets.ledger[id]
  }

  getEthHDWallet(id: string): ?HDWallet {
    return this.ethWallets.hd[id]
  }

  getEthLedgerWallet(id: string): ?LedgerWallet {
    return this.ethWallets.ledger[id]
  }

  getFirstEthWallet(): ?HDWallet | ?LedgerWallet {
    const priority = ['ledger', 'hd']
    let wallet
    priority.some(type => {
      if (Object.keys(this.ethWallets[type]).length) {
        wallet = this.ethWallets[type][Object.keys(this.ethWallets[type])[0]]
        return true
      }
      return false
    })
    return wallet
  }

  getEthWalletByAccount(account: string): ?HDWallet | ?LedgerWallet {
    let wallet
    Object.keys(this.ethWallets).forEach(type => {
      Object.keys(this.ethWallets[type]).forEach(w => {
        const containingWallet = this.ethWallets[type][w]
        const accountWallet = containingWallet.containsAccount(account)
        if (accountWallet) {
          wallet = containingWallet
        }
      })
    })
    return wallet
  }

  createHDWallet(params: WalletCreateHDParams): WalletCreateHDResult {
    switch (params.chain) {
      case 'ethereum': {
        const hdWallet = HDWallet.create(params.name)
        const accounts = hdWallet.getNamedAccounts()
        this.ethWallets.hd[hdWallet.id] = hdWallet
        return {
          type: 'hd',
          localID: toClientId(hdWallet._localID),
          mnemonic: hdWallet.mnemonic,
          accounts,
        }
      }
      default: {
        throw new Error(`Unsupported chain type: ${params.chain}`)
      }
    }
  }

  importMnemonicWallet(params: WalletImportMnemonicParams): WalletImportResult {
    switch (params.chain) {
      case 'ethereum': {
        const alreadyExists = Object.keys(this.ethWallets.hd).find(id => {
          return this.ethWallets.hd[id].mnemonic === params.mnemonic
        })
        if (alreadyExists) {
          throw new Error('Wallet with this mnemonic phrase already exists')
        }
        const hdWallet = HDWallet.import({
          mnemonic: params.mnemonic,
          firstAccountName: params.name,
        })

        this.ethWallets.hd[hdWallet.id] = hdWallet

        return {
          type: 'hd',
          localID: toClientId(hdWallet.id),
          accounts: hdWallet.getNamedAccounts(),
        }
      }
      default: {
        throw new Error(`Unsupported chain type: ${params.chain}`)
      }
    }
  }

  addHDWalletAccount(params: WalletAddHDAccountParams): string {
    const wallet = this.getEthHDWallet(params.walletID)
    if (!wallet) {
      throw new Error('Wallet not found')
    }
    const newAddress = wallet.addAccount(params.index, params.name)
    return newAddress
  }

  deleteWallet(chain: string, type: WalletTypes, walletID: string) {
    if (!this._wallets[chain]) {
      throw new Error(`Unsupported chain: ${chain}`)
    }
    if (!this._wallets[chain][type]) {
      throw new Error(`Invalid wallet type: ${type}`)
    }
    const wallet = this._wallets[chain][type][walletID]
    if (!wallet) {
      throw new Error('Wallet not found')
    }
    delete this._wallets[chain][type][walletID]
  }

  // Signing

  async signTransaction(
    params: WalletSignTxParams,
  ): Promise<WalletSignTxResult> {
    switch (params.chain) {
      case 'ethereum':
        return this.signEthTransaction(params)
      default:
        throw new Error(`Unsupported blockchain type: ${params.chain}`)
    }
  }

  async signEthTransaction(
    params: WalletSignTxParams,
  ): Promise<WalletSignTxResult> {
    // TODO: set chain ID
    const wallet = this.getEthWalletByAccount(params.transactionData.from)
    if (!wallet) {
      throw new Error('Wallet not found')
    }
    return wallet.signTransaction(params.transactionData)
  }

  // Ledger Wallets

  getLedgerEthWalletByFirstAddr(address: string): ?LedgerWallet {
    const ledgerWallets = this._wallets.ethereum.ledger
    const walletID = Object.keys(ledgerWallets).find(w => {
      return ledgerWallets[w]._firstAddress === address
    })
    if (walletID) {
      return this._wallets.ethereum.ledger[walletID]
    }
  }

  async addLedgerEthAccount(params: {
    index: number,
    name: string,
  }): Promise<WalletAddLedgerResult> {
    // Identify ledger wallets with first address
    const firstLedgerAddr = await getAddressAtIndex({ index: 0 })
    let ledgerWallet = this.getLedgerEthWalletByFirstAddr(firstLedgerAddr)
    if (!ledgerWallet) {
      ledgerWallet = new LedgerWallet()
      const walletID = uniqueID()
      ledgerWallet._firstAddress = firstLedgerAddr
      ledgerWallet._localID = walletID
      this._wallets.ethereum.ledger[walletID] = ledgerWallet
    }

    const addr = await ledgerWallet.addAccount(params.index, params.name)
    ledgerWallet.accountNames[addr] = params.name

    return {
      localID: ledgerWallet.id,
      address: addr,
    }
  }
}
