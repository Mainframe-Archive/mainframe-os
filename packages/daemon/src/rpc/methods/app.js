// @flow

import type {
  PermissionKey,
  PermissionGrant,
  PermissionsDetails,
  PermissionCheckResult,
} from '@mainframe/app-permissions'
// eslint-disable-next-line import/named
import { idType, type ID } from '@mainframe/utils-id'

import type { AppManifest, AppUserSettings, SessionData } from '../../app/App'

import { clientError, sessionError } from '../errors'
import type RequestContext from '../RequestContext'

type User = {
  id: ID,
  data: Object,
}

type App = {
  id: ID,
  manifest: AppManifest,
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
  manifest: AppManifest,
  users: Array<User>,
}

export const checkPermission = (
  ctx: RequestContext,
  [sessID, key, input]: [ID, PermissionKey, ?string] = [],
): { result: PermissionCheckResult } => {
  const session = ctx.openVault.getSession(sessID)
  if (session == null) {
    throw clientError('Invalid session')
  }
  return {
    result: session.checkPermission(key, input),
  }
}

export const close = (ctx: RequestContext, [sessID]: [ID] = []): void => {
  ctx.openVault.closeApp(sessID)
}

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

export const install = async (
  ctx: RequestContext,
  [manifest, userID, settings]: [AppManifest, ID, AppUserSettings] = [],
): Promise<ClientSession> => {
  const appID = ctx.openVault.installApp(manifest, userID, settings)
  await ctx.openVault.save()
  const session = ctx.openVault.openApp(appID, userID)
  return createClientSession(ctx, appID, userID, session)
}

export const remove = async (
  ctx: RequestContext,
  [appID]: [ID] = [],
): Promise<void> => {
  ctx.openVault.removeApp(appID)
  await ctx.openVault.save()
}

export const open = (
  ctx: RequestContext,
  [appID, userID]: [ID, ID] = [],
): ClientSession => {
  const session = ctx.openVault.openApp(appID, userID)
  return createClientSession(ctx, appID, userID, session)
}

export const setPermission = async (
  ctx: RequestContext,
  [sessID, key, value, persist]: [
    ID,
    PermissionKey,
    PermissionGrant,
    ?boolean,
  ] = [],
): Promise<void> => {
  const session = ctx.openVault.getSession(sessID)
  if (session == null) {
    throw clientError('Invalid session')
  }
  session.setPermission(key, value)

  if (persist === true) {
    const app = ctx.openVault.apps.getByID(session.appID)
    if (app == null) {
      throw sessionError('Invalid app')
    }
    app.setPermission(session.userID, key, value)
    await ctx.openVault.save()
  }
}

const createClientSession = (
  ctx: RequestContext,
  appID: ID,
  userID: ID,
  session: SessionData,
): ClientSession => {
  const app = ctx.openVault.apps.getByID(appID)
  if (app == null) {
    throw new Error('Invalid appID')
  }
  const user = ctx.openVault.identities.getOwnUser(userID)
  if (user == null) {
    throw new Error('Invalid userID')
  }
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
      manifest: app.manifest,
    },
  }
}
