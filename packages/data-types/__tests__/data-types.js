import { encodeMainframeID, isValidMainframeID } from '..'

describe('data-types', () => {
  it('encodes and validates Mainframe IDs', () => {
    expect(isValidMainframeID('test')).toBe(false)
    const id = encodeMainframeID(Buffer.from('test'))
    expect(isValidMainframeID(id)).toBe(true)
  })
})
