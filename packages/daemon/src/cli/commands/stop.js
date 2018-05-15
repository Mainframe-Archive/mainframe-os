// @flow

import { Command, flags } from '@oclif/command'

import { stopServer } from '../../'

export default class StopCommand extends Command {
  async run() {
    await stopServer()
  }
}
