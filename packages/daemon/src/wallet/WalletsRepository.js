// @flow

import { uniqueID } from '@mainframe/utils-id'

import { mapObject } from '../utils'
import type {
  WalletEthSignTxParams,
  WalletSignDataParams,
} from './AbstractWallet'
import HDWallet, { type HDWalletSerialized } from './HDWallet'
import LedgerWallet, { type LedgerWalletSerialized } from './LedgerWallet'
import { getAddressAtIndex } from './ledgerClient'

const hdWalletsToJSON = mapObject(HDWallet.toJSON)
const hdWalletsFromJSON = mapObject(HDWallet.fromJSON)
const ledgerWalletsToJSON = mapObject(LedgerWallet.toJSON)
const ledgerWalletsFromJSON = mapObject(LedgerWallet.fromJSON)

export type WalletTypes = 'hd' | 'ledger'

export type Blockchains = 'ethereum'

export type WalletCollection = {
  hd: { [id: string]: HDWallet },
  ledger: { [id: string]: LedgerWallet },
}

export type Wallets = {
  ethereum: WalletCollection,
}

export type WalletsRepositoryParams = {
  wallets: {
    ethereum: WalletCollection,
  },
}

export type WalletsRepositorySerialized = {
  wallets: {
    ethereum: {
      hd: { [id: string]: HDWalletSerialized },
      ledger: { [id: string]: LedgerWalletSerialized },
    },
  },
}

export type WalletAddLedgerResult = {
  localID: string,
  addresses: Array<string>,
}

export type ImportHDWalletParams = {
  blockchain: Blockchains,
  mnemonic: string,
  name: string,
  userID?: string,
}

export type AddHDWalletAccountParams = {
  walletID: string,
  index: number,
  userID?: string,
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

  createHDWallet(blockchain: Blockchains, name: string): HDWallet {
    switch (blockchain) {
      case 'ethereum': {
        const hdWallet = HDWallet.create(name)
        this.ethWallets.hd[hdWallet.id] = hdWallet
        return hdWallet
      }
      default: {
        throw new Error(`Unsupported blockchain type: ${blockchain}`)
      }
    }
  }

  importMnemonicWallet(params: ImportHDWalletParams): HDWallet {
    switch (params.blockchain) {
      case 'ethereum': {
        const alreadyExists = Object.keys(this.ethWallets.hd).find(id => {
          return this.ethWallets.hd[id].mnemonic === params.mnemonic
        })
        if (alreadyExists) {
          throw new Error('Wallet with this mnemonic phrase already exists')
        }
        const hdWallet = HDWallet.import({
          mnemonic: params.mnemonic,
          name: params.name,
        })
        this.ethWallets.hd[hdWallet.id] = hdWallet
        return hdWallet
      }
      default: {
        throw new Error(`Unsupported blockchain type: ${params.blockchain}`)
      }
    }
  }

  addHDWalletAccount(params: AddHDWalletAccountParams): string {
    const wallet = this.getEthHDWallet(params.walletID)
    if (!wallet) {
      throw new Error('Wallet not found')
    }
    const addresses = wallet.addAccounts([params.index])
    return addresses[0]
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

  async signEthTransaction(
    params: WalletEthSignTxParams,
    chainID: string,
  ): Promise<string> {
    const wallet = this.getEthWalletByAccount(params.from)
    if (!wallet) {
      throw new Error('Wallet not found')
    }
    return wallet.signTransaction(params, chainID)
  }

  async signEthData(params: WalletSignDataParams): Promise<string> {
    const wallet = this.getEthWalletByAccount(params.address)
    if (!wallet) {
      throw new Error('Wallet not found')
    }
    return wallet.sign(params)
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

  async addLedgerEthAccounts(
    indexes: Array<number>,
    name: string,
  ): Promise<WalletAddLedgerResult> {
    // Identify ledger wallets with first address
    const firstLedgerAddr = await getAddressAtIndex({ index: 0 })
    let ledgerWallet = this.getLedgerEthWalletByFirstAddr(firstLedgerAddr)
    if (!ledgerWallet) {
      const walletID = uniqueID()
      ledgerWallet = new LedgerWallet({
        name,
        localID: walletID,
        firstAddress: firstLedgerAddr,
        activeAccounts: {},
      })
      this._wallets.ethereum.ledger[walletID] = ledgerWallet
    }

    const addresses = await ledgerWallet.addAccounts(indexes)

    return {
      localID: ledgerWallet.id,
      addresses: addresses,
    }
  }
}
