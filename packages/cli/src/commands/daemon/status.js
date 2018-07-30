// @flow

import { getDaemonRunStatus, getDaemonSocketPath } from '@mainframe/config'

import Command from '../../Command'

// TODO: also display installation status

export default class StatusCommand extends Command {
  static description = 'Display the daemon running status and socket path'
  static flags = Command.flags

  async run() {
    const status = getDaemonRunStatus(this.env)
    const path = getDaemonSocketPath(this.env)
    this.log(
      `Daemon running status for environment ${
        this.env.name
      }: ${status}, socket path: ${path}`,
    )
  }
}
