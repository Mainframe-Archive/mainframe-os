// @flow

import bip39 from 'bip39'
import sigUtil from 'eth-sig-util'
import type EthWallet from 'ethereumjs-wallet'
import HDkey from 'ethereumjs-wallet/hdkey'
import nanoid from 'nanoid'
import type { RxDatabase } from 'rxdb'

import { COLLECTION_NAMES } from '../constants'

import schema from '../schemas/ethWalletHD'

const getAddress = (wallet: EthWallet): string => {
  return sigUtil.normalize(wallet.getAddress().toString('hex'))
}

const getWallet = (root: any, index: number): EthWallet => {
  return root.deriveChild(index).getWallet()
}

export default async (db: RxDatabase) => {
  return await db.collection({
    name: COLLECTION_NAMES.ETH_WALLETS_HD,
    schema,
    statics: {
      async create(data: { name: string }) {
        const doc = this.newDocument({
          ...data,
          localID: nanoid(),
          mnemonic: bip39.generateMnemonic(),
        })
        doc.activeAccounts = [
          {
            index: 0,
            address: getAddress(getWallet(doc.getRoot(), 0)),
          },
        ]
        await doc.save()
        return doc
      },
    },
    methods: {
      getSeed() {
        if (this._seed == null) {
          this._seed = bip39.mnemonicToSeed(this.mnemonic)
        }
        return this._seed
      },
      getHDKey() {
        if (this._hdKey == null) {
          this._hdKey = HDkey.fromMasterSeed(this.getSeed())
        }
        return this._hdKey
      },
      getRoot() {
        if (this._root == null) {
          this._root = this.getHDKey().derivePath(this.hdPath)
        }
        return this._root
      },
      async addAccounts(indexes: Array<number>) {
        const existingIndexes = this.activeAccounts.map(a => a.index)
        const addIndexes = indexes.filter(i => !existingIndexes.contains(i))
        const root = this.getRoot()
        const accounts = addIndexes.map(index => ({
          index,
          address: getAddress(getWallet(root, index)),
        }))
        await this.update({ $addToSet: { activeAccounts: accounts } })
      },
    },
  })
}
