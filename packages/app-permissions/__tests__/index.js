import { EMPTY_DEFINITIONS, mergeGrantsToDetails } from '../lib'

describe('EMPTY_DEFINITIONS', () => {
  it('has WEB_REQUEST', () => {
    expect(EMPTY_DEFINITIONS).toHaveProperty('WEB_REQUEST')
  })
})

describe('mergeGrantsToDetails', () => {
  it('merges', () => {
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

  it('session WEB_REQUEST grants are concatenated', () => {
    const g1 = ['https://google.com', 'https://twitter.com']
    const g2 = ['https://mainframe.com']
    const result = mergeGrantsToDetails(
      { WEB_REQUEST: { granted: g1, denied: [] } },
      { WEB_REQUEST: { granted: g2, denied: [] } },
    )
    expect(result.session.WEB_REQUEST.granted).toEqual([
      'https://google.com',
      'https://twitter.com',
      'https://mainframe.com',
    ])
  })
})
