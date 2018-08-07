// @flow

import { resolve } from 'path'

import Client from '@mainframe/client'
import {
  getDaemonRunStatus,
  getDaemonSocketPath,
  Environment,
  type VaultConfig,
} from '@mainframe/config'
import { Command as Cmd, flags } from '@oclif/command'

import { promptCreateVault } from './prompts'

export default class Command extends Cmd {
  static flags = {
    env: flags.string({
      char: 'e',
      description: 'Mainframe environment to run the command in',
      env: 'MAINFRAME_ENV',
    }),
    vault: flags.string({
      char: 'v',
      description: 'vault path',
      env: 'MAINFRAME_VAULT',
    }),
  }

  _client: ?Client
  env: Environment
  flags: Object

  get client(): ?Client {
    if (this._client == null) {
      this._client = this.createClient()
    }
    return this._client
  }

  createClient(): ?Client {
    const status = getDaemonRunStatus(this.env)
    if (status === 'running') {
      return new Client(getDaemonSocketPath(this.env))
    }
    this.error('Daemon is not running, use `daemon:start` first')
  }

  resolvePath(path: string): string {
    return resolve(process.cwd(), path)
  }

  async createVault(
    cfg: VaultConfig,
    path: string,
    setDefault: ?boolean = false,
    client: ?Client = this.client,
  ): Promise<void> {
    if (client == null) {
      return
    }

    let vault
    while (vault == null) {
      try {
        vault = await promptCreateVault(setDefault)
      } catch (err) {
        this.warn(err)
      }
    }

    await client.createVault(path, vault.password)

    // Update config after successful creation by daemon
    cfg.setLabel(path, vault.label)
    if (vault.setDefault) {
      cfg.defaultVault = path
    }
  }

  async init() {
    const { flags } = this.parse(this.constructor)
    const name = flags.env || Environment.getDefault()
    if (name == null) {
      throw new Error('Missing environment')
    }
    this.env = Environment.load(name)
    this.flags = flags
  }

  async finally() {
    if (this._client != null) {
      this._client.close()
    }
  }
}
