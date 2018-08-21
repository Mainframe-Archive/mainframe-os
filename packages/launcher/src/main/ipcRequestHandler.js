// @flow
import { ipcMain } from 'electron'
import { VaultConfig } from '@mainframe/config'
import type Client, { ClientSession, ID } from '@mainframe/client'
import type { Environment } from '@mainframe/config'

import type { ClientResponse, RequestContext, AppSessions } from '../types'

import { channels, IPC_ERRORS } from '../ipcRequest'
import { withPermission } from './permissionsManager'

const sdkRequestChannel = 'sdk-request-channel'
const sdkResponseChannel = 'sdk-response-channel'

let vaultOpen = false

const handleIpcRequests = (
  mfClient: Client,
  env: Environment,
  appSessions: AppSessions,
  onLaunchApp: (session: ClientSession) => Promise<any>,
) => {
  const vaultConfig = new VaultConfig(env)

  const sdkRequests = {
    blockchain_getLatestBlock: (params, ctx) =>
      withPermission('WEB3_SEND', ctx, () =>
        mfClient.blockchain.getLatestBlock(...params),
      ),
    blockchain_getContractEvents: (params, ctx) =>
      withPermission('WEB3_SEND', ctx, () =>
        mfClient.blockchain.getContractEvents(...params),
      ),
    getApiVersion: () => mfClient.apiVersion(),
  }

  const trustedRequests = {
    getInstalledApps: (params: Array<any>) =>
      mfClient.getInstalledApps(...params),
    removeApp: (params: Array<any>) => mfClient.removeApp(...params),
    installApp: (params: Array<any>) => mfClient.installApp(...params),
    createUserIdentity: (params: Array<any>) =>
      mfClient.createUserIdentity(...params),
    getOwnUserIdentities: (params: Array<any>) =>
      mfClient.getOwnUserIdentities(...params),

    launchApp: (params: Array<any>) => launchApp(...params),
    getVaultsData: () => getVaultsData(),
    openVault: (params: Array<any>) => openVault(...params),
    createVault: (params: Array<any>) => createVault(...params),
  }

  ipcMain.on(sdkRequestChannel, async (event, request) => {
    const window = event.sender.getOwnerBrowserWindow()
    const appSession = appSessions[window]
    const context = {
      client: mfClient,
      request,
      appSession,
      window,
    }
    try {
      const res = await handleRequest(context, request, sdkRequests)
      event.sender.send(sdkResponseChannel, res)
    } catch (err) {
      event.sender.send(sdkResponseChannel, {
        error: err,
        id: request.id,
      })
    }
  })

  ipcMain.on(channels.appToMain.request, async (event, request) => {
    const res = await handleRequest(null, request, trustedRequests)
    event.sender.send(channels.appToMain.response, res)
  })

  const handleRequest = async (
    context: ?RequestContext,
    request: Object,
    validRequests: Object,
  ): Promise<ClientResponse> => {
    if (!request || !request.data || !request.data.method) {
      return {
        error: { ...IPC_ERRORS.invalidRequest, method: request.method },
        id: request.id,
      }
    }

    // $FlowFixMe: indexer property
    if (validRequests[request.data.method]) {
      const args = request.data.args || []
      try {
        // $FlowFixMe: indexer property
        const res = await validRequests[request.data.method](args, context)
        return {
          id: request.id,
          result: res,
        }
      } catch (err) {
        return {
          error: {
            message: err.message,
          },
          id: request.id,
        }
      }
    }
    return {
      error: IPC_ERRORS.methodNotFound,
      id: request.id,
    }
  }

  const getVaultsData = () => {
    const vaults = vaultConfig.vaults
    return {
      vaults,
      defaultVault: vaultConfig.defaultVault,
      vaultOpen: vaultOpen,
    }
  }

  const createVault = async (password: string, label: string) => {
    const path = vaultConfig.createVaultPath()
    await mfClient.createVault(path, password)
    vaultConfig.setLabel(path, label)
    vaultConfig.defaultVault = path
    vaultOpen = path
    return path
  }

  const openVault = async (path: string, password: string) => {
    if (!path || !password) {
      throw new Error(IPC_ERRORS.invalidParams)
    }
    await mfClient.openVault(path, password)
    vaultOpen = path
    return {
      open: true,
    }
  }

  const launchApp = async (appID: ID, userID: ID) => {
    const appSession = await mfClient.openApp(appID, userID)
    onLaunchApp(appSession)
  }
}

export default handleIpcRequests
