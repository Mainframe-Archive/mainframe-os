// @flow

import type {
  PermissionKey,
  PermissionGrant,
  PermissionsDetails,
  PermissionCheckResult,
} from '@mainframe/app-permissions'
// eslint-disable-next-line import/named
import { idType, type ID } from '@mainframe/utils-id'

import {
  validateManifest,
  type AppManifest,
  type ManifestValidationResult,
} from '../../app/manifest'
import type { AppUserSettings } from '../../app/App'

import { clientError, sessionError } from '../errors'
import type RequestContext from '../RequestContext'

type ClientSession = {
  id: ID,
  permissions: PermissionsDetails,
}

type AppInstalled = {
  manifest: AppManifest,
  users: Array<ID>,
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

// TODO: replace by list with filters
export const getInstalled = (
  ctx: RequestContext,
): { apps: Array<AppInstalled> } => {
  const { apps } = ctx.openVault.apps
  const installedApps = Object.keys(apps).map(appID => {
    const app = apps[idType(appID)]
    return {
      appID,
      manifest: app.manifest,
      users: app.users,
    }
  })
  return { apps: installedApps }
}

export const install = async (
  ctx: RequestContext,
  [manifest, userID, settings]: [AppManifest, ID, AppUserSettings] = [],
): Promise<ClientSession> => {
  const session = ctx.openVault.installApp(manifest, userID, settings)
  await ctx.openVault.save()
  return {
    id: session.sessID,
    permissions: session.permissions,
  }
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
  return {
    id: session.sessID,
    permissions: session.permissions,
  }
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

export const validate = (
  ctx: RequestContext,
  [manifest]: [AppManifest] = [],
): { result: ManifestValidationResult } => ({
  result: validateManifest(manifest),
})
