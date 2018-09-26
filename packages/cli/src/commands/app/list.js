// @flow
import util from 'util'

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
        this.log(`\n  ${app.manifest.name}, v${app.manifest.version}\n`)
        this.log('      ID:', app.appID)
        if (type === 'own') {
          this.log('     MainframeID: ', app.manifest.mainframeID)
          this.log('     Developer: ', app.manifest.developerID)
          this.log('     Contents Path: ', app.manifest.contentsPath)
        } else {
          this.log('     Author: ', app.manifest.author.id)
          this.log('     Contents URI: ', app.manifest.contentsURI)
          this.log('     Permissions: ', util.inspect(app.manifest.permissions))
        }
        this.log('     Users: ', app.users, '\n')
      })
    })
  }
}
