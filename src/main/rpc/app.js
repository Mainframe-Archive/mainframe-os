// @flow

import { createReadStream, createWriteStream } from 'fs'
import { Readable } from 'stream'
import type { ListResult } from '@erebos/api-bzz-node'
import getStream from 'get-stream'
import { dialog } from 'electron'
import { fromEvent } from 'rxjs'
import * as mime from 'mime'
import nanoid from 'nanoid'

import {
  RPC_ETHEREUM_ACCOUNTS_CHANGED,
  RPC_ETHEREUM_NETWORK_CHANGED,
} from '../../constants'
import type { AppWallets } from '../../types'

import { type AppContext, withAppPermission } from '../context/app'
import {
  getStorageManifestHash,
  downloadStream,
  uploadStream,
} from '../storage'

const LOCAL_ID_PARAM = {
  type: 'string',
  length: 21, // nanoid generates 21-chars long strings
}

const STORAGE_KEY_PARAM = {
  type: 'string',
  pattern: /^([A-Za-z0-9_. =+-]+?)$/,
}

const sharedMethods = {
  ethereum_getAccounts: async (ctx: AppContext): Promise<Array<string>> => {
    const accounts = await ctx.session.user.getEthAccounts()
    const { defaultEthAccount } = ctx.session.settings
    if (defaultEthAccount != null) {
      // Move default account to top
      const accountIndex = accounts.indexOf(defaultEthAccount)
      if (accountIndex !== -1) {
        accounts.splice(accountIndex, 1)
        accounts.unshift(defaultEthAccount)
      }
    }
    return accounts
  },

  ethereum_send: async (
    ctx: AppContext,
    params: { method: string, params?: ?Array<any> },
  ): Promise<any> => {
    return await ctx.session.user
      .getEth()
      .send(params.method, params.params || [])
  },
}

export const sandboxed = {
  ...sharedMethods,

  ethereum_subscribe: async (
    ctx: AppContext,
    params: { method: string, params?: ?Array<any> },
  ): Promise<{ id: string }> => {
    const provider = ctx.session.user.getEth().web3Provider
    if (provider.subscribe != null && provider.on != null) {
      const subID = await provider.subscribe(
        'eth_subscribe',
        params.method,
        params.params,
      )
      const subscription = fromEvent(provider, subID).subscribe(msg => {
        if (msg.subscription === subID) {
          ctx.notifySandboxed('eth_subscription', subID, msg)
        }
      })
      ctx.addSubscription(subID, subscription)
      return { id: subID }
    }
    throw new Error('Subscriptions not supported')
  },

  ethereum_subscribeAccountsChanged: async (
    ctx: AppContext,
  ): Promise<{ id: string }> => {
    const id = nanoid()
    const subscription = fromEvent(
      ctx.session.user.getEth(),
      'accountsChanged',
    ).subscribe(event => {
      ctx.notifySandboxed(RPC_ETHEREUM_ACCOUNTS_CHANGED, id, event)
    })
    ctx.addSubscription(id, subscription)
    return { id }
  },

  ethereum_subscribeNetworkChanged: async (
    ctx: AppContext,
  ): Promise<{ id: string }> => {
    const id = nanoid()
    const subscription = fromEvent(
      ctx.session.user.getEth(),
      'networkChanged',
    ).subscribe(event => {
      ctx.notifySandboxed(RPC_ETHEREUM_NETWORK_CHANGED, id, event)
    })
    ctx.addSubscription(id, subscription)
    return { id }
  },

  ethereum_unsubscribe: async (
    ctx: AppContext,
    params: { id: string },
  ): Promise<void> => {
    const provider = ctx.session.user.getEth().web3Provider
    if (provider.unsubscribe != null) {
      await provider.unsubscribe(params.id)
    }
    ctx.removeSubscription(params.id)
  },

  // Wallet

  wallet_signEthTx: withAppPermission(
    'BLOCKCHAIN_SEND',
    async (ctx: AppContext, params: any) => {
      return await ctx.session.user.signEthTransaction(params)
    },
  ),

  wallet_signEthData: withAppPermission(
    'BLOCKCHAIN_SIGN',
    async (ctx: AppContext, params: { address: string, data: string }) => {
      return await ctx.session.user.signEthData(params)
    },
  ),

  // Comms

  // comms_publish: withPermission(
  //   'COMMS_CONTACT',
  //   async (
  //     ctx: AppContext,
  //     params: { contactID: string, key: string, value: Object },
  //   ): Promise<void> => {
  //     const appID = ctx.appSession.app.appID
  //     const userID = ctx.appSession.user.id
  //     return ctx.client.comms.publish({ ...params, appID, userID })
  //   },
  // ),

  // comms_subscribe: withPermission(
  //   'COMMS_CONTACT',
  //   async (
  //     ctx: AppContext,
  //     params: { contactID: string, key: string },
  //   ): Promise<string> => {
  //     const appID = ctx.appSession.app.appID
  //     const userID = ctx.appSession.user.id
  //     const subscription = await ctx.client.comms.subscribe({
  //       ...params,
  //       appID,
  //       userID,
  //     })
  //     const sub = new CommsSubscription()
  //     sub.data = subscription.subscribe(msg => {
  //       ctx.notifySandboxed(sub.id, msg)
  //     })
  //     ctx.setSubscription(sub)
  //     return sub.id
  //   },
  // ),
  //
  // comms_getSubscribable: withPermission(
  //   'COMMS_CONTACT',
  //   async (
  //     ctx: AppContext,
  //     params: { contactID: string },
  //   ): Promise<Array<string>> => {
  //     const appID = ctx.appSession.app.appID
  //     const userID = ctx.appSession.user.id
  //     return ctx.client.comms.getSubscribable({ ...params, appID, userID })
  //   },
  // ),

  // Contacts

  contacts_select: withAppPermission(
    'CONTACTS_READ',
    async (ctx: AppContext, params: { multi?: boolean }) => {
      const res = await ctx.trustedRPC.request('user_request', {
        key: 'CONTACTS_SELECT',
        params: { CONTACTS_SELECT: params },
      })
      if (!res || !res.granted || !res.data || !res.data.selectedContactIDs) {
        return { contacts: [] }
      }

      const ids = await ctx.session.settings.addContacts(
        res.data.selectedContactIDs,
      )
      return { contacts: await ctx.session.settings.getContacts(ids) }
    },
  ),

  contacts_getData: withAppPermission(
    'CONTACTS_READ',
    async (ctx: AppContext, params: { contactIDs: Array<string> }) => {
      return {
        contacts: await ctx.session.settings.getContacts(params.contactIDs),
      }
    },
  ),

  contacts_getApproved: withAppPermission(
    'CONTACTS_READ',
    async (ctx: AppContext) => {
      return { contacts: await ctx.session.settings.getAllContacts() }
    },
  ),

  storage_promptDownload: {
    params: {
      key: STORAGE_KEY_PARAM,
    },
    handler: (ctx: AppContext, params: { key: string }): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        dialog.showSaveDialog(
          ctx.window,
          { title: 'Save file to:', buttonLabel: 'Download' },
          async filePath => {
            if (filePath === undefined) {
              // Dialog was canceled
              resolve(false)
            } else {
              try {
                const stream = await downloadStream(ctx, params.key)
                if (stream === null) {
                  reject(new Error('File not found'))
                } else {
                  await new Promise((resolve, reject) => {
                    stream
                      .pipe(createWriteStream(filePath))
                      .on('error', error => {
                        reject(error)
                      })
                      .on('finish', () => {
                        resolve(true)
                      })
                  })
                }
              } catch (error) {
                reject(new Error('Failed to access storage'))
              }
            }
          },
        )
      })
    },
  },

  storage_promptUpload: {
    params: {
      key: STORAGE_KEY_PARAM,
    },
    handler: (ctx: AppContext, params: { key: string }): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        dialog.showOpenDialog(
          ctx.window,
          { title: 'Select file to upload', buttonLabel: 'Upload' },
          async filePaths => {
            if (filePaths === undefined) {
              // No file selected
              resolve(false)
            } else {
              try {
                const filePath = filePaths[0]
                await uploadStream(ctx, {
                  contentType: mime.getType(filePath),
                  key: params.key,
                  stream: createReadStream(filePath),
                })
                resolve(true)
              } catch (error) {
                reject(new Error('Failed to access storage'))
              }
            }
          },
        )
      })
    },
  },

  storage_list: {
    handler: async (
      ctx: AppContext,
    ): Promise<Array<{ contentType: string, key: string }>> => {
      try {
        const manifestHash = await getStorageManifestHash(ctx)
        const list: ListResult = await ctx.session.user
          .getBzz()
          .list(manifestHash)
        return list.entries == null
          ? []
          : list.entries.map(meta => {
              return { contentType: meta.contentType, key: meta.path }
            })
      } catch (error) {
        throw new Error('Failed to access storage')
      }
    },
  },

  storage_set: {
    params: {
      key: STORAGE_KEY_PARAM,
      data: 'string',
    },
    handler: async (
      ctx: AppContext,
      params: {
        key: string,
        data: string,
      },
    ): Promise<void> => {
      try {
        const stream = new Readable()
        stream.push(params.data)
        stream.push(null)
        await uploadStream(ctx, {
          contentType: 'text/plain',
          key: params.key,
          stream,
        })
      } catch (error) {
        throw new Error('Failed to access storage')
      }
    },
  },

  storage_get: {
    params: {
      key: STORAGE_KEY_PARAM,
    },
    handler: async (
      ctx: AppContext,
      params: { key: string },
    ): Promise<?string> => {
      try {
        const stream = await downloadStream(ctx, params.key)
        if (stream !== null) {
          return await getStream(stream)
        }
      } catch (error) {
        throw new Error('Failed to access storage')
      }
    },
  },

  storage_delete: {
    params: {
      key: STORAGE_KEY_PARAM,
    },
    handler: async (
      ctx: AppContext,
      params: { key: string },
    ): Promise<void> => {
      try {
        const bzz = ctx.session.user.getBzz()
        const manifestHash = await getStorageManifestHash(ctx)
        const newManifestHash = await bzz.deleteResource(
          manifestHash,
          params.key,
        )
        await ctx.storage.feed.setContentHash(bzz, newManifestHash)
        // eslint-disable-next-line require-atomic-updates
        ctx.storage.manifestHash = newManifestHash
      } catch (error) {
        throw new Error('Failed to access storage')
      }
    },
  },
}

export const trusted = {
  ...sharedMethods,

  sub_createPermissionDenied: (ctx: AppContext): { id: string } => ({
    id: ctx.setPermissionDeniedSubscription(),
  }),

  sub_unsubscribe: {
    params: {
      id: LOCAL_ID_PARAM,
    },
    handler: (ctx: AppContext, params: { id: string }): void => {
      ctx.removeSubscription(params.id)
    },
  },

  ethereum_subscribe: async (
    ctx: AppContext,
    params: { method: string, params?: ?Array<any> },
  ): Promise<{ id: string }> => {
    const provider = ctx.session.user.getEth().web3Provider
    if (provider.subscribe != null && provider.on != null) {
      const subID = await provider.subscribe(
        'eth_subscribe',
        params.method,
        params.params,
      )
      const subscription = fromEvent(provider, subID).subscribe(msg => {
        if (msg.subscription === subID) {
          ctx.notifySandboxed('eth_subscription', subID, msg)
        }
      })
      ctx.addSubscription(subID, subscription)
      return { id: subID }
    }
    throw new Error('Subscriptions not supported')
  },

  ethereum_subscribeAccountsChanged: async (
    ctx: AppContext,
  ): Promise<{ id: string }> => {
    const id = nanoid()
    const subscription = fromEvent(
      ctx.session.user.getEth(),
      'accountsChanged',
    ).subscribe(event => {
      ctx.notifyTrusted(RPC_ETHEREUM_ACCOUNTS_CHANGED, id, event)
    })
    ctx.addSubscription(id, subscription)
    return { id }
  },

  ethereum_subscribeNetworkChanged: async (
    ctx: AppContext,
  ): Promise<{ id: string }> => {
    const id = nanoid()
    const subscription = fromEvent(
      ctx.session.user.getEth(),
      'networkChanged',
    ).subscribe(event => {
      ctx.notifyTrusted(RPC_ETHEREUM_NETWORK_CHANGED, id, event)
    })
    ctx.addSubscription(id, subscription)
    return { id }
  },

  ethereum_unsubscribe: async (
    ctx: AppContext,
    params: { id: string },
  ): Promise<void> => {
    const provider = ctx.session.user.getEth().web3Provider
    if (provider.unsubscribe != null) {
      await provider.unsubscribe(params.id)
    }
    ctx.removeSubscription(params.id)
  },

  wallet_getUserWallets: async (ctx: AppContext): Promise<AppWallets> => {
    const [hd, ledger] = await Promise.all([
      // $FlowFixMe: returned type mismatch
      ctx.session.user.populate('ethWallets.hd'),
      // $FlowFixMe: returned type mismatch
      ctx.session.user.populate('ethWallets.ledger'),
    ])
    return {
      hd: hd.map(w => ({
        localID: w.localID,
        name: w.name,
        accounts: w.activeAccounts.map(a => a.address),
      })),
      ledger: ledger.map(w => ({
        localID: w.localID,
        name: w.name,
        accounts: w.activeAccounts.map(a => a.address),
      })),
      defaultAccount: ctx.session.settings.defaultEthAccount,
    }
  },

  wallet_selectDefault: async (
    ctx: AppContext,
  ): Promise<{ address: ?string }> => {
    const res = await ctx.trustedRPC.request('user_request', {
      key: 'WALLET_ACCOUNT_SELECT',
      params: {},
    })
    let address
    if (res.data && res.data.address) {
      await ctx.session.settings.atomicSet('defaultEthAccount', address)
    }
    return { address }
  },

  contacts_getApproved: async (ctx: AppContext) => {
    return { contacts: await ctx.session.settings.getAllContacts() }
  },
}
