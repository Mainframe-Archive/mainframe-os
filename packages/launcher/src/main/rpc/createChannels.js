// @flow

import { MANIFEST_SCHEMA_MESSAGES } from '@mainframe/app-manifest'
import createHandler, { type Methods } from '@mainframe/rpc-handler'
// eslint-disable-next-line import/named
import { ipcMain, type BrowserWindow, type WebContents } from 'electron'

import { SANDBOXED_CHANNEL, TRUSTED_CHANNEL } from '../../constants'

import type AppContext from '../AppContext'

import sandboxedMethods from './sandboxed'
import trustedMethods from './trusted'

const validatorOptions = { messages: MANIFEST_SCHEMA_MESSAGES }

const createChannel = (
  name: string,
  methods: Methods,
  getContext: (sender: WebContents) => AppContext,
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

export default (appContexts: WeakMap<BrowserWindow, AppContext>) => {
  const getContext = (sender: WebContents): AppContext => {
    const context = appContexts.get(sender.getOwnerBrowserWindow())
    if (context == null) {
      throw new Error('AppContext not found')
    }
    return context
  }

  createChannel(
    SANDBOXED_CHANNEL,
    sandboxedMethods,
    (sender: WebContents): AppContext => {
      const context = getContext(sender)
      if (context.sandbox == null) {
        context.sandbox = sender
      }
      return context
    },
  )

  createChannel(TRUSTED_CHANNEL, trustedMethods, getContext)
}
