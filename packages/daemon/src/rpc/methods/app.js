// @flow

/* eslint-disable import/named */
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
  type AppGetAllResult,
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
  APP_SET_USER_SETTINGS_SCHEMA,
  type AppSetUserSettingsParams,
  APP_SET_USER_PERMISSIONS_SETTINGS_SCHEMA,
  type AppSetUserPermissionsSettingsParams,
  APP_WRITE_MANIFEST_SCHEMA,
  type AppWriteManifestParams,
} from '@mainframe/client'
import { idType as fromClientID, type ID } from '@mainframe/utils-id'
/* eslint-enable import/named */

import type { SessionData } from '../../app/AbstractApp'
import { downloadAppContents, getContentsPath } from '../../app/AppsRepository'
import OwnApp from '../../app/OwnApp'
import type ClientContext from '../../context/ClientContext'

import { clientError, sessionError } from '../errors'

const createClientSession = (
  ctx: ClientContext,
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
  let defaultEthAccount = app.getDefaultEthAccount(userID)
  if (!defaultEthAccount) {
    // TODO: add a setting for default eth account on identity
    const ethWallet = ctx.openVault.wallets.getFirstEthWallet()
    if (ethWallet) {
      defaultEthAccount = ethWallet.getAccounts()[0]
    }
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
  const wallets = ctx.openVault.getUserEthWallets(userID)

  return {
    user: {
      id: toClientID(userID),
      localID: user.localID,
      profile: user.profile,
      ethWallets: wallets,
    },
    session: {
      sessID: toClientID(session.sessID),
      permissions: session.permissions,
    },
    defaultEthAccount,
    app: appData,
    isDev: session.isDev,
  }
}

export const checkPermission = {
  params: APP_CHECK_PERMISSION_SCHEMA,
  handler: (
    ctx: ClientContext,
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
  handler: (ctx: ClientContext, params: AppCloseParams): void => {
    ctx.openVault.closeApp(fromClientID(params.sessID))
  },
}

export const create = {
  params: APP_CREATE_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: AppCreateParams,
  ): Promise<AppCreateResult> => {
    const { developerID, ...data } = params
    const app = await ctx.mutations.createApp({
      ...data,
      developerID: fromClientID(developerID),
    })
    return { appID: toClientID(app.id) }
  },
}

export const getAll = (ctx: ClientContext): AppGetAllResult => {
  const { apps, ownApps } = ctx.openVault.apps
  const mapList = (mapApps: Object) => {
    return Object.keys(mapApps).map(appID => {
      const app = mapApps[appID]
      const users = app.userIDs.reduce((acc, id) => {
        const user = ctx.openVault.identities.getOwnUser(id)
        if (user) {
          acc.push({
            id: toClientID(id),
            profile: user.profile,
            settings: app.getSettings(id),
          })
        }
        return acc
      }, [])
      return {
        localID: toClientID(appID),
        name: app instanceof OwnApp ? app.data.name : app.manifest.name,
        manifest: app.manifest || app._data,
        users: users,
      }
    })
  }
  return {
    own: mapList(ownApps),
    installed: mapList(apps),
  }
}

export const getManifestData = {
  params: APP_GET_MANIFEST_DATA_SCHEMA,
  handler: async (
    ctx: ClientContext,
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
    ctx: ClientContext,
    params: AppInstallParams,
  ): Promise<AppInstallResult> => {
    const app = ctx.openVault.installApp(
      params.manifest,
      fromClientID(params.userID),
      params.permissionsSettings,
    )
    const contentsPath = getContentsPath(ctx.env, params.manifest)
    await downloadAppContents(ctx.io.bzz, app, contentsPath)
    await ctx.openVault.save()
    return { appID: toClientID(app.id) }
  },
}

export const open = {
  params: APP_OPEN_SCHEMA,
  handler: (ctx: ClientContext, params: AppOpenParams): AppOpenResult => {
    const appID = fromClientID(params.appID)
    const userID = fromClientID(params.userID)
    const session = ctx.openVault.openApp(appID, userID)
    return createClientSession(ctx, appID, userID, session)
  },
}

export const publishContents = {
  params: APP_PUBLISH_CONTENTS_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: AppPublishContentsParams,
  ): Promise<AppPublishContentsResult> => {
    const app = ctx.openVault.apps.getOwnByID(fromClientID(params.appID))
    if (app == null) {
      throw new Error('App not found')
    }

    const hash = await ctx.io.bzz.uploadDirectoryFrom(app.contentsPath)
    const contentsURI = `urn:bzz:${hash}`
    app.setContentsURI(contentsURI, params.version)
    await ctx.openVault.save()

    return { contentsURI }
  },
}

export const remove = {
  params: APP_REMOVE_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: AppRemoveParams,
  ): Promise<void> => {
    ctx.openVault.removeApp(fromClientID(params.appID))
    await ctx.openVault.save()
  },
}
export const setUserSettings = {
  params: APP_SET_USER_SETTINGS_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: AppSetUserSettingsParams,
  ): Promise<void> => {
    const appID = fromClientID(params.appID)
    const userID = fromClientID(params.userID)
    ctx.openVault.setAppUserSettings(appID, userID, params.settings)
    await ctx.openVault.save()
  },
}

export const setUserPermissionsSettings = {
  params: APP_SET_USER_PERMISSIONS_SETTINGS_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: AppSetUserPermissionsSettingsParams,
  ): Promise<void> => {
    const appID = fromClientID(params.appID)
    const userID = fromClientID(params.userID)
    ctx.openVault.setAppUserPermissionsSettings(appID, userID, params.settings)
    await ctx.openVault.save()
  },
}

export const setPermission = {
  params: APP_SET_PERMISSION_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: AppSetPermissionParams,
  ): Promise<void> => {
    const session = ctx.openVault.getSession(fromClientID(params.sessID))
    if (session == null) {
      throw clientError('Invalid session')
    }
    session.setPermission(params.key, params.value)

    const app = ctx.openVault.apps.getByID(session.appID)
    if (app == null) {
      throw sessionError('Invalid app')
    }
    app.setPermission(session.userID, params.key, params.value)
    await ctx.openVault.save()
  },
}

export const setPermissionsRequirements = {
  params: APP_SET_PERMISSIONS_REQUIREMENTS_SCHEMA,
  handler: async (
    ctx: ClientContext,
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
    ctx: ClientContext,
    params: AppWriteManifestParams,
  ): Promise<void> => {
    await ctx.openVault.writeAppManifest(
      fromClientID(params.appID),
      params.path,
      params.version,
    )
  },
}
