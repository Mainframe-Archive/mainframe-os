// @flow

import App, { type AppSerialized } from './App'
import { type ID, typeID, objectValues } from '../utils'

export type AppsManagerSerialized = Array<AppSerialized>

type Apps = { [id: ID]: App }

export default class AppsManager {
  static hydrate = (serialized: AppsManagerSerialized) => {
    const apps = serialized.reduce((acc, params) => {
      acc[params.id] = App.hydrate(params)
      return acc
    }, {})
    return new AppsManager(apps)
  }

  _apps: Apps

  constructor(apps: Apps) {
    this._apps = apps
  }

  serialized(): AppsManagerSerialized {
    return objectValues(this._apps).map(App.serialize)
  }
}
