import {
  PASSWORDHASH_ALG_ARGON2ID13,
  PASSWORDHASH_MEMLIMIT_SENSITIVE,
  PASSWORDHASH_OPSLIMIT_SENSITIVE,
  SECRETBOX_KEYBYTES,
} from '@mainframe/utils-crypto'
import { tmpdir } from 'os'
import { join } from 'path'

import Vault, { createVaultKeyParams, readVaultFile } from '../lib/vault/Vault'

const getFixture = name => join(__dirname, '__fixtures__', name)
const getTempFile = name => join(tmpdir(), 'mf-platform-vault', name)

describe('vault', () => {
  it('createVaultKeyParams() creates a random key using the provided password', async () => {
    const keyParams = await createVaultKeyParams(Buffer.from('test'))
    expect(keyParams.key).toHaveLength(SECRETBOX_KEYBYTES)
    expect(keyParams.kdf).toEqual({
      algorithm: PASSWORDHASH_ALG_ARGON2ID13,
      memlimit: PASSWORDHASH_MEMLIMIT_SENSITIVE,
      opslimit: PASSWORDHASH_OPSLIMIT_SENSITIVE,
      salt: expect.any(String),
    })
  })

  it('readVaultFile() opens the vault file when provided the correct password', async () => {
    const file = await readVaultFile(
      getFixture('1.vault-ok.json'),
      Buffer.from('password'),
    )
    expect(file.data).toEqual(expect.any(Object))
    expect(file.keyParams).toEqual(expect.any(Object))
  })

  it('readVaultFile() throws an error if the vault password is incorrect', () => {
    expect(
      readVaultFile(
        getFixture('1.vault-ok.json'),
        Buffer.from('wrong password'),
      ),
    ).rejects.toThrow('Invalid password')
  })

  it('readVaultFile() throws an error if no metadata is provided', () => {
    expect(
      readVaultFile(
        getFixture('2.vault-no-metadata.json'),
        Buffer.from('password'),
      ),
    ).rejects.toThrow('Missing metadata')
  })

  it('readVaultFile() throws an error if the metadata version is not 1', () => {
    expect(
      readVaultFile(
        getFixture('3.vault-metadata-bad-version.json'),
        Buffer.from('password'),
      ),
    ).rejects.toThrow('Invalid vault format version')
  })

  it('readVaultFile() throws an error if the metadata KDF params are not set', () => {
    expect(
      readVaultFile(
        getFixture('4.vault-metadata-no-kdf.json'),
        Buffer.from('password'),
      ),
    ).rejects.toThrow('Missing KDF parameters in metadata')
  })

  it('Vault.create() creates a vault and Vault.open() opens it', async () => {
    jest.setTimeout(15000) // 15 secs - password hashing takes a few secs
    const path = getTempFile('vault-create-open')
    const password = Buffer.from('password')
    await Vault.create(path, password)
    await Vault.open(path, password)
    expect(Vault.open(path, Buffer.from('incorrect'))).rejects.toThrow(
      'Invalid password',
    )
  })
})
