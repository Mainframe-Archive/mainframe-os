import methods from '../lib/rpc/methods'

describe('RPC methods', () => {
  it('"api_version" returns the version', () => {
    expect(methods.api_version()).toBe(0.1)
  })

  it('"app_validateManifest" returns the ManifestValidationResult', () => {
    const invalidManifest = {
      id: '1234',
      author: {},
    }
    expect(methods.app_validateManifest(null, [invalidManifest])).toEqual({
      result: 'invalid_author',
    })

    const validManifest = {
      id: '1234',
      author: { id: '1234' },
      name: 'test app',
      version: '1.2.3',
      contentsHash: '1234',
      permissions: {
        required: {},
        optional: {},
      },
    }
    expect(methods.app_validateManifest(null, [validManifest])).toEqual({
      result: 'valid',
    })
  })
})
