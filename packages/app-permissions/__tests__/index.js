import { checkURL, mergeGrantsToDetails } from '../lib'

describe('app-permissions', () => {
  it('checkURL() returns the host only if the URL is valid', () => {
    expect(checkURL('')).toBeUndefined()
    expect(checkURL('hello world')).toBeUndefined()
    expect(checkURL('ftp://user@host.com')).toBeUndefined() // Not HTTPS or WSS
    expect(checkURL('https://api.example.com:3000/users/me')).toBe(
      'api.example.com:3000',
    )
  })

  it('checkURL() supports providing accepted protocols', () => {
    const url = 'ftp://user:pwd@host.com:211'
    expect(checkURL(url)).toBeUndefined()
    expect(checkURL(url, ['http:', 'https:'])).toBeUndefined()
    expect(checkURL(url, ['http:', 'https:', 'ftp:'])).toBe('host.com:211')
  })

  it('mergeGrantsToDetails() merges app and user grants', () => {
    const appGrants = {
      WEB3_SEND: false,
      WEB_REQUEST: {
        granted: ['https://google.com', 'https://twitter.com'],
        denied: [],
      },
    }
    const userGrants = {
      LOCATION_GET: true,
      WEB_REQUEST: {
        granted: ['https://mainframe.com'],
        denied: ['https://facebook.com'],
      },
    }

    const details = {
      app: appGrants,
      user: userGrants,
      session: {
        WEB_REQUEST: {
          granted: [
            'https://google.com',
            'https://twitter.com',
            'https://mainframe.com',
          ],
          denied: ['https://facebook.com'],
        },
        LOCATION_GET: true,
        WEB3_SEND: false,
      },
    }

    expect(mergeGrantsToDetails(appGrants, userGrants)).toEqual(details)
  })

  it('mergeGrantsToDetails() merges WEB_REQUEST grants', () => {
    const g1 = ['https://google.com', 'https://twitter.com']
    const g2 = ['https://mainframe.com']
    const result = mergeGrantsToDetails(
      { WEB_REQUEST: { granted: g1, denied: [] } },
      { WEB_REQUEST: { granted: g2, denied: [] } },
    )
    expect(result.session.WEB_REQUEST.granted).toEqual([...g1, ...g2])
  })
})
