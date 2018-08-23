// @flow

import { MANIFEST_SCHEMA_MESSAGES } from '@mainframe/app-manifest'
import type Client from '@mainframe/client'
// eslint-disable-next-line import/named
import { VaultConfig, type Environment } from '@mainframe/config'
import createHandler, { type Methods } from '@mainframe/rpc-handler'
// eslint-disable-next-line import/named
import { ipcMain, type WebContents } from 'electron'
import { type AppOpenResult as AppSession } from '@mainframe/client'
import type { AppSessions } from '../types'

import {
  SANBOXED_CHANNEL,
  sandboxedMethods,
  type SandboxedContext,
} from './rpc/sandboxed'
import {
  TRUSTED_CHANNEL,
  trustedMethods,
  type LaunchAppFunc,
  type TrustedContext,
} from './rpc/trusted'

export type ChannelsParams = {
  client: Client,
  env: Environment,
  launchApp: LaunchAppFunc,
  appSessions: AppSessions,
}

const validatorOptions = { messages: MANIFEST_SCHEMA_MESSAGES }

const createGetContext = <T>(
  createContext: (sender: WebContents, appSession: AppSession) => T,
) => {
  const contexts: WeakMap<WebContents, T> = new WeakMap()
  return (sender: WebContents, appSession: AppSession): T => {
    let ctx = contexts.get(sender)
    if (ctx == null) {
      ctx = createContext(sender, appSession)
      contexts.set(sender, ctx)
    }
    return ctx
  }
}

const createChannel = <T>(
  name: string,
  methods: Methods,
  appSessions: AppSessions,
  getContext: (sender: WebContents, appSession: AppSession) => T,
) => {
  const handleMessage = createHandler({ methods, validatorOptions })
  ipcMain.on(name, async (event, incoming) => {
    const window = event.sender.getOwnerBrowserWindow()
    const appSession = appSessions[window]
    const ctx = getContext(event.sender, appSession)
    const outgoing = await handleMessage(ctx, incoming)
    if (outgoing != null) {
      event.sender.send(name, outgoing)
    }
  })
}

export default (params: ChannelsParams) => {
  const vaultConfig = new VaultConfig(params.env)
  createChannel(
    SANBOXED_CHANNEL,
    sandboxedMethods,
    params.appSessions,
    createGetContext(
      (sender, appSession): SandboxedContext => ({
        sender,
        client: params.client,
        appSession,
      }),
    ),
  )

  createChannel(
    TRUSTED_CHANNEL,
    trustedMethods,
    params.appSessions,
    createGetContext(
      (): TrustedContext => ({
        client: params.client,
        launchApp: params.launchApp,
        vaultConfig,
      }),
    ),
  )
}
