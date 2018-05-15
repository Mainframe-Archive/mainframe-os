// @flow

import { getDaemonRunStatus, getDaemonSocketPath } from '@mainframe/config'

import Command from '../../Command'

// TODO: also display installation status

export default class StatusCommand extends Command {
  static description = 'Display the daemon runnin status and socket path'

  async run() {
    const status = getDaemonRunStatus(this.env)
    const path = getDaemonSocketPath(this.env)
    this.log(`Daemon running status: ${status}, socket path: ${path}`)
  }
}
