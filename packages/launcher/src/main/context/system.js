// @flow

import type { WebContents } from 'electron'
import { getPassword, setPassword } from 'keytar'
import nanoid from 'nanoid'

import type { Config } from '../config'
import { createDB } from '../db'
import type { DB } from '../db/types'
import type { Environment } from '../environment'
import type { Logger } from '../logger'
import { createAppWindow, createLauncherWindow } from '../windows'

import { AppContext, AppSession } from './app'
import { LauncherContext } from './launcher'
import { UserContext } from './user'

const PASSWORD_SERVICE = 'MainframeOS'

export type ContextParams = {
  env: Environment,
  logger: Logger,
}

export class SystemContext {
  _apps: { [id: string]: AppContext } = {}
  _appsBySandboxContents: WeakMap<WebContents, string> = new WeakMap()
  _appsByTrustedContents: WeakMap<WebContents, string> = new WeakMap()
  _launchers: { [id: string]: LauncherContext } = {}
  _launchersByContents: WeakMap<WebContents, string> = new WeakMap()
  _resolveDB: (db: DB) => void
  _users: { [id: string]: UserContext } = {}

  db: ?DB
  dbReady: Promise<DB>
  env: Environment
  initialized: boolean = false
  syncing: boolean = false
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

  // Getters

  get config(): Config {
    return this.env.config
  }

  get defaultUser(): ?string {
    return this.config.get('defaultUser')
  }

  set defaultUser(id: ?string): void {
    if (id == null) {
      this.logger.debug('Remove default user')
      this.config.delete('defaultUser')
    } else {
      this.logger.log({
        level: 'debug',
        message: 'Set default user',
        id,
      })
      this.config.set('defaultUser', id)
    }
  }

  // Lifecycle

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
            if (this.config.has('defaultUser')) {
              await this.startSync()
            }
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

  async startSync() {
    if (this.syncing) {
      this.logger.warn('Already syncing, ignoring startSync() call')
      return
    }

    const db = this.db
    if (db == null) {
      throw new Error('Could not setup syncing without an opened database')
    }
    if (this.defaultUser == null) {
      throw new Error('Could not setup syncing without a default user')
    }

    const user = await db.users.findOne(this.defaultUser).exec()
    if (user == null) {
      throw new Error('Default user not found')
    }

    this.logger.debug('Start sync')

    db.peers.startSync(user.getBzz())
    db.users.startSync(this.env)

    this.syncing = true
  }

  stopSync() {
    if (!this.syncing) {
      return
    }

    const db = this.db
    if (db == null) {
      this.logger.debug('No opened database to stop sync')
    } else {
      this.logger.debug('Stop sync')
      db.peers.stopSync()
      db.users.stopSync()
    }

    this.syncing = false
  }

  // DB

  async getPassword(): Promise<string | null> {
    try {
      return await getPassword(
        PASSWORD_SERVICE,
        `${this.env.name}-${this.env.type}`,
      )
    } catch (err) {
      this.logger.log({
        level: 'error',
        message: 'Failed to retrieve password from keychain',
        error: err.toString(),
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
    } catch (err) {
      this.logger.log({
        level: 'error',
        message: 'Failed to save password to keychain',
        error: err.toString(),
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

  // Contexts and windows

  getAppContext(idOrContents: string | WebContents): ?AppContext {
    const id =
      typeof idOrContents === 'string'
        ? idOrContents
        : this._appsByTrustedContents.get(idOrContents) ||
          this._appsBySandboxContents.get(idOrContents)
    if (id != null) {
      return this._apps[id]
    }
  }

  createAppContext(id: string, session: AppSession): AppContext {
    const existing = this._apps[id]
    if (existing != null) {
      return existing
    }

    const ctx = new AppContext({
      session,
      system: this,
      window: createAppWindow(),
    })

    this._apps[id] = ctx
    this._appsByTrustedContents.set(window.webContents, id)

    window.webContents.on('did-attach-webview', (event, webContents) => {
      webContents.on('destroyed', () => {
        this._appsBySandboxContents.delete(webContents)
        ctx.sandbox = null
      })
      this._appsBySandboxContents.set(webContents, id)
      ctx.attachSandbox(webContents)
    })

    return ctx
  }

  async openAppVersion(userAppVersionID: string): Promise<AppContext> {
    const session = await AppSession.fromUserAppVersion(this, userAppVersionID)
    return this.createAppContext(userAppVersionID, session)
  }

  async openOwnApp(userOwnAppID: string): Promise<AppContext> {
    const session = await AppSession.fromUserOwnApp(this, userOwnAppID)
    return this.createAppContext(userOwnAppID, session)
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

  openLauncher(userID?: ?string): LauncherContext {
    if (userID != null) {
      // $FlowFixMe: Object.values losing type
      const existing: ?LauncherContext = Object.values(this._launchers).find(
        // $FlowFixMe: Object.values losing type
        ctx => ctx.userID === userID,
      )
      if (existing != null) {
        existing.showWindow()
        return existing
      }
    }

    const ctx = new LauncherContext({
      launcherID: nanoid(),
      system: this,
      userID,
      window: createLauncherWindow(),
    })
    this._launchers[ctx.launcherID] = ctx
    this._launchersByContents.set(ctx.window.webContents, ctx.launcherID)

    ctx.window.on('closed', async () => {
      // await ctx.clear()
      delete this._launchers[ctx.launcherID]
    })

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
