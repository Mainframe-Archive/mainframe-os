// @flow

import { MANIFEST_SCHEMA_MESSAGES } from '@mainframe/app-manifest'
import type Client from '@mainframe/client'
// eslint-disable-next-line import/named
import { VaultConfig, type Environment } from '@mainframe/config'
import createHandler, { type Methods } from '@mainframe/rpc-handler'
// eslint-disable-next-line import/named
import { ipcMain, type WebContents } from 'electron'

import type { ActiveApps } from '../types'

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
  activeApps: ActiveApps,
}

const validatorOptions = { messages: MANIFEST_SCHEMA_MESSAGES }

const createGetContext = <T>(createContext: (sender: WebContents) => T) => {
  const contexts: WeakMap<WebContents, T> = new WeakMap()
  return (sender: WebContents): T => {
    let ctx = contexts.get(sender)
    if (ctx == null) {
      ctx = createContext(sender)
      contexts.set(sender, ctx)
    }
    return ctx
  }
}

const createChannel = <T>(
  name: string,
  methods: Methods,
  activeApps: ActiveApps,
  getContext: (sender: WebContents) => T,
) => {
  const handleMessage = createHandler({ methods, validatorOptions })
  ipcMain.on(name, async (event, incoming) => {
    const ctx = getContext(event.sender)
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
    params.activeApps,
    createGetContext(
      (sender): SandboxedContext => {
        const app = params.activeApps.get(sender.getOwnerBrowserWindow())
        if (app) {
          return {
            sender,
            client: params.client,
            app,
          }
        }
        throw new Error('App window not found')
      },
    ),
  )

  createChannel(
    TRUSTED_CHANNEL,
    trustedMethods,
    params.activeApps,
    createGetContext(
      (): TrustedContext => ({
        client: params.client,
        launchApp: params.launchApp,
        vaultConfig,
      }),
    ),
  )
}
