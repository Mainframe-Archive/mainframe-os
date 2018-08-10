const assert = require('assert')
const path = require('path')
const os = require('os')
const Application = require('spectron').Application

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
    return this.app.start()
  })

  after(function() {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  it('shows an initial window', async function() {
    return this.app.client.getWindowCount().then(function(count) {
      assert.equal(count, 1)
    })
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
    return this.app.client.waitForExist('[data-testid="launcher-view"]', 8000)
  })
  // it('completes app install flow and opens app', async function() {
  //   await this.app.client
  //     .element('[data-testid="launcher-install-app-button"]')
  //     .click()
  //   const manifestPath = path.join(
  //     __dirname,
  //     '..',
  //     'static',
  //     'applications',
  //     'exampleApp',
  //     'manifest.json',
  //   )
  //   const fileInputSelector = '#installer-file-selector'
  //   await this.app.client.waitForExist(fileInputSelector, 2000)
  //   await this.app.client.chooseFile(fileInputSelector, manifestPath)
  //
  //   const identityInputSelector = '[data-testid="create-identity-input-name"]'
  //   await this.app.client.waitForExist(identityInputSelector, 2000)
  //   await this.app.client.element(identityInputSelector).setValue('tester')
  //
  //   const identityButtonSelector =
  //     '[data-testid="create-identity-button-submit"]'
  //   await this.app.client.waitForExist(identityButtonSelector, 2000)
  //   await this.app.client.element(identityButtonSelector).click()
  //
  //   const identitySelector = '[data-testid="identity-selector-select-tester"]'
  //   await this.app.client.waitForExist(identitySelector, 2000)
  //   await this.app.client.element(identitySelector).click()
  //
  //   const permissionsBtnSelector = '[data-testid="installer-save-permissions"]'
  //   await this.app.client.waitForExist(permissionsBtnSelector, 2000)
  //   await this.app.client.element(permissionsBtnSelector).click()
  //
  //   const appItemSelector = '[data-testid="launcher-open-app"]'
  //   await this.app.client.waitForExist(appItemSelector, 2000)
  //   await this.app.client.element(appItemSelector).click()
  //   return this.app.client.getWindowCount().then(count => {
  //     assert.equal(count, 2)
  //   })
  // })
})
