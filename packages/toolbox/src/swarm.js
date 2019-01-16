// @flow

import os from 'os'
import crypto from 'crypto'
import * as path from 'path'
import keytar from 'keytar'
import keythereum from 'keythereum'
import * as fs from 'fs-extra'

export type KeyObject = {
  address: string,
  Crypto: {
    cipher: string,
    ciphertext: string,
    cipherparams: {
      iv: string,
    },
    mac: string,
    kdf: string,
    kdfparams: {
      c: number,
      dklen: number,
      prf: string,
      salt: string,
    },
  },
  id: string,
  version: number,
}

const homedir = os.homedir()
const service = 'com.mainframe.services.swarm'
const account = 'mainframe'
const datadir = `${homedir}${path.sep}.mainframe${path.sep}swarm`
const keystorePath = `${homedir}${path.sep}.mainframe${path.sep}swarm${
  path.sep
}keystore`

export const getSwarmKeystorePassword = async (): Promise<string> => {
  let password = await keytar.getPassword(service, account)
  if (password == null) {
    const buffer = crypto.randomBytes(48)
    password = buffer.toString('hex')
    await keytar.setPassword(service, account, password)
    return password
  } else {
    return password
  }
}

export const createKeyStore = async (): Promise<string> => {
  const params = { keyBytes: 32, ivBytes: 16 }
  const dk = keythereum.create(params)
  const kdf = 'pbkdf2'

  const options = {
    kdf: kdf,
    cipher: 'aes-128-ctr',
    kdfparams: {
      c: 262144,
      dklen: 32,
      prf: 'hmac-sha256',
    },
  }
  const password = await getSwarmKeystorePassword()
  const keyObject = keythereum.dump(
    password,
    dk.privateKey,
    dk.salt,
    dk.iv,
    options,
  )
  await fs.ensureDir(datadir)
  await keythereum.exportToFile(keyObject, keystorePath)
  return keyObject.address
}

export const importKeyStore = async (address: string): Promise<KeyObject> => {
  return keythereum.importFromFile(address, datadir)
}

export const getPrivateKey = async (
  address: string,
  encoding?: string = 'hex',
): Promise<string> => {
  const password = await getSwarmKeystorePassword()
  const keyObject = keythereum.importFromFile(address, datadir)
  const keyBuffer = await keythereum.recover(password, keyObject)
  return keyBuffer.toString(encoding)
}

export const listKeyStores = async (): Promise<KeyObject[]> => {
  fs.ensureDir(datadir)
  let i = 0
  let keyObjects = []
  const keystores = await fs.readdir(keystorePath)
  if (keystores.length >= 1) {
    keyObjects = []
    for (i = 0; i < keystores.length; ++i) {
      const address = keystores[i].substr(keystores[i].length - 40)
      const keyObject = await importKeyStore(address)
      keyObjects.push(keyObject)
    }
  }
  return keyObjects
}
