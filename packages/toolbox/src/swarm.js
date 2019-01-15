// @flow

import os from 'os'
import keythereum from 'keythereum'
import fs from 'fs-extra'

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
const password = 'mainframe'
const datadir = `${homedir}/.ethereum`

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

  const keyObject = keythereum.dump(
    password,
    dk.privateKey,
    dk.salt,
    dk.iv,
    options,
  )
  await fs.ensureDir('keystore')
  const path = await keythereum.exportToFile(keyObject)
  await fs.ensureDir(datadir)
  await fs.copy(path, `${datadir}/${path}`)
  return keyObject.address
}

export const importKeyStore = async (address: string): Promise<KeyObject> => {
  return keythereum.importFromFile(address, datadir)
}

export const getPrivateKey = async (
  address: string,
  encoding: string,
): Promise<string> => {
  const keyObject = keythereum.importFromFile(address, datadir)
  const keyBuffer = await keythereum.recover(password, keyObject)
  return keyBuffer.toString(encoding)
}

export const listKeyStores = async (): Promise<KeyObject[]> => {
  fs.ensureDir(datadir)
  let i = 0
  let keyObjects
  const keystores = await fs.readdir(`${datadir}/keystore`)
  // eslint-disable-next-line no-console
  console.log('Existing keystore files:')
  // eslint-disable-next-line no-console
  console.log(keystores)
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
