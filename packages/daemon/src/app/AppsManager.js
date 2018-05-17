// @flow

import { mapObject, type ID } from '../utils'

import App, { type AppSerialized } from './App'

export type AppsManagerSerialized = Array<AppSerialized>

type Apps = { [ID]: App }

const appsToJSON = mapObject(App.toJSON)

export default class AppsManager {
  static fromJSON = (serialized: AppsManagerSerialized = []) => {
    const apps = serialized.reduce((acc, params) => {
      acc[(params.appID: string)] = App.fromJSON(params)
      return acc
    }, {})
    return new AppsManager(apps)
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
