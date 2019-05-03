// @flow

import type { BrowserWindow, WebContents } from 'electron'
import { getPassword, setPassword } from 'keytar'
import nanoid from 'nanoid'

import type { Config } from '../config'
import { createDB } from '../db'
import type { DB } from '../db/types'
import type { Environment } from '../environment'
import type { Logger } from '../logger'

import { LauncherContext } from './launcher'
import { UserContext } from './user'

const PASSWORD_SERVICE = 'MainframeOS'

export type ContextParams = {
  env: Environment,
  logger: Logger,
}

export type AddLauncherParams = {
  launcherID?: ?string,
  userID?: ?string,
  window: BrowserWindow,
}

export class SystemContext {
  _launchers: { [id: string]: LauncherContext } = {}
  _launchersByContents: WeakMap<WebContents, string> = new WeakMap()
  _resolveDB: (db: DB) => void
  _users: { [id: string]: UserContext } = {}

  db: ?DB
  dbReady: Promise<DB>
  env: Environment
  initialized: boolean = false
  logger: Logger

  constructor(params: ContextParams) {
    this.dbReady = new Promise(resolve => {
      this._resolveDB = (db: DB) => {
        this.db = db
        resolve(db)
      }
    })
    this.env = params.env
    this.logger = params.logger.child({ context: 'system' })
    this.logger.log({
      level: 'debug',
      message: 'System context created',
      envName: this.env.name,
      envType: this.env.type,
      config: this.config.store,
    })
  }

  get config(): Config {
    return this.env.config
  }

  get defaultUser(): ?string {
    return this.config.get('defaultUser')
  }

  set defaultUser(id: ?string): void {
    this.logger.log({
      level: 'debug',
      message: 'Set default user',
      id,
    })
    if (id == null) {
      this.config.delete('defaultUser')
    } else {
      this.config.set('defaultUser', id)
    }
  }

  async initialize() {
    this.logger.debug('Initialize')

    if (this.config.get('dbCreated')) {
      if (this.config.get('savePassword')) {
        try {
          const password = await this.getPassword()
          if (password == null) {
            this.logger.warn(
              'Context password not found even though it should be saved',
            )
          } else {
            await this.openDB(password)
            this.logger.debug('Database opened using saved password')
          }
        } catch (error) {
          this.logger.log({
            level: 'error',
            message: 'Failed to open database using saved password',
            error: error.toString(),
          })
        }
      } else {
        this.logger.debug('No saved password to open database')
      }
    } else {
      this.logger.debug('No database created yet')
    }

    this.initialized = true
  }

  async getPassword(): Promise<string | null> {
    try {
      return await getPassword(
        PASSWORD_SERVICE,
        `${this.env.name}-${this.env.type}`,
      )
    } catch (error) {
      this.logger.log({
        level: 'error',
        message: 'Failed to retrieve password from keychain',
        error,
      })
      return null
    }
  }

  async savePassword(password: string): Promise<void> {
    try {
      await setPassword(
        PASSWORD_SERVICE,
        `${this.env.name}-${this.env.type}`,
        password,
      )
      this.env.config.set('savePassword', true)
    } catch (error) {
      this.logger.log({
        level: 'error',
        message: 'Failed to save password to keychain',
        error,
      })
    }
  }

  async openDB(password: string): Promise<DB> {
    if (this.db != null) {
      throw new Error('DB already open')
    }

    const db = await createDB({
      location: this.env.getDBPath(),
      logger: this.logger,
      password,
    })

    if (this.config.get('dbCreated', false) === false) {
      this.config.set('dbCreated', true)
    }

    this._resolveDB(db)
    return db
  }

  getLauncherContext(idOrContents: string | WebContents): ?LauncherContext {
    const id =
      typeof idOrContents === 'string'
        ? idOrContents
        : this._launchersByContents.get(idOrContents)
    if (id != null) {
      return this._launchers[id]
    }
  }

  addLauncherContext(params: AddLauncherParams): LauncherContext {
    const info = { launcherID: params.launcherID, windowID: params.window.id }

    if (params.launcherID != null) {
      const byID = this.getLauncherContext(params.launcherID)
      if (byID != null) {
        this.logger.log({
          ...info,
          level: 'warn',
          message: 'A launcher context with this ID already exists',
        })
        return byID
      }
    }

    const byContents = this.getLauncherContext(params.window.webContents)
    if (byContents != null) {
      this.logger.log({
        ...info,
        level: 'warn',
        message: 'A launcher context with this window already exists',
      })
      return byContents
    }

    const ctx = new LauncherContext({
      launcherID: params.launcherID || nanoid(),
      system: this,
      userID: params.userID,
      window: params.window,
    })
    this._launchers[ctx.launcherID] = ctx
    this._launchersByContents.set(params.window.webContents, ctx.launcherID)

    return ctx
  }

  getUserContext(userID: string): UserContext {
    if (this._users[userID] == null) {
      this.logger.log({
        level: 'debug',
        message: 'Create user context',
        userID,
      })
      if (this.db == null) {
        throw new Error(
          'Cannot create user context before database is accessible',
        )
      }
      this._users[userID] = new UserContext({
        db: this.db,
        logger: this.logger,
        userID,
      })
    }
    return this._users[userID]
  }

  deleteUserContext(userID: string) {
    delete this._users[userID]
  }
}
