/*eslint-env mocha */

const assert = require('assert')
const path = require('path')
const os = require('os')
const Application = require('spectron').Application
const { checkConsole, unlockVault } = require('./utils')

describe('Vault operations', function() {
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

  describe('Unlock vault', function() {
    it('shows an initial window', async function() {
      const count = await this.app.client.getWindowCount()
      assert.equal(count, 1)
    })

    it('no browser warnings after launch', async function() {
      const warnings = await checkConsole(this.app, 'browser', 'WARNING')
      assert.equal(
        warnings.length,
        0,
        'There are ' + warnings.length + ' warnings',
      )
    })

    it('no browser errors after launch', async function() {
      const errors = await checkConsole(this.app, 'browser', 'SEVERE')
      assert.equal(errors.length, 0, 'There are ' + errors.length + ' errors')
    })

    it('"Password is required" warning', async function() {
      await this.app.client
        .element('[data-testid="create-vault-button-submit"]')
        .click()
      assert.equal(
        await this.app.client.getValue(
          '[data-testid="vault-manager-unlock-input-errorTestId"]',
        ),
        'Password is required.',
      )
    })

    it('"Wrong password" warning', async function() {
      const unlocked = await unlockVault(this.app, 'badPassword')
      assert.equal(unlocked.unlocked, false)
      assert.equal(
        await this.app.client.getValue(
          '[data-testid="vault-manager-unlock-input-errorTestId"]',
        ),
        'Failed to unlock vault, please check you entered the correct password.',
      )
    })

    it('Vault is unlocked correctly', async function() {
      const unlocked = await unlockVault(this.app, 'password')
      assert.equal(unlocked.unlocked, true, unlocked.error)
    })
  })

  describe('Create vault', function() {})
})
