// @flow

type WalletsByIdentity = {
  [id: string]: {
    [walletID: string]: Array<string>,
  },
}

type IdentitiesByWallet = {
  [walletID: string]: {
    [address: string]: Array<string>,
  },
}

export type IdentityWalletsParams = {
  walletsByIdentity: WalletsByIdentity,
  identitiesByWallet: IdentitiesByWallet,
}

export type IdentityWalletsSerialized = IdentityWalletsParams

export default class IdentityWallets {
  static fromJSON = (params: IdentityWalletsSerialized): IdentityWallets => {
    return new IdentityWallets(params)
  }

  static toJSON = (
    identityWallets: IdentityWallets,
  ): IdentityWalletsSerialized => {
    return {
      walletsByIdentity: identityWallets.walletsByIdentity,
      identitiesByWallet: identityWallets.identitiesByWallet,
    }
  }

  _walletsByIdentity: WalletsByIdentity
  _identitiesByWallet: IdentitiesByWallet

  constructor(params: ?IdentityWalletsParams) {
    this._walletsByIdentity = params ? params.walletsByIdentity : {}
    this._identitiesByWallet = params ? params.identitiesByWallet : {}
  }

  get walletsByIdentity(): WalletsByIdentity {
    return this._walletsByIdentity
  }

  get identitiesByWallet(): IdentitiesByWallet {
    return this._identitiesByWallet
  }

  linkWalletToIdentity(id: string, walletID: string, walletAddr: string) {
    if (!this.walletsByIdentity[id]) {
      this.walletsByIdentity[id] = { [walletID]: [walletAddr] }
    } else if (!this.walletsByIdentity[id][walletID]) {
      this.walletsByIdentity[id][walletID] = [walletAddr]
    } else if (!this.walletsByIdentity[id][walletID].includes(walletAddr)) {
      this.walletsByIdentity[id][walletID].push(walletAddr)
    }

    if (!this.identitiesByWallet[walletID]) {
      this.identitiesByWallet[walletID] = { [walletAddr]: [id] }
    } else if (!this.identitiesByWallet[walletID][walletAddr]) {
      this.identitiesByWallet[walletID][walletAddr] = [id]
    } else if (!this.identitiesByWallet[walletID][walletAddr].includes(id)) {
      this.identitiesByWallet[walletID][walletAddr].push(id)
    }
  }

  unlinkWalletToIdentity(id: string, walletID: string, walletAddr: string) {
    if (this.walletsByIdentity[id] && this.walletsByIdentity[id][walletID]) {
      const index = this.walletsByIdentity[id][walletID].indexOf(walletAddr)
      if (index !== -1) {
        if (this.walletsByIdentity[id][walletID].length === 1) {
          delete this.walletsByIdentity[id][walletID]
        } else {
          this.walletsByIdentity[id][walletID].splice(index, 1)
        }
      }
    }

    if (
      this.identitiesByWallet[walletID] &&
      this.identitiesByWallet[walletID][walletAddr]
    ) {
      const index = this.identitiesByWallet[walletID][walletAddr].indexOf(id)
      if (index !== -1) {
        if (this.identitiesByWallet[walletID][walletAddr].length === 1) {
          delete this.identitiesByWallet[walletID][walletAddr]
        } else {
          this.identitiesByWallet[walletID][walletAddr].splice(index, 1)
        }
      }
    }
  }

  deleteWallet(walletID: string) {
    if (this.identitiesByWallet[walletID]) {
      delete this.identitiesByWallet[walletID]
      Object.keys(this.walletsByIdentity).forEach(id => {
        if (this.walletsByIdentity[id][walletID]) {
          delete this.walletsByIdentity[id][walletID]
        }
      })
    }
  }

  // TODO: - Call when implementing delete wallet account rpc method
  deleteWalletAccount(walletID: string, address: string) {
    if (this.identitiesByWallet[walletID]) {
      if (this.identitiesByWallet[walletID][address]) {
        delete this.identitiesByWallet[walletID][address]
      }
      Object.keys(this.walletsByIdentity).forEach(id => {
        if (this.walletsByIdentity[id][walletID]) {
          const index = this.walletsByIdentity[id][walletID].indexOf(address)
          if (index !== -1) {
            this.walletsByIdentity[id][walletID].splice(index, 1)
          }
        }
      })
    }
  }

  // TODO: - Call when implementing delete identity rpc methods
  deleteIdentity(id: string) {
    if (this.walletsByIdentity[id]) {
      delete this.walletsByIdentity[id]
      Object.keys(this.identitiesByWallet).forEach(walletID => {
        Object.keys(this.identitiesByWallet[walletID]).forEach(address => {
          const index = this.identitiesByWallet[walletID][address].indexOf(id)
          if (index !== -1) {
            this.identitiesByWallet[walletID][address].splice(index, 1)
          }
        })
      })
    }
  }
}
