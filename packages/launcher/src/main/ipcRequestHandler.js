// @flow

import { readManifestFile } from '@mainframe/app-manifest'
import type Client, { ClientSession, ID } from '@mainframe/client'
// eslint-disable-next-line import/named
import { VaultConfig, type Environment } from '@mainframe/config'
import { ipcMain } from 'electron'

import {
  trustedRequestChannel,
  trustedResponseChannel,
} from '../renderer/electronIpc.js'

type ClientResponse = {
  id: string,
  error?: Object,
  result?: Object,
}

const sdkRequestChannel = 'sdk-request-channel'
const sdkResponseChannel = 'sdk-response-channel'

const IPC_ERRORS: Object = {
  invalidParams: {
    message: 'Invalid params',
    code: 32602,
  },
  internalError: {
    message: 'Internal error',
    code: 32603,
  },
  invalidRequest: {
    message: 'Invalid request',
    code: 32600,
  },
  methodNotFound: {
    message: 'Method not found',
    code: 32601,
  },
}

let vaultOpen = false

const handleIpcRequests = (
  mfClient: Client,
  env: Environment,
  onLaunchApp: (session: ClientSession) => Promise<any>,
) => {
  const vaultConfig = new VaultConfig(env)

  const sdkRequests = {
    blockchain_getLatestBlock: () => mfClient.blockchain.getLatestBlock(),
    blockchain_getContractEvents: params =>
      mfClient.blockchain.getContractEvents(...params),
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
    readManifest: (params: Array<any>) => readManifest(...params),
    launchApp: (params: Array<any>) => launchApp(...params),
    getVaultsData: () => getVaultsData(),
    openVault: (params: Array<any>) => openVault(...params),
    createVault: (params: Array<any>) => createVault(...params),
  }

  ipcMain.on(sdkRequestChannel, async (event, request) => {
    const res = await handleRequest(request, sdkRequests)
    event.sender.send(sdkResponseChannel, res)
  })

  ipcMain.on(trustedRequestChannel, async (event, request) => {
    const res = await handleRequest(request, trustedRequests)
    event.sender.send(trustedResponseChannel, res)
  })

  const handleRequest = async (
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
        const res = await validRequests[request.data.method](args)
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

  const readManifest = async (path: string) => {
    if (path == null) {
      throw new Error(IPC_ERRORS.invalidParams)
    }
    const manifest = await readManifestFile(path)
    return {
      data: manifest.data,
      // TODO: lookup keys to check if they match know identities in vault
      keys: manifest.keys,
    }
  }
}

export default handleIpcRequests
