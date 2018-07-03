// @flow

import { DaemonConfig } from '@mainframe/config'
import { stopDaemon } from '@mainframe/toolbox'

import Command from '../../Command'

export default class StopCommand extends Command {
  static description = 'Stop the daemon'
  static flags = Command.flags

  async run() {
    const cfg = new DaemonConfig(this.env)
    const status = cfg.runStatus

    this.log(`Stopping daemon using socket path ${cfg.socketPath}`)

    if (status === 'stopping') {
      this.warn('Daemon is already stopping')
    } else if (status === 'stopped') {
      this.log('Daemon is already stopped')
    } else {
      try {
        await stopDaemon(cfg)
        cfg.runStatus = 'stopped'
        this.log('Daemon stopped')
      } catch (err) {
        // Reset to previous status
        cfg.runStatus = status
        this.warn('Failed to stop daemon:', err.message)
      }
    }
  }
}
