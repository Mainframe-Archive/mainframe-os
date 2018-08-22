// @flow

/* eslint-disable import/named */
import { parseContentsURI, type ManifestData } from '@mainframe/app-manifest'
import {
  idType as toClientID,
  APP_CHECK_PERMISSION_SCHEMA,
  type AppCheckPermissionParams,
  type AppCheckPermissionResult,
  APP_CLOSE_SCHEMA,
  type AppCloseParams,
  APP_CREATE_SCHEMA,
  type AppCreateParams,
  type AppCreateResult,
  type AppGetInstalledResult,
  APP_GET_MANIFEST_DATA_SCHEMA,
  type AppGetManifestDataParams,
  type AppGetManifestDataResult,
  APP_INSTALL_SCHEMA,
  type AppInstallParams,
  type AppInstallResult,
  APP_OPEN_SCHEMA,
  type AppOpenParams,
  type AppOpenResult,
  APP_PUBLISH_CONTENTS_SCHEMA,
  type AppPublishContentsParams,
  type AppPublishContentsResult,
  APP_REMOVE_SCHEMA,
  type AppRemoveParams,
  APP_SET_PERMISSION_SCHEMA,
  type AppSetPermissionParams,
  APP_SET_PERMISSIONS_REQUIREMENTS_SCHEMA,
  type AppSetPermissionsRequirementsParams,
  APP_WRITE_MANIFEST_SCHEMA,
  type AppWriteManifestParams,
} from '@mainframe/client'
import { getAppContentsPath, type Environment } from '@mainframe/config'
import { idType as fromClientID, type ID } from '@mainframe/utils-id'
/* eslint-enable import/named */
import { ensureDir } from 'fs-extra'

import type { SessionData } from '../../app/AbstractApp'
import OwnApp from '../../app/OwnApp'

import { clientError, sessionError } from '../errors'
import type RequestContext from '../RequestContext'

const getContentsPath = (env: Environment, manifest: ManifestData): string => {
  return getAppContentsPath(env, manifest.id, manifest.version)
}

const createClientSession = (
  ctx: RequestContext,
  appID: ID,
  userID: ID,
  session: SessionData,
): AppOpenResult => {
  const app = ctx.openVault.apps.getAnyByID(appID)
  if (app == null) {
    throw clientError('Invalid appID')
  }
  const user = ctx.openVault.identities.getOwnUser(userID)
  if (user == null) {
    throw clientError('Invalid userID')
  }

  const appData =
    app instanceof OwnApp
      ? {
          appID: toClientID(appID),
          manifest: ctx.openVault.getAppManifestData(appID),
          contentsPath: app.contentsPath,
        }
      : {
          appID: toClientID(appID),
          manifest: app.manifest,
          contentsPath: getContentsPath(ctx.env, app.manifest),
        }

  return {
    user: {
      id: toClientID(userID),
      data: user.data,
    },
    session: {
      sessID: toClientID(session.sessID),
      permissions: session.permissions,
    },
    app: appData,
  }
}

export const checkPermission = {
  params: APP_CHECK_PERMISSION_SCHEMA,
  handler: (
    ctx: RequestContext,
    params: AppCheckPermissionParams,
  ): AppCheckPermissionResult => {
    const session = ctx.openVault.getSession(fromClientID(params.sessID))
    if (session == null) {
      throw clientError('Invalid session')
    }
    return {
      result: session.checkPermission(params.key, params.input),
    }
  },
}

export const close = {
  params: APP_CLOSE_SCHEMA,
  handler: (ctx: RequestContext, params: AppCloseParams): void => {
    ctx.openVault.closeApp(fromClientID(params.sessID))
  },
}

export const create = {
  params: APP_CREATE_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: AppCreateParams,
  ): Promise<AppCreateResult> => {
    const app = ctx.openVault.createApp({
      contentsPath: params.contentsPath,
      developerID: fromClientID(params.developerID),
      name: params.name,
      version: params.version,
    })
    await ctx.openVault.save()
    return { appID: toClientID(app.id) }
  },
}

// TODO: replace by list with filters
export const getInstalled = (ctx: RequestContext): AppGetInstalledResult => {
  const { apps } = ctx.openVault.apps
  const installedApps = Object.keys(apps).map(appID => {
    const app = apps[appID]
    const users = app.userIDs.reduce((acc, id) => {
      const user = ctx.openVault.identities.getOwnUser(id)
      if (user) {
        acc.push({
          id: toClientID(id),
          data: user.data,
        })
      }
      return acc
    }, [])
    return {
      appID: toClientID(appID),
      manifest: app.manifest,
      users: users,
    }
  })
  return { apps: installedApps }
}

export const getManifestData = {
  params: APP_GET_MANIFEST_DATA_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: AppGetManifestDataParams,
  ): Promise<AppGetManifestDataResult> => ({
    data: ctx.openVault.getAppManifestData(
      fromClientID(params.appID),
      params.version,
    ),
  }),
}

export const install = {
  params: APP_INSTALL_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: AppInstallParams,
  ): Promise<AppInstallResult> => {
    const app = ctx.openVault.installApp(
      params.manifest,
      fromClientID(params.userID),
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
    return { appID: toClientID(app.id) }
  },
}

export const open = {
  params: APP_OPEN_SCHEMA,
  handler: (ctx: RequestContext, params: AppOpenParams): AppOpenResult => {
    const appID = fromClientID(params.appID)
    const userID = fromClientID(params.userID)
    const session = ctx.openVault.openApp(appID, userID)
    return createClientSession(ctx, appID, userID, session)
  },
}

export const publishContents = {
  params: APP_PUBLISH_CONTENTS_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: AppPublishContentsParams,
  ): Promise<AppPublishContentsResult> => {
    const app = ctx.openVault.apps.getOwnByID(fromClientID(params.appID))
    if (app == null) {
      throw new Error('App not found')
    }

    const hash = await ctx.bzz.uploadDirectoryFrom(app.contentsPath)
    const contentsURI = `urn:bzz:${hash}`
    app.setContentsURI(contentsURI, params.version)
    await ctx.openVault.save()

    return { contentsURI }
  },
}

export const remove = {
  params: APP_REMOVE_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: AppRemoveParams,
  ): Promise<void> => {
    ctx.openVault.removeApp(fromClientID(params.appID))
    await ctx.openVault.save()
  },
}

export const setPermission = {
  params: APP_SET_PERMISSION_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: AppSetPermissionParams,
  ): Promise<void> => {
    const session = ctx.openVault.getSession(fromClientID(params.sessID))
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

export const setPermissionsRequirements = {
  params: APP_SET_PERMISSIONS_REQUIREMENTS_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: AppSetPermissionsRequirementsParams,
  ): Promise<void> => {
    const app = ctx.openVault.apps.getOwnByID(fromClientID(params.appID))
    if (app == null) {
      throw new Error('App not found')
    }
    app.setPermissionsRequirements(params.permissions, params.version)
    await ctx.openVault.save()
  },
}

export const writeManifest = {
  params: APP_WRITE_MANIFEST_SCHEMA,
  handler: async (
    ctx: RequestContext,
    params: AppWriteManifestParams,
  ): Promise<void> => {
    await ctx.openVault.writeAppManifest(
      fromClientID(params.appID),
      params.path,
      params.version,
    )
  },
}
