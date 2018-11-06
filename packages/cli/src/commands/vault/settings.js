// @flow

import { flags } from '@oclif/command'
import Table from 'cli-table'

import Command from '../../OpenVaultCommand'

const KEY_FLAGS = {
  bzzURL: '--bzz-url',
  pssURL: '--pss-url',
  ethURL: '--eth-url',
  ethChainID: '--eth-chain-id',
}

export default class VaultSettingsCommand extends Command {
  static description = 'Get and set vault settings'
  static flags = {
    ...Command.flags,
    'bzz-url': flags.string({
      description: 'Swarm HTTP URL (bzz)',
    }),
    'pss-url': flags.string({
      description: 'Swarm WebSocket URL (pss)',
    }),
    'eth-url': flags.string({
      description: 'Ethereum HTTP URL',
    }),
    'eth-chain-id': flags.string({
      description: 'Ethereum chain id',
    }),
  }

  async run() {
    const client = this.client
    if (client == null) {
      return
    }

    let hasSettings = false
    const settings = {}
    if (this.flags['bzz-url'] != null) {
      hasSettings = true
      settings.bzzURL = this.flags['bzz-url']
    }
    if (this.flags['pss-url'] != null) {
      hasSettings = true
      settings.pssURL = this.flags['pss-url']
    }
    if (this.flags['eth-url'] != null) {
      hasSettings = true
      settings.ethURL = this.flags['eth-url']
    }
    if (this.flags['eth-chain-id'] != null) {
      hasSettings = true
      settings.ethChainID = Number(this.flags['eth-chain-id'])
    }

    const res = hasSettings
      ? await client.vault.setSettings(settings)
      : await client.vault.getSettings()

    const table = new Table({
      head: ['flag', 'value'],
    })
    Object.keys(res).forEach(key => {
      table.push([KEY_FLAGS[key], res[key]])
    })
    // eslint-disable-next-line no-console
    console.log(table.toString())
  }
}
