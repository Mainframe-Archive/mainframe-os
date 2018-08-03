import MainframeClient from '..'

jest.mock('@mainframe/rpc-ipc', () => {
  return () => ({
    request: jest.fn(() => Promise.resolve()),
  })
})

describe('client', () => {
  let client
  beforeEach(() => {
    client = new MainframeClient()
  })

  it('has an apiVersion() method', async () => {
    await client.apiVersion()
    expect(client._rpc.request).toHaveBeenCalledTimes(1)
    expect(client._rpc.request).toHaveBeenCalledWith('api_version')
  })
})
