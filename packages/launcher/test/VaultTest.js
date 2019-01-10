/*eslint-env mocha */

const assert = require('assert')
const path = require('path')
const os = require('os')
const Application = require('spectron').Application
const { checkConsole, unlockVault, createVaultUI } = require('./utils')
const { vaultTestId, onboardTestId, timeouts } = require('./config')
const { Environment } = require('../../config/src/Environment')
const {
  setupDaemon,
  startDaemon,
  stopDaemon,
} = require('../../toolbox/src/daemon')
const { createVault, resolvePath } = require('../../cli/src/Command')
const { DaemonConfig } = require('../../config/src/daemon')

describe('Vault operations', function() {
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

  // beforeEach(function() {
  //   this.app.restart()
  // })

  after(function() {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  describe('Unlock vault', function() {
    before(async function() {
      const binPath = path.join(__dirname, '..', '..', 'daemon/bin/run')
      await Environment.create('vaultTest', 'testing', true)
      const cfg = new DaemonConfig(Environment)
      setupDaemon(cfg, {
        binPath: resolvePath(binPath),
        socketPath: undefined,
      })
      startDaemon(cfg, true)
      createVault(cfg, binPath, cfg.defaultVault == null)
    })
    after(async function() {
      stopDaemon(new DaemonConfig(Environment))
      await Environment.destroy('vaultTest')
    })
    this.timeout(15000)
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
      await this.app.client.element(vaultTestId.elements.unlockButton).click()
      assert.equal(
        await this.app.client.getValue(
          vaultTestId.elements.unlockPasswordValidation,
        ),
        vaultTestId.messages.noPassword,
      )
    })

    it('"Wrong password" warning', async function() {
      const unlocked = await unlockVault(this.app, 'badPassword')
      assert.equal(unlocked.unlocked, false)
      // await this.app.client.waitForExist(
      //   vaultTestId.elements.unlockMessage,
      //   timeouts.input,
      // )
      assert.equal(
        await this.app.client.getValue(vaultTestId.elements.unlockMessage),
        vaultTestId.messages.invalidPassword,
      )
    })

    it('vault is unlocked correctly', async function() {
      const unlocked = await unlockVault(this.app, 'password')
      assert.equal(unlocked.unlocked, true, unlocked.error)
    })

    it('no browser warnings after unlocking', async function() {
      await unlockVault(this.app, 'password')
      const warnings = await checkConsole(this.app, 'browser', 'WARNING')
      assert.equal(
        warnings.length,
        0,
        'There are ' + warnings.length + ' warnings',
      )
    })

    it('no browser errors after unlocking', async function() {
      await unlockVault(this.app, 'password')
      const errors = await checkConsole(this.app, 'browser', 'SEVERE')
      assert.equal(errors.length, 0, 'There are ' + errors.length + ' errors')
    })
  })

  describe('Create vault', function() {
    beforeAll(async function() {
      await Environment.create('vaultTest', 'testing', true)
    })
    afterAll(async function() {
      await Environment.destroy('vaultTest')
    })
    this.timeout(10000)
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

    it('no password', async function() {
      await this.app.client
        .element(vaultTestId.elements.createVaultButton)
        .click()
      assert.equal(
        await this.app.client.getValue(
          vaultTestId.elements.createPasswordValidation,
        ),
        vaultTestId.messages.noPassword,
      )
    })

    it('passwords do not match', async function() {
      await this.app.client
        .element(vaultTestId.elements.createPassword)
        .setValue('password')
      await this.app.client
        .element(vaultTestId.elements.createConfirmPassword)
        .setValue('different')
      await this.app.client
        .element(vaultTestId.elements.createVaultButton)
        .click()
      assert.equal(
        await this.app.client.getValue(
          vaultTestId.elements.createConfirmPasswordValidation,
        ),
        vaultTestId.messages.noMatch,
      )
    })

    it('password too short', async function() {
      await this.app.client
        .element(vaultTestId.elements.createPassword)
        .setValue('short')
      await this.app.client
        .element(vaultTestId.elements.createVaultButton)
        .click()
      assert.equal(
        await this.app.client.getValue(
          vaultTestId.elements.createPasswordValidation,
        ),
        vaultTestId.messages.tooShort,
      )
    })

    it('creates a new vault', async function() {
      await createVaultUI(this.app, 'password')
      const onBoarding = await this.app.client.waitForExist(
        onboardTestId.elements.onboard,
        timeouts.viewChange,
      )
      assert.equal(onBoarding, true)
    })
  })
})
