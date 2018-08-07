// @flow

/* eslint-disable import/named */
import { parseContentsURI, type ManifestData } from '@mainframe/app-manifest'
import {
  PERMISSION_KEY_SCHEMA,
  PERMISSION_GRANT_SCHEMA,
  PERMISSIONS_GRANTS_SCHEMA,
  type PermissionKey,
  type PermissionGrant,
  type PermissionsDetails,
  type PermissionCheckResult,
} from '@mainframe/app-permissions'
import { getAppContentsPath, type Environment } from '@mainframe/config'
import { idType, type ID } from '@mainframe/utils-id'
/* eslint-enable import/named */
import { ensureDir } from 'fs-extra'

import type { AppUserSettings, SessionData } from '../../app/AbstractApp'
import OwnApp from '../../app/OwnApp'

import { clientError, sessionError } from '../errors'
import type RequestContext from '../RequestContext'

import { localIdParam } from './parameters'

type User = {
  id: ID,
  data: Object,
}

type App = {
  id: ID,
  manifest: ManifestData,
}

type Session = {
  id: ID,
  permissions: PermissionsDetails,
}

type ClientSession = {
  session: Session,
  user: User,
  app: App,
}

type AppInstalled = {
  appID: ID,
  manifest: ManifestData,
  users: Array<User>,
}

const getContentsPath = (env: Environment, manifest: ManifestData): string => {
  return getAppContentsPath(env, manifest.id, manifest.version)
}

const createClientSession = (
  ctx: RequestContext,
  appID: ID,
  userID: ID,
  session: SessionData,
): ClientSession => {
  const app = ctx.openVault.apps.getAnyByID(appID)
  if (app == null) {
    throw clientError('Invalid appID')
  }
  const user = ctx.openVault.identities.getOwnUser(userID)
  if (user == null) {
    throw clientError('Invalid userID')
  }

  const contentsPath =
    app instanceof OwnApp
      ? app.contentsPath
      : getContentsPath(ctx.env, app.manifest)

  return {
    user: {
      id: userID,
      data: user.data,
    },
    session: {
      id: session.sessID,
      permissions: session.permissions,
    },
    app: {
      id: appID,
      // TODO: what to provide for OwnApp? what is client need?
      // $FlowFixMe: temporarily ignore
      manifest: app.manifest,
      contentsPath,
    },
  }
}

export const checkPermission = {
  params: {
    sessID: localIdParam,
    key: PERMISSION_KEY_SCHEMA,
    input: { type: 'string', optional: true, empty: false },
  },
  handler: (
    ctx: RequestContext,
    params: { sessID: ID, key: PermissionKey, input?: ?string },
  ): { result: PermissionCheckResult } => {
    const session = ctx.openVault.getSession(params.sessID)
    if (session == null) {
      throw clientError('Invalid session')
    }
    return {
      result: session.checkPermission(params.key, params.input),
    }
  },
}

export const close = {
  params: {
    sessID: localIdParam,
  },
  handler: (ctx: RequestContext, params: { sessID: ID }): void => {
    ctx.openVault.closeApp(params.sessID)
  },
}

// TODO: replace by list with filters
export const getInstalled = (
  ctx: RequestContext,
): { apps: Array<AppInstalled> } => {
  const { apps } = ctx.openVault.apps
  const installedApps = Object.keys(apps).map(appID => {
    const app = apps[idType(appID)]
    const users = app.userIDs.reduce((acc, id) => {
      const user = ctx.openVault.identities.getOwnUser(id)
      if (user) {
        acc.push({
          id: idType(id),
          data: user.data,
        })
      }
      return acc
    }, [])
    return {
      appID: idType(appID),
      manifest: app.manifest,
      users: users,
    }
  })
  return { apps: installedApps }
}

export const install = {
  params: {
    manifest: 'any', // TODO: manifest schema - maybe use validator in app-manifest package as well?
    userID: localIdParam,
    settings: {
      type: 'object',
      props: {
        permissions: PERMISSIONS_GRANTS_SCHEMA,
        permissionsChecked: 'boolean',
      },
    },
  },
  handler: async (
    ctx: RequestContext,
    params: { manifest: ManifestData, userID: ID, settings: AppUserSettings },
  ): Promise<ID> => {
    const app = ctx.openVault.installApp(
      params.manifest,
      params.userID,
      params.settings,
    )

    // TODO: rather than waiting for contents to be downloaded, return early and let client subscribe to installation state changes
    if (app.installationState !== 'ready') {
      const contentsPath = getContentsPath(ctx.env, params.manifest)
      const contentsURI = parseContentsURI(params.manifest.contentsURI)
      if (contentsURI.nid !== 'bzz' || contentsURI.nss == null) {
        // Unsupported contentsURI
        app.installationState = 'download_error'
      } else {
        try {
          app.installationState = 'downloading'
          await ensureDir(contentsPath)
          // contentsURI.nss is expected to be the bzz hash
          // TODO?: bzz hash validation?
          await ctx.bzz.downloadDirectoryTo(contentsURI.nss, contentsPath)
          app.installationState = 'ready'
        } catch (err) {
          app.installationState = 'download_error'
        }
      }
    }

    await ctx.openVault.save()
    return app.id
  },
}

export const remove = {
  params: {
    appID: localIdParam,
  },
  handler: async (
    ctx: RequestContext,
    params: { appID: ID },
  ): Promise<void> => {
    ctx.openVault.removeApp(params.appID)
    await ctx.openVault.save()
  },
}

export const open = {
  params: {
    appID: localIdParam,
    userID: localIdParam,
  },
  handler: (
    ctx: RequestContext,
    params: { appID: ID, userID: ID },
  ): ClientSession => {
    const session = ctx.openVault.openApp(params.appID, params.userID)
    return createClientSession(ctx, params.appID, params.userID, session)
  },
}

export const setPermission = {
  params: {
    sessID: localIdParam,
    key: PERMISSION_KEY_SCHEMA,
    value: PERMISSION_GRANT_SCHEMA,
    persist: { type: 'boolean', optional: true },
  },
  handler: async (
    ctx: RequestContext,
    params: {
      sessID: ID,
      key: PermissionKey,
      value: PermissionGrant,
      persist: ?boolean,
    },
  ): Promise<void> => {
    const session = ctx.openVault.getSession(params.sessID)
    if (session == null) {
      throw clientError('Invalid session')
    }
    session.setPermission(params.key, params.value)

    if (params.persist === true) {
      const app = ctx.openVault.apps.getByID(session.appID)
      if (app == null) {
        throw sessionError('Invalid app')
      }
      app.setPermission(session.userID, params.key, params.value)
      await ctx.openVault.save()
    }
  },
}
