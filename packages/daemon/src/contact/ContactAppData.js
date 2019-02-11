// @flow

import { mapObject } from '../utils'
import type { bzzHash } from '../swarm/feed'
import SharedAppData, { type SharedAppDataSerialized } from './SharedAppData'

type AppID = string
type ContactID = string

type AppsByContact = {
  [contactID: ContactID]: {
    [appID: AppID]: SharedAppData,
  },
}

type AppsByContactSerialized = {
  [contactID: ContactID]: {
    [appID: AppID]: SharedAppDataSerialized,
  },
}

type ContactsByApp = {
  [appID: AppID]: {
    [contactID: ContactID]: SharedAppData,
  },
}

export type ContactAppDataParams = {
  appsByContact: AppsByContact,
}

export type ContactAppDataSerialized = {
  appsByContact: AppsByContactSerialized,
}

const fromSharedAppData = mapObject(mapObject(SharedAppData.toJSON))
const toSharedAppData = mapObject(mapObject(SharedAppData.fromJSON))

export default class ContactAppData {
  static fromJSON = (params: ContactAppDataSerialized): ContactAppData => {
    return new ContactAppData({
      // $FlowFixMe: mapping type
      appsByContact: toSharedAppData(params.appsByContact),
    })
  }

  static toJSON = (
    contactAppData: ContactAppData,
  ): ContactAppDataSerialized => {
    return {
      // $FlowFixMe: mapping type
      appsByContact: fromSharedAppData(contactAppData.appsByContact),
    }
  }

  _appsByContact: AppsByContact
  _contactsByApp: ContactsByApp

  constructor(params: ?ContactAppDataParams) {
    this._appsByContact = params ? params.appsByContact : {}

    // Generate reverse index
    this._contactsByApp = {}
    Object.keys(this._appsByContact).forEach(contactID => {
      Object.keys(this._appsByContact[contactID]).forEach(appID => {
        if (this._contactsByApp[appID] == null) {
          this._contactsByApp[appID] = {}
        }
        this._contactsByApp[appID][contactID] = this._appsByContact[contactID][
          appID
        ]
      })
    })
  }

  get appsByContact(): AppsByContact {
    return this._appsByContact
  }

  get contactsByApp(): ContactsByApp {
    return this._contactsByApp
  }

  getSharedData(appID: AppID, contactID: ContactID): ?SharedAppData {
    return (
      this._appsByContact[contactID] && this._appsByContact[contactID][appID]
    )
  }

  createSharedData(
    appID: AppID,
    contactID: ContactID,
    optional?: { remoteFeed?: bzzHash },
  ): SharedAppData {
    // $FlowFixMe: optional mismatch
    const shared = SharedAppData.create(optional)

    if (this._appsByContact[contactID] == null) {
      this._appsByContact[contactID] = {}
    }
    this._appsByContact[contactID][appID] = shared

    if (this._contactsByApp[appID] == null) {
      this._contactsByApp[appID] = {}
    }
    this._contactsByApp[appID][contactID] = shared

    return shared
  }

  deleteContact(contactID: ContactID): void {
    Object.keys(this._appsByContact[contactID]).forEach(
      appID => delete this._contactsByApp[appID][contactID],
    )

    delete this._appsByContact[contactID]
  }

  deleteApp(appID: AppID): void {
    Object.keys(this._contactsByApp[appID]).forEach(
      contactID => delete this._appsByContact[contactID][appID],
    )

    delete this._contactsByApp[appID]
  }
}
