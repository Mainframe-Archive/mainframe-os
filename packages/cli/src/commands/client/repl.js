// @flow

import repl from 'repl'
import { DaemonConfig, VaultConfig } from '@mainframe/config'

import Command from '../../Command'

export default class REPLCommand extends Command {
  static description = 'Opens a REPL with the injected client'
  static flags = Command.flags

  async run() {
    const r = repl.start({ breakEvalOnSigint: true, prompt: '> ' })

    const initializeContext = () => {
      // $FlowFixMe: VM context
      Object.defineProperty(r.context, 'client', {
        configurable: false,
        enumerable: true,
        value: this.createClient(),
      })
    }

    initializeContext()
    await r.context.client.vault.open({
      path:
        '/Users/adamclarke/Library/Preferences/mainframe-env-tests-nodejs/vaults/xDKvJS6lDaba4_ZiRIlSu',
      password: 'password',
    })
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
      value: new VaultConfig(this.env),
    })

    r.on('reset', initializeContext)

    r.on('exit', () => {
      process.exit()
    })
  }
}
