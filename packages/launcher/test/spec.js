const assert = require('assert')
const path = require('path')
const os = require('os')
const Application = require('spectron').Application
const BzzAPI = require('erebos-api-bzz-node').default

const getFixture = fixture => path.join(__dirname, '../../../fixtures', fixture)

describe('Application launch', function() {
  // mocha requires non arrow style function to bind context
  this.timeout(10000)

  before(function() {
    const binPath =
      os.platform() === 'darwin'
        ? 'dist/mac/Mainframe.app/Contents/MacOS/Mainframe'
        : 'dist/linux-unpacked/mainframe'
    this.app = new Application({
      path: path.join(__dirname, '..', binPath),
    })

    // To run the tests locally without having to build the binary, the following code can be used
    // this.app = new Application({
    //   path: path.join(__dirname, '../node_modules/.bin/electron-webpack'),
    //   args: ['dev'],
    // })

    return this.app.start()
  })

  after(function() {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  it('shows an initial window', async function() {
    const count = await this.app.client.getWindowCount()
    assert.equal(count, 1)
  })

  it('creates a new vault', async function() {
    await this.app.client
      .element('[data-testid="create-vault-input-name"]')
      .setValue('test')
    await this.app.client
      .element('[data-testid="create-vault-input-password"]')
      .setValue('password')
    await this.app.client
      .element('[data-testid="create-vault-input-confirm-password"]')
      .setValue('password')
    await this.app.client
      .element('[data-testid="create-vault-button-submit"]')
      .click()
    await this.app.client.waitForExist('[data-testid="launcher-view"]', 8000)
  })

  it('completes app install flow and opens app', async function() {
    await this.app.client
      .element('[data-testid="launcher-install-app-button"]')
      .click()

    // Ensure test app is uploaded to Swarm before trying to install it
    const bzz = new BzzAPI('http://swarm-gateways.net')
    await bzz.uploadDirectoryFrom(getFixture('test-app'))
    const manifestPath = getFixture('test-app-manifest.json')

    const fileInputSelector = '#installer-file-selector'
    await this.app.client.waitForExist(fileInputSelector, 2000)
    await this.app.client.chooseFile(fileInputSelector, manifestPath)

    const identityInputSelector = '[data-testid="create-identity-input-name"]'
    await this.app.client.waitForExist(identityInputSelector, 2000)
    await this.app.client.element(identityInputSelector).setValue('tester')

    const identityButtonSelector =
      '[data-testid="create-identity-button-submit"]'
    await this.app.client.waitForExist(identityButtonSelector, 2000)
    await this.app.client.element(identityButtonSelector).click()

    const identitySelector = '[data-testid="identity-selector-select-tester"]'
    await this.app.client.waitForExist(identitySelector, 2000)
    await this.app.client.element(identitySelector).click()

    const permissionsBtnSelector = '[data-testid="installer-save-permissions"]'
    await this.app.client.waitForExist(permissionsBtnSelector, 2000)
    await this.app.client.element(permissionsBtnSelector).click()

    const appItemSelector = '[data-testid="launcher-open-app"]'
    await this.app.client.waitForExist(appItemSelector, 5000)
    await this.app.client.element(appItemSelector).click()

    const count = await this.app.client.getWindowCount()
    assert.equal(count, 2)
  })
})
