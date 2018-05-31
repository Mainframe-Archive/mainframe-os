// @flow

import Client from '@mainframe/client'
import {
  getDaemonRunStatus,
  getDaemonSocketPath,
  Environment,
} from '@mainframe/config'
import { Command as Cmd, flags } from '@oclif/command'

export default class Command extends Cmd {
  static flags = {
    env: flags.string({
      char: 'e',
      description: 'Mainframe environment to run the command in',
      env: 'MAINFRAME_ENV',
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

  async init() {
    const { flags } = this.parse(this.constructor)
    this.env = new Environment(flags.env)
    this.flags = flags
  }

  async finally() {
    if (this._client != null) {
      this._client.close()
    }
  }
}
