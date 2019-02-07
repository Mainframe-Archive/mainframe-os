// @flow
import util from 'util'
import Table from 'cli-table'

import Command from '../../OpenVaultCommand'

export default class AppListCommand extends Command {
  static description = `List apps you've created and installed`
  static flags = Command.flags

  async run() {
    // $FlowFixMe: indexer property
    const res = await this.client.app.getAll()
    Object.keys(res).forEach(type => {
      this.log(`\n${type === 'own' ? 'Created' : 'Installed'} Apps\n`)
      res[type].forEach(app => {
        const table = new Table({
          head: [app.manifest.name],
        })
        let contentsPath, mainframeID, developerId
        if (type === 'own') {
          contentsPath = app.manifest.contentsPath
          developerId = app.manifest.developerID
          mainframeID = app.manifest.mfid
        } else {
          contentsPath = app.manifest.contentsHash
          developerId = app.manifest.author.id
          mainframeID = ''
        }

        table.push(
          ['ID', app.localID],
          ['Mainframe ID', mainframeID],
          ['Version', app.manifest.version],
          ['Developer', developerId],
          ['Contents', contentsPath],
          ['Users', util.inspect(app.users)],
          ['Permissions', util.inspect(app.manifest.permissions) || {}],
        )
        this.log(table.toString())
      })
    })
  }
}
