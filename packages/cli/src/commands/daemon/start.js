// @flow

import { DaemonConfig } from '@mainframe/config'
import { startDaemon } from '@mainframe/toolbox'
import { flags } from '@oclif/command'

import Command from '../../Command'

export default class StartCommand extends Command {
  static description = 'Start the daemon'
  static flags = {
    ...Command.flags,
    detached: flags.boolean({
      char: 'd',
      description: 'start the process in detached mode',
    }),
  }

  async run() {
    const cfg = new DaemonConfig(this.env)
    const status = cfg.runStatus

    this.log(`Starting daemon for environment ${this.env.name}`)

    if (status === 'starting') {
      this.warn('Daemon is already starting from another process')
    } else if (status === 'running') {
      this.log(
        'Daemon is already running from another process. Run "./packages/cli/bin/run daemon:stop" to stop the daemon.',
      )
    } else {
      try {
        const proc = await startDaemon(cfg, this.flags.detached)
        cfg.runStatus = 'running'
        if (proc == null) {
          this.log('Daemon is already running from another process')
          process.exit(0)
        } else if (this.flags.detached) {
          this.log(`Daemon is running in detached mode`)
          process.exit(0)
        } else {
          this.log(`Daemon is running attached to current process`)
          proc.stdout.pipe(process.stdout)
          proc.stderr.pipe(process.stderr)
          proc.on('exit', (code: number) => {
            this.log(`Daemon process terminated with code ${code}`)
            cfg.runStatus = 'stopped'
            process.exit(code)
          })
          process.on('SIGINT', () => {
            this.log('Stopping daemon')
            cfg.runStatus = 'stopping'
            proc.kill('SIGINT')
          })
        }
      } catch (err) {
        cfg.runStatus = 'stopped'
        throw err
      }
    }
  }
}
