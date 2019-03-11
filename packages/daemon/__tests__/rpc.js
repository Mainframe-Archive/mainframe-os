import '@babel/polyfill'

import methods from '../lib/rpc/methods'

describe('RPC methods', () => {
  it('"api_version" returns the version', () => {
    expect(methods.api_version()).toBe(0.1)
  })
})
