// @flow
import {
  type WalletAddHDAccountParams,
  type WalletCreateHDParams,
  type WalletCreateHDResult,
  type WalletImportMnemonicParams,
  type WalletImportPKParams,
  type WalletResult,
  type WalletSignTxParams,
  type WalletSignTxResult,
  type WalletTypes,
  idType as toClientId,
  type ID,
} from '@mainframe/client'

import { uniqueID, idType } from '@mainframe/utils-id'

import { mapObject } from '../utils'
import HDWallet, { type HDWalletSerialized } from './HDWallet'
import PKWallet, { type PKWalletSerialized } from './PKWallet'
import LedgerWallet, { type LedgerWalletSerialized } from './LedgerWallet'
import AbstractWallet from './AbstractSoftwareWallet'
import { getAddressAtIndex } from './ledgerClient'

const hdWalletsToJSON = mapObject(HDWallet.toJSON)
const hdWalletsFromJSON = mapObject(HDWallet.fromJSON)
const pkWalletsToJSON = mapObject(PKWallet.toJSON)
const pkWalletsFromJSON = mapObject(PKWallet.fromJSON)
const ledgerWalletsToJSON = mapObject(LedgerWallet.toJSON)
const ledgerWalletsFromJSON = mapObject(LedgerWallet.fromJSON)

export type WalletCollection = {
  hd: { [id: string]: HDWallet },
  ledger: { [id: string]: LedgerWallet },
  pk: { [id: string]: PKWallet },
}

export type Wallets = {
  ethereum: WalletCollection,
}

export type WalletAccountNames = { [address: string]: string }
export type NamedWalletAccount = { name: string, address: string }

export type WalletsRepositoryParams = {
  wallets: {
    ethereum: WalletCollection,
  },
  walletAccountNames: WalletAccountNames,
}

export type WalletsRepositorySerialized = {
  wallets: {
    ethereum: {
      hd: { [id: string]: HDWalletSerialized },
      ledger: { [id: string]: LedgerWalletSerialized },
      pk: { [id: string]: PKWalletSerialized },
    },
  },
  walletAccountNames: WalletAccountNames,
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
          pk: pkWalletsFromJSON(serialized.wallets.ethereum.pk),
          // $FlowFixMe: mapping type
          ledger: ledgerWalletsFromJSON(serialized.wallets.ethereum.ledger),
        },
      },
      walletAccountNames: serialized.walletAccountNames,
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
          pk: pkWalletsToJSON(registry.ethWallets.pk),
          // $FlowFixMe: mapping type
          ledger: ledgerWalletsToJSON(registry.ethWallets.ledger),
        },
      },
      walletAccountNames: registry.walletAccountNames,
    }
  }

  _wallets: Wallets
  _walletAccountNames: WalletAccountNames

  constructor(params?: WalletsRepositoryParams) {
    if (params) {
      this._wallets = params.wallets
      this._walletAccountNames = params.walletAccountNames
    } else {
      this._wallets = {
        ethereum: {
          hd: {},
          pk: {},
          ledger: {},
        },
      }
      this._walletAccountNames = {}
    }
  }

  get ethWallets(): WalletCollection {
    return this._wallets.ethereum
  }
  get walletAccountNames(): WalletAccountNames {
    return this._walletAccountNames
  }

  getEthWalletByID(id: string): ?AbstractWallet {
    return (
      this.ethWallets.hd[id] ||
      this.ethWallets.pk[id] ||
      this.ethWallets.ledger[id]
    )
  }

  getEthHDWallet(id: string): ?HDWallet {
    return this.ethWallets.hd[id]
  }

  getEthLedgerWallet(id: string): ?LedgerWallet {
    return this.ethWallets.ledger[id]
  }

  getFirstEthWallet(): ?AbstractWallet | ?LedgerWallet {
    const priority = ['ledger', 'hd', 'pk']
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

  getEthWalletByAccount(account: string): ?AbstractWallet {
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

  getEthHDWalletsAndNames(): Array<{
    localID: string,
    accounts: Array<NamedWalletAccount>,
  }> {
    return Object.keys(this.ethWallets.hd).map(key => {
      const wallet = this.ethWallets.hd[key]
      const accounts: Array<NamedWalletAccount> = wallet
        .getAccounts()
        .map(a => ({
          address: a,
          name: this.walletAccountNames[a],
        }))
      return {
        accounts,
        localID: wallet.id,
      }
    })
  }

  createHDWallet(params: WalletCreateHDParams): WalletCreateHDResult {
    switch (params.chain) {
      case 'ethereum': {
        const hdWallet = HDWallet.create()
        const accounts = hdWallet.getAccounts()
        this.ethWallets.hd[hdWallet.id] = hdWallet
        this.walletAccountNames[accounts[0]] = params.name
        return {
          type: 'hd',
          walletID: toClientId(hdWallet._localID),
          mnemonic: hdWallet._mnemonic,
          accounts,
        }
      }
      default: {
        throw new Error(`Unsupported chain type: ${params.chain}`)
      }
    }
  }

  importPKWallet(params: WalletImportPKParams): WalletResult {
    switch (params.chain) {
      case 'ethereum': {
        let wallet
        let walletID
        if (params.walletID) {
          // Add to specific wallet
          wallet = this.ethWallets.pk[params.walletID]
          walletID = params.walletID
        } else if (Object.keys(this.ethWallets.pk)[0]) {
          // Use the first wallet
          const firstSimpleWalletID = idType(Object.keys(this.ethWallets.pk)[0])
          wallet = this.ethWallets.pk[firstSimpleWalletID]
          walletID = firstSimpleWalletID
        } else {
          // Create a new PK wallet
          walletID = uniqueID()
          wallet = new PKWallet({ localID: walletID, privateKeys: [] })
          this.ethWallets.pk[walletID] = wallet
        }
        wallet.importAccountByPK(params.privateKey)
        const accounts = wallet.getAccounts()
        return {
          type: 'pk',
          walletID: toClientId(wallet.id),
          accounts,
        }
      }
      default: {
        throw new Error(`Unsupported chain type: ${params.chain}`)
      }
    }
  }

  importMnemonicWallet(params: WalletImportMnemonicParams): WalletResult {
    switch (params.chain) {
      case 'ethereum': {
        const alreadyExists = Object.keys(this.ethWallets.hd).find(id => {
          return this.ethWallets.hd[id]._mnemonic === params.mnemonic
        })
        if (alreadyExists) {
          throw new Error('Wallet with this mnemonic phrase already exists')
        }
        const walletID = uniqueID()
        const hdWallet = new HDWallet({
          localID: walletID,
          mnemonic: params.mnemonic,
        })
        const accounts = hdWallet.getAccounts()

        this.ethWallets.hd[walletID] = hdWallet
        this.walletAccountNames[accounts[0]] = params.name
        return {
          type: 'hd',
          walletID: toClientId(hdWallet.id),
          accounts,
        }
      }
      default: {
        throw new Error(`Unsupported chain type: ${params.chain}`)
      }
    }
  }

  addHDWalletAccount(params: WalletAddHDAccountParams): string {
    if (!this.ethWallets.hd[params.walletID]) {
      throw new Error('Wallet not found')
    }
    const newAddresses = this.ethWallets.hd[params.walletID].addAccounts([
      params.index,
    ])
    this.walletAccountNames[newAddresses[0]] = params.name
    return newAddresses[0]
  }

  deleteWallet(params: { chain: string, type: WalletTypes, walletID: ID }) {
    if (!this._wallets[params.chain]) {
      throw new Error(`Unsupported chain ${params.chain}`)
    }
    if (!this._wallets[params.chain][params.type]) {
      throw new Error(`Invalid wallet type ${params.type}`)
    }

    const wallet = this._wallets[params.chain][params.type][params.walletID]
    wallet.getAccounts().forEach(a => {
      delete this.walletAccountNames[a]
    })
    delete this._wallets[params.chain][params.type][params.walletID]
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

  async addLedgerEthAccount(params: { index: number }): Promise<void> {
    // Identify ledger wallets with first address
    const firstLedgerAddr = await getAddressAtIndex({ index: 0 })
    const wallet = this.getLedgerEthWalletByFirstAddr(firstLedgerAddr)
    if (wallet) {
      wallet.addAccounts([params.index])
      return
    }
    const ledgerWallet = new LedgerWallet()
    const walletID = uniqueID()
    ledgerWallet._firstAddress = firstLedgerAddr
    ledgerWallet._localID = walletID
    this._wallets.ethereum.ledger[walletID] = ledgerWallet
    ledgerWallet.addAccounts([params.index])
  }
}
