// @flow

import { Timeline } from '@erebos/timeline'
import { verifyManifest } from '@mainframe/app-manifest'
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
  APP_LOAD_MANIFEST_SCHEMA,
  type AppLoadManifestParams,
  type AppLoadManifestResult,
  APP_OPEN_SCHEMA,
  type AppOpenParams,
  type AppOpenResult,
  APP_PUBLISH_SCHEMA,
  type AppPublishParams,
  type AppPublishResult,
  APP_REMOVE_SCHEMA,
  type AppRemoveParams,
  APP_SET_PERMISSION_SCHEMA,
  type AppSetPermissionParams,
  APP_SET_PERMISSIONS_REQUIREMENTS_SCHEMA,
  type AppSetUserDefaultWalletParams,
  APP_SET_USER_DEFAULT_WALLET_SCHEMA,
  type AppSetPermissionsRequirementsParams,
  APP_SET_USER_PERMISSIONS_SETTINGS_SCHEMA,
  type AppSetUserPermissionsSettingsParams,
  APP_SET_FEED_HASH_SCHEMA,
  type AppSetFeedHashParams,
} from '@mainframe/client'
import { idType as fromClientID, type ID } from '@mainframe/utils-id'

import type { SessionData } from '../../app/AbstractApp'
import type { AppUpdateData } from '../../app/App'
import { getContentsPath } from '../../app/AppsRepository'
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
  let defaultEthAccount =
    app.getDefaultEthAccount(userID) ||
    ctx.queries.getUserDefaultEthAccount(userID)

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
          manifest: ctx.queries.getAppManifestData(appID),
          contentsPath: app.contentsPath,
        }
      : {
          appID: toClientID(appID),
          manifest: app.manifest,
          contentsPath: getContentsPath(ctx.env, app.manifest),
        }
  const wallets = ctx.queries.getUserEthWallets(userID)

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
    storage: session.storage,
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
        mfid: toClientID(app.mfid),
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
    data: ctx.queries.getAppManifestData(
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
    const app = await ctx.mutations.installApp({
      manifest: params.manifest,
      userID: fromClientID(params.userID),
      permissionsSettings: params.permissionsSettings,
    })
    return {
      appID: toClientID(app.id),
      installationState: app.installationState,
    }
  },
}

export const loadManifest = {
  params: APP_LOAD_MANIFEST_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: AppLoadManifestParams,
  ): Promise<AppLoadManifestResult> => {
    try {
      const timeline = new Timeline({ bzz: ctx.io.bzz, feed: params.hash })
      const chapter = await timeline.loadChapter<AppUpdateData>()
      if (chapter == null) {
        throw new Error('App not published')
      }
      const manifest = verifyManifest(chapter.content.manifest)
      const appID = ctx.openVault.apps.getID(manifest.id)
      const isOwn = appID != null && !!ctx.openVault.apps.getOwnByID(appID)
      return {
        manifest,
        isOwn,
        appID: appID ? toClientID(appID) : undefined,
      }
    } catch (err) {
      throw new Error('App not found')
    }
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

export const publish = {
  params: APP_PUBLISH_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: AppPublishParams,
  ): Promise<AppPublishResult> => {
    const hash = await ctx.mutations.publishApp({
      appID: fromClientID(params.appID),
      version: params.version,
    })
    return { hash }
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

export const setUserDefaultWallet = {
  params: APP_SET_USER_DEFAULT_WALLET_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: AppSetUserDefaultWalletParams,
  ): Promise<void> => {
    const appID = fromClientID(params.appID)
    const userID = fromClientID(params.userID)
    await ctx.mutations.setAppUserDefaultWallet(appID, userID, params.address)
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

export const setFeedHash = {
  params: APP_SET_FEED_HASH_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: AppSetFeedHashParams,
  ): Promise<void> => {
    const session = ctx.openVault.getSession(fromClientID(params.sessID))
    if (session == null) {
      throw clientError('Invalid session')
    }

    const app = ctx.openVault.apps.getByID(session.appID)
    if (app == null) {
      throw sessionError('Invalid app')
    }
    app.setFeedHash(session.userID, params.feedHash)
    await ctx.openVault.save()
  },
}
