// @flow

// UI

export type Style = number | Array<Object | number> | Object

// Vault

export type VaultPath = string
export type VaultLabel = string

export type VaultsData = {
  vaults: { [VaultPath]: VaultLabel },
  defaultVault: VaultPath,
  vaultOpen: boolean,
}
