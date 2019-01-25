// @flow
import { flags } from '@oclif/command'
import { prompt } from 'inquirer'

import Command from '../../OpenVaultCommand'

export default class ContactDeleteCommand extends Command {
  static description = 'Delete contact'
  static flags = {
    ...Command.flags,
    uid: flags.string({
      description: 'local user id',
    }),
    cid: flags.string({
      description: 'local contact ID',
    }),
  }

  async run() {
    const client = this.client
    if (client == null) {
      return
    }
    const { confirmed } = await prompt({
      type: 'confirm',
      name: 'confirmed',
      message: `Are you sure you want to delete this contact "${
        this.flags.cid
      }"? This CAN NOT be reversed.`,
      default: false,
    })
    if (confirmed) {
      await client.identity.deleteContact({
        userID: this.flags.uid,
        contactID: this.flags.cid,
      })

      this.log(`Removed contact: ${this.flags.cid}`)
    }
  }
}
