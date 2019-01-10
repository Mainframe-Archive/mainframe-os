// @flow

import repl from 'repl'
import { DaemonConfig, VaultConfig } from '@mainframe/config'

import Command from '../../Command'

export default class REPLCommand extends Command {
  static description = 'Opens a REPL with the injected client'
  static flags = Command.flags

  async run() {
    const r = repl.start({ breakEvalOnSigint: true, prompt: '> ' })

    const vaultConfig = new VaultConfig(this.env)
    let client

    const openVault = async (password: string) => {
      if (client == null) {
        throw new Error('No client')
      }
      const path = vaultConfig.defaultVault
      if (path == null) {
        throw new Error('No default vault path')
      }
      await client.vault.open({ path, password })
      this.log('Vault open!')
    }

    const initializeContext = () => {
      client = this.createClient()
      // $FlowFixMe: VM context
      Object.defineProperty(r.context, 'client', {
        configurable: false,
        enumerable: true,
        value: client,
      })
    }

    initializeContext()
    // $FlowFixMe: VM context
    Object.defineProperty(r.context, 'env', {
      configurable: false,
      enumerable: true,
      value: this.env,
    })
    // $FlowFixMe: VM context
    Object.defineProperty(r.context, 'daemonConfig', {
      configurable: false,
      enumerable: true,
      value: new DaemonConfig(this.env),
    })
    // $FlowFixMe: VM context
    Object.defineProperty(r.context, 'vaultConfig', {
      configurable: false,
      enumerable: true,
      value: vaultConfig,
    })
    // $FlowFixMe: VM context
    Object.defineProperty(r.context, 'openVault', {
      configurable: false,
      enumerable: true,
      value: openVault,
    })

    r.on('reset', initializeContext)

    r.on('exit', () => {
      process.exit()
    })
  }
}
