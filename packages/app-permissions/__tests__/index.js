import { readFileSync } from 'fs'
import { EMPTY_DEFINITIONS, mergeGrantsToDetails } from '../lib'

const readJsonFixture = filename => {
  const fullpath = getFixture(__dirname, filename)
  const json = readFileSync(fullpath, 'utf8')
  try {
    return JSON.parse(json)
  } catch (err) {
    if (err.name === 'SyntaxError') {
      err.message = err.message + ' in file ' + filename
    }
    throw err
  }
}

describe('EMPTY_DEFINITIONS', () => {
  it('has HTTPS_REQUEST', () => {
    expect(EMPTY_DEFINITIONS).toHaveProperty('HTTPS_REQUEST')
  })
})

describe('mergeGrantsToDetails', () => {
  it('merges', () => {
    const app = readJsonFixture('grant_google_twitter.json')
    const user = readJsonFixture('grant_google_mainframe.json')

    const details = readJsonFixture('details_merged.json')

    expect(mergeGrantsToDetails(app, user)).toEqual(details)
  })

  it('session grants are UNIONed', () => {
    let g1 = ['https://google.com', 'https://twitter.com']
    let g2 = ['https://google.com', 'https://mainframe.com']
    let result = mergeGrantsToDetails(
      { HTTPS_REQUEST: { granted: g1, denied: [] } },
      { HTTPS_REQUEST: { granted: g2, denied: [] } },
    )
    expect(result.session.HTTPS_REQUEST.granted).toEqual([
      'https://google.com',
      'https://twitter.com',
      'https://mainframe.com',
    ])
  })
})
