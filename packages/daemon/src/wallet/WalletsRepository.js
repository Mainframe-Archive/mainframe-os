// @flow
import {
  type WalletSignTxParams,
  type WalletSignTxResult,
  type WalletCreateHDParams,
  type WalletImportPKParams,
  type WalletResult,
  idType as idTypeToClient,
} from '@mainframe/client'
import { uniqueID, idType } from '@mainframe/utils-id'

import { mapObject } from '../utils'
import HDWallet, { type HDWalletSerialized } from './HDWallet'
import PKWallet, { type PKWalletSerialized } from './PKWallet'
import LedgerWallet, { type LedgerWalletSerialized } from './LedgerWallet'
import AbstractWallet from './AbstractWallet'

const hdWalletsToJSON = mapObject(HDWallet.toJSON)
const hdWalletsFromJSON = mapObject(HDWallet.fromJSON)
const pkWalletsToJSON = mapObject(PKWallet.toJSON)
const pkWalletsFromJSON = mapObject(PKWallet.fromJSON)

export type WalletCollection = {
  hd: { [id: string]: HDWallet },
  ledger: { [id: string]: LedgerWallet },
  pk: { [id: string]: PKWallet },
}

export type Wallets = {
  ethereum: WalletCollection,
}

export type WalletsRepositoryParams = {
  ethereum: WalletCollection,
}

export type WalletsRepositorySerialized = {
  ethereum: {
    hd: { [id: string]: HDWalletSerialized },
    ledger: { [id: string]: LedgerWalletSerialized },
    pk: { [id: string]: PKWalletSerialized },
  },
}

export default class WalletsRepository {
  static fromJSON = (
    serialized: WalletsRepositorySerialized,
  ): WalletsRepository => {
    return new WalletsRepository({
      ethereum: {
        // $FlowFixMe: mapping type
        hd: hdWalletsFromJSON(serialized.ethereum.hd),
        // $FlowFixMe: mapping type
        pk: pkWalletsFromJSON(serialized.ethereum.pk),
        ledger: {},
      },
    })
  }

  static toJSON = (
    registry: WalletsRepository,
  ): WalletsRepositorySerialized => {
    return {
      ethereum: {
        // $FlowFixMe: mapping type
        hd: hdWalletsToJSON(registry.ethWallets.hd),
        // $FlowFixMe: mapping type
        pk: pkWalletsToJSON(registry.ethWallets.pk),
        ledger: {},
      },
    }
  }

  _wallets: Wallets

  constructor(params?: WalletsRepositoryParams) {
    this._wallets = params
      ? params
      : {
          ethereum: {
            hd: {},
            pk: {},
            ledger: {},
          },
        }
  }

  get ethWallets(): WalletCollection {
    return this._wallets.ethereum
  }

  getEthWalletByID(id: string): ?AbstractWallet {
    return (
      this.ethWallets.hd[id] ||
      this.ethWallets.pk[id] ||
      this.ethWallets.ledger[id]
    )
  }

  getFirstEthWallet(): ?AbstractWallet {
    const priority = ['hd', 'ledger', 'pk']
    let wallet
    priority.forEach(type => {
      if (Object.keys(this.ethWallets[type]).length) {
        return this.ethWallets[type][Object.keys(this.ethWallets[type])[0]]
      }
    })
  }

  createHDWallet(params: WalletCreateHDParams) {
    switch (params.chain) {
      case 'ethereum': {
        const hdWallet = new HDWallet()
        const pubKey = hdWallet.publicExtendedKey
        const accounts = hdWallet.getAccounts()
        hdWallet._walletID = uniqueID()
        this.ethWallets.hd[hdWallet.id] = hdWallet
        return {
          type: 'hd',
          walletID: pubKey,
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
          // Create a new Simple wallet
          walletID = uniqueID()
          wallet = new PKWallet({ walletID, privateKeys: [] })
          this.ethWallets.pk[walletID] = wallet
        }
        wallet.importAccountByPK(params.privateKey)
        const accounts = wallet.getAccounts()
        return {
          type: 'pk',
          walletID: idTypeToClient(wallet.id),
          accounts,
        }
      }
      default: {
        throw new Error(`Unsupported chain type: ${params.chain}`)
      }
    }
  }

  async signTransaction(params: WalletSignTxParams): WalletSignTxResult {
    switch (params.chain) {
      case 'ethereum':
        return this.signEthTransaction(params)
      default:
        throw new Error(`Unsupported blockchain type: ${params.chain}`)
    }
  }

  getEthWalletByAccount(account: string): ?AbstractWallet {
    let wallet
    Object.keys(this.ethWallets).forEach(type => {
      Object.keys(this.ethWallets[type]).forEach(w => {
        const keyring = this.ethWallets[type][w]
        const foundWallet = keyring._walletByAddress(account)
        if (foundWallet) {
          wallet = keyring
        }
      })
    })
    return wallet
  }

  async signEthTransaction(params: WalletSignTxParams): WalletSignTxResult {
    const wallet = this.getEthWalletByAccount(params.transactionData.from)
    if (!wallet) {
      throw new Error('Wallet not found')
    }
    return wallet.signTransaction(params.transactionData)
  }
}
