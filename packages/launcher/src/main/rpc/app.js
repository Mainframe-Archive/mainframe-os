// @flow

import { createReadStream } from 'fs'
import crypto from 'crypto'
import {
  LOCAL_ID_SCHEMA,
  type BlockchainWeb3SendParams,
  type ContactsGetUserContactsResult,
  type WalletGetEthWalletsResult,
} from '@mainframe/client'
import { dialog } from 'electron'
import type { Subscription as RxSubscription } from 'rxjs'
import * as mime from 'mime'
import { type AppContext, ContextSubscription } from '../contexts'
import { withPermission } from '../permissions'
import { PrependInitializationVector } from '../storage'

class TopicSubscription extends ContextSubscription<RxSubscription> {
  data: ?RxSubscription

  constructor() {
    super('pss_subscription')
  }

  async dispose() {
    if (this.data != null) {
      this.data.unsubscribe()
    }
  }
}

export const sandboxed = {
  api_version: (ctx: AppContext) => ctx.client.apiVersion(),

  // Blockchain

  blockchain_web3Send: async (
    ctx: AppContext,
    params: BlockchainWeb3SendParams,
  ): Promise<Object> => {
    return ctx.client.blockchain.web3Send(params)
  },

  // Wallet

  wallet_signTx: withPermission(
    'BLOCKCHAIN_SEND',
    (ctx: AppContext, params: any) => ctx.client.wallet.signTransaction(params),
    // TODO notify app if using ledger to feedback awaiting sign
  ),

  wallet_getEthAccounts: async (ctx: AppContext): Promise<Array<string>> => {
    // $FlowFixMe indexer property
    const accounts = await ctx.client.wallet.getUserEthAccounts({
      userID: ctx.appSession.user.localID,
    })
    if (
      ctx.appSession.defaultEthAccount &&
      accounts.includes(ctx.appSession.defaultEthAccount)
    ) {
      // Move default account to top
      const defaultAccount = ctx.appSession.defaultEthAccount
      accounts.splice(accounts.indexOf(defaultAccount), 1)
      accounts.unshift(defaultAccount)
    }
    return accounts
  },

  // Contacts

  contacts_select: withPermission(
    'CONTACTS_READ',
    async (ctx: AppContext, params: { multi?: boolean }) => {
      const res = await ctx.trustedRPC.request('permission_ask', {
        key: 'CONTACTS_SELECT',
        params: { CONTACTS_SELECT: params },
      })
      if (!res.granted || !res || !res.data || !res.data.selectedContactIDs) {
        return { contacts: [] }
      }
      const userID = ctx.appSession.user.id
      const appID = ctx.appSession.app.appID
      const contactIDs = res.data.selectedContactIDs
      const contactsToApprove = contactIDs.map(id => ({
        localID: id,
        publicDataOnly: true, // TODO allow user to set only public data
      }))
      const {
        approvedContacts,
      } = await ctx.client.contacts.approveContactsForApp({
        appID,
        userID,
        contactsToApprove,
      })
      const ids = approvedContacts.map(c => c.id)

      return ctx.client.contacts.getAppUserContacts({
        appID,
        userID,
        contactIDs: ids,
      })
    },
  ),

  contacts_getData: withPermission(
    'CONTACTS_READ',
    async (ctx: AppContext, params: { contactIDs: Array<string> }) => {
      const userID = ctx.appSession.user.id
      const appID = ctx.appSession.app.appID
      return ctx.client.contacts.getAppUserContacts({
        appID,
        userID,
        contactIDs: params.contactIDs,
      })
    },
  ),

  contacts_getApproved: withPermission(
    'CONTACTS_READ',
    async (ctx: AppContext) => {
      const userID = ctx.appSession.user.id
      const appID = ctx.appSession.app.appID
      return ctx.client.contacts.getAppApprovedContacts({
        appID,
        userID,
      })
    },
  ),

  // Temporary PSS APIs - should be removed when communication APIs are settled
  pss_baseAddr: (ctx: AppContext): Promise<string> => {
    return ctx.client.pss.baseAddr()
  },
  pss_createTopicSubscription: {
    params: {
      topic: 'string',
    },
    handler: async (
      ctx: AppContext,
      params: { topic: string },
    ): Promise<string> => {
      const subscription = await ctx.client.pss.createTopicSubscription(params)
      const sub = new TopicSubscription()
      sub.data = subscription.subscribe(msg => {
        ctx.notifySandboxed(sub.id, msg)
      })
      ctx.setSubscription(sub)
      return sub.id
    },
  },
  pss_getPublicKey: (ctx: AppContext): Promise<string> => {
    return ctx.client.pss.getPublicKey()
  },
  pss_sendAsym: {
    params: {
      key: 'string',
      topic: 'string',
      message: 'string',
    },
    handler: (
      ctx: AppContext,
      params: { key: string, topic: string, message: string },
    ): Promise<null> => {
      return ctx.client.pss.sendAsym(params)
    },
  },
  pss_setPeerPublicKey: {
    params: {
      key: 'string',
      topic: 'string',
    },
    handler: (
      ctx: AppContext,
      params: { key: string, topic: string },
    ): Promise<null> => {
      return ctx.client.pss.setPeerPublicKey(params)
    },
  },
  pss_stringToTopic: {
    params: {
      string: 'string',
    },
    handler: (ctx: AppContext, params: { string: string }): Promise<string> => {
      return ctx.client.pss.stringToTopic(params)
    },
  },

  storage_promptUpload: {
    params: {
      name: 'string',
    },
    handler: (ctx: AppContext, params: { name: string }): Promise<?string> => {
      console.log('storage_promptUpload called')
      return new Promise((resolve, reject) => {
        dialog.showOpenDialog(
          ctx.window,
          { title: 'Select file to upload', buttonLabel: 'Upload' },
          async filePaths => {
            if (filePaths.length !== 0) {
              try {
                const filePath = filePaths[0]
                let { address, encryptionKey, feedHash } = ctx.storage

                // TODO: move out encryption code to a separate file
                const iv = crypto.randomBytes(16) // TODO: use a constant for the length of the IV
                const cipher = crypto.createCipheriv(
                  'aes256',
                  encryptionKey,
                  iv,
                )
                const stream = createReadStream(filePath)
                  .pipe(cipher)
                  .pipe(new PrependInitializationVector(iv))

                let feedMetadata
                let dataHash
                let manifestHash

                console.log(params, 'params')
                console.log(filePaths, 'filePaths')
                console.log(mime.getType(filePath), 'mime.getType(filePath)')
                console.log(feedHash, 'feedHash')

                if (feedHash) {
                  console.log(`feedHash is ${feedHash}`)
                  const feedValue = await ctx.bzz.getFeedValue(feedHash, {}, { mode: 'content-hash' })
                  console.log(feedValue, 'feedValue')
                  manifestHash = feedValue
                  feedMetadata = await ctx.bzz.getFeedMetadata(feedHash)
                } else {
                  console.log('feedHash does not exist')
                  feedHash = await ctx.bzz.createFeedManifest(address)
                  feedMetadata = await ctx.bzz.getFeedMetadata(feedHash)
                  const manifest = {entries: []}
                  const initialManifest = await ctx.bzz.uploadFile(JSON.stringify(manifest), {})
                  console.log(initialManifest, 'initialManifest')
                  manifestHash = initialManifest
                }

                dataHash = await ctx.bzz.uploadFileStream(stream, {
                  contentType: mime.getType(filePath),
                  path: params.name,
                  manifestHash: manifestHash
                })

                console.log(dataHash, 'dataHash')
                console.log(feedMetadata, 'feedMetadata')
                console.log(manifestHash, 'manifestHash')

                await ctx.bzz.postFeedValue(feedMetadata, `0x${dataHash}`)

                ctx.storage.feedHash = feedHash
                await ctx.client.app.setFeedHash({ sessID: ctx.appSession.session.sessID, feedHash: feedHash })
                resolve(params.name)
              } catch (error) {
                console.log(error, 'storage_promptUpload error')
                // TODO: use RPCError to provide a custom error code
                reject(new Error('Upload failed'))
              }
            } else {
              // No file selected
              resolve()
            }
          },
        )
      })
    },
  },


  storage_list: {
    handler: async(ctx: AppContext): Promise<Array<string>> => {
      console.log('storage list called')
      try {
        console.log(ctx.storage.feedHash, 'feedHash')
        const feedHash = ctx.appSession.storage.feedHash
        const feedValue = await ctx.bzz.getFeedValue(feedHash, {}, { mode: 'content-hash' })
        console.log(feedValue, 'feedValue')
        const list = await ctx.bzz.list(feedHash)
        console.log(list, 'list')
        return list
      } catch (error) {
        console.log(error, 'storage_list error')
        // TODO: use RPCError to provide a custom error code
        new Error('Upload failed')
      }
      return {}
    },
  },
}

export const trusted = {
  sub_createPermissionDenied: (ctx: AppContext): { id: string } => ({
    id: ctx.createPermissionDeniedSubscription(),
  }),
  sub_unsubscribe: {
    params: {
      id: LOCAL_ID_SCHEMA,
    },
    handler: (ctx: AppContext, params: { id: string }): void => {
      ctx.removeSubscription(params.id)
    },
  },

  wallet_getUserEthWallets: async (
    ctx: AppContext,
  ): Promise<WalletGetEthWalletsResult> => {
    return ctx.client.wallet.getUserEthWallets({
      userID: ctx.appSession.user.localID,
    })
  },

  contacts_getUserContacts: (
    ctx: AppContext,
    params: { userID: string },
  ): Promise<ContactsGetUserContactsResult> => {
    return ctx.client.contacts.getUserContacts(params)
  },
}
