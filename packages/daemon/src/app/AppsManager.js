// @flow

import type { ID } from '@mainframe/utils-id'

import { mapObject } from '../utils'

import App, { type AppSerialized } from './App'

export type AppsManagerSerialized = Array<AppSerialized>

type Apps = { [ID]: App }

const appsToJSON = mapObject(App.toJSON)
const appsFromJSON = mapObject(App.fromJSON)

export default class AppsManager {
  static fromJSON = (serialized: AppsManagerSerialized): AppsManager => {
    // $FlowFixMe: mapping type
    return new AppsManager(appsFromJSON(serialized))
  }

  static toJSON = (manager: AppsManager): AppsManagerSerialized => {
    // $FlowFixMe: mapping type
    return appsToJSON(manager.apps)
  }

  _apps: Apps

  constructor(apps: Apps = {}) {
    this._apps = apps
  }

  get apps(): Apps {
    return this._apps
  }

  getApp(id: ID): ?App {
    return this._apps[id]
  }
}
