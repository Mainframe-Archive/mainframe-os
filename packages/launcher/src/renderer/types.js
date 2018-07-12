// @flow

// UI

export type Style = number | Array<Object | number> | Object

// Vault

export type VaultPath = string

export type VaultsData = {
  paths: Array<VaultPath>,
  defaultVault: VaultPath,
  vaultOpen: boolean,
}
