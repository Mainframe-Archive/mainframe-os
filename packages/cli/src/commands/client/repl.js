// @flow

import repl from 'repl'

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
    // $FlowFixMe: VM context
    Object.defineProperty(r.context, 'env', {
      configurable: false,
      enumerable: true,
      value: this.env,
    })

    r.on('reset', initializeContext)

    r.on('exit', () => {
      process.exit()
    })
  }
}
