// @flow

import { MANIFEST_SCHEMA_MESSAGES } from '@mainframe/app-manifest'
import createHandler, { type Methods } from '@mainframe/rpc-handler'
// eslint-disable-next-line import/named
import { ipcMain, BrowserWindow, type WebContents } from 'electron'

import {
  APP_SANDBOXED_CHANNEL,
  APP_TRUSTED_CHANNEL,
  LAUNCHER_CHANNEL,
} from '../../constants'

import type { Context, AppContext, LauncherContext } from '../contexts'

import { sandboxed as sandboxedMethods, trusted as trustedMethods } from './app'
import launcherMethods from './launcher'

const validatorOptions = { messages: MANIFEST_SCHEMA_MESSAGES }

const createChannel = (
  name: string,
  methods: Methods,
  getContext: (sender: WebContents) => Context,
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

export default (
  launcherContext: LauncherContext,
  sandboxContexts: WeakMap<WebContents, AppContext>,
  windowContexts: WeakMap<BrowserWindow, AppContext>,
) => {
  createChannel(
    APP_SANDBOXED_CHANNEL,
    sandboxedMethods,
    (sender: WebContents): AppContext => {
      const context = sandboxContexts.get(sender)
      if (context == null) {
        throw new Error('AppContext not found')
      }
      return context
    },
  )

  createChannel(
    APP_TRUSTED_CHANNEL,
    trustedMethods,
    (sender: WebContents): AppContext => {
      const context = windowContexts.get(BrowserWindow.fromWebContents(sender))
      if (context == null) {
        throw new Error('AppContext not found')
      }
      return context
    },
  )

  createChannel(LAUNCHER_CHANNEL, launcherMethods, () => launcherContext)
}
