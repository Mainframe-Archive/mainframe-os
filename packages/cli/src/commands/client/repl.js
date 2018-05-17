// @flow

import Client from '@mainframe/client'
import { getDaemonSocketPath } from '@mainframe/config'
import repl from 'repl'

import Command from '../../Command'

export default class REPLCommand extends Command {
  static description = 'Opens a REPL with the injected client'
  static flags = Command.flags

  async run() {
    const r = repl.start({ breakEvalOnSigint: true, prompt: '> ' })

    const initializeContext = context => {
      // $FlowFixMe: VM context
      Object.defineProperty(r.context, 'client', {
        configurable: false,
        enumerable: true,
        value: new Client(getDaemonSocketPath(this.env)),
      })
    }

    initializeContext(r.context)
    r.on('reset', initializeContext)

    r.on('exit', () => {
      process.exit()
    })
  }
}
