/*eslint-env mocha */

const assert = require('assert')
const {
  checkConsole,
  unlockVault,
  createVault,
  getApp,
  stopApp,
} = require('./utils')
const { timeouts } = require('./config')

const configs = {
  elements: {
    createVault: '[data-testid="create-vault-view"]',
    unlockVault: '[data-testid="unlock-vault-view"]',
    unlockPassword: '[data-testid="vault-manager-unlock-input"]',
    unlockButton: '[data-testid="vault-manager-unlock-button"]',
    unlockPasswordValidation:
      '[data-testid="vault-manager-unlock-input-errorTestId"]',
    unlockMessage: '[data-testid="vault-manager-unlock-input-messageTestId"]',
    createVaultButton: '[data-testid="create-vault-submit-button"]',
    createPasswordValidation:
      '[data-testid="create-vault-input-password-errorTestId"]',
    createPassword: '[data-testid="create-vault-input-password"]',
    createConfirmPassword:
      '[data-testid="create-vault-input-confirm-password"]',
    createConfirmPasswordValidation:
      '[data-testid="create-vault-input-confirm-password-errorTestId"]',
  },
  messages: {
    invalidPassword:
      'Failed to unlock vault, please check you entered the correct password.',
    noPassword: 'Password is required.',
    noMatch: 'Passwords do not match',
    tooShort: 'Password must be at least 8 characters',
  },
}

describe('Vault operations', function() {
  this.timeout(timeouts.viewChange)
  before(function() {
    return getApp(this)
    // TODO: find a way to create test env, setup daemon and start it automatically
    // const { Environment } = await import('../../config/src/Environment')
    // const {
    //   setupDaemon,
    //   startDaemon,
    // } = await import('../../toolbox/src/daemon')
    // const { createVault, resolvePath } = await import('../../cli/src/Command')
    // const { DaemonConfig } = await import('../../config/src/daemon')
    //
    // const daemonPath = path.join(__dirname, '..', '..', 'daemon/bin/run')
    // await Environment.create('vaultTest', 'testing', true)
    // const cfg = new DaemonConfig(Environment)
    // setupDaemon(cfg, {
    //   binPath: resolvePath(binPath),
    //   socketPath: undefined,
    // })
    // startDaemon(cfg, true)
  })

  // beforeEach(function() {
  //   this.app.restart()
  // })

  after(function() {
    stopApp(this.app)
    // TODO: find a way to stop daemon and destroy env automatically
    // const {
    //   stopDaemon,
    // } = await import('../../toolbox/src/daemon')
    //
    // stopDaemon(new DaemonConfig(Environment))
    // await Environment.destroy('vaultTest')
  })

  describe('Unlock vault', function() {
    it('shows an initial window', async function() {
      const count = await this.app.client.getWindowCount()
      assert.equal(count, 1)
    })

    it('no browser warnings/errors after launch', async function() {
      const logs = await checkConsole(this.app, 'browser')
      assert.equal(logs.warnings.length, 0, logs.warnings.warnings)
      assert.equal(logs.errors.length, 0, logs.errors.errors)
    })

    it('"Password is required" warning', async function() {
      await this.app.client.waitForExist(
        configs.elements.unlockVault,
        timeouts.viewChange,
      )
      await this.app.client.element(configs.elements.unlockButton).click()
      assert.equal(
        await this.app.client
          .element(configs.elements.unlockPasswordValidation)
          .getText(),
        configs.messages.noPassword,
      )
    })

    it('"Wrong password" warning', async function() {
      const unlocked = await unlockVault(this.app, 'badPassword', false)
      assert.equal(unlocked.unlocked, false)
      await this.app.client.waitForExist(
        configs.elements.unlockMessage,
        timeouts.launch,
      )
      assert.equal(
        await this.app.client.getText(configs.elements.unlockMessage),
        configs.messages.invalidPassword,
      )
    })

    it('vault is unlocked correctly', async function() {
      const unlocked = await unlockVault(this.app, 'password')
      assert.equal(unlocked.unlocked, true, unlocked.error)
    })

    it('no browser warnings/errors after unlocking', async function() {
      const logs = await checkConsole(this.app, 'browser')
      assert.equal(logs.warnings.length, 0, logs.warnings.warnings)
      assert.equal(logs.errors.length, 0, logs.errors.errors)
    })
  })

  describe('Create vault', function() {
    it('shows an initial window', async function() {
      const count = await this.app.client.getWindowCount()
      assert.equal(count, 1)
    })

    it('no browser warnings/errors after launch', async function() {
      const logs = await checkConsole(this.app, 'browser')
      assert.equal(logs.warnings.length, 0, logs.warnings.warnings)
      assert.equal(logs.errors.length, 0, logs.errors.errors)
    })

    it('no password', async function() {
      await this.app.client.waitForExist(
        configs.elements.createVault,
        timeouts.viewChange,
      )
      await this.app.client.element(configs.elements.createVaultButton).click()
      assert.equal(
        await this.app.client
          .element(configs.elements.createPasswordValidation)
          .getText(),
        configs.messages.noPassword,
      )
    })

    it('passwords do not match', async function() {
      await this.app.client.waitForExist(
        configs.elements.createVault,
        timeouts.viewChange,
      )
      await this.app.client
        .element(configs.elements.createPassword)
        .setValue('password')
      await this.app.client
        .element(configs.elements.createConfirmPassword)
        .setValue('different')
      await this.app.client.element(configs.elements.createVaultButton).click()
      assert.equal(
        await this.app.client
          .element(configs.elements.createConfirmPasswordValidation)
          .getText(),
        configs.messages.noMatch,
      )
    })

    it('password too short', async function() {
      await this.app.client.waitForExist(
        configs.elements.createVault,
        timeouts.viewChange,
      )
      await this.app.client
        .element(configs.elements.createPassword)
        .setValue('short')
      await this.app.client.element(configs.elements.createVaultButton).click()
      assert.equal(
        await this.app.client
          .element(configs.elements.createPasswordValidation)
          .getText(),
        configs.messages.tooShort,
      )
    })

    it('creates a new vault', async function() {
      const created = await createVault(this.app, 'password')
      assert.equal(created.created, true, created.error)
    })

    it('no browser warnings/errors after creating vault', async function() {
      const logs = await checkConsole(this.app, 'browser')
      assert.equal(logs.warnings.length, 0, logs.warnings.warnings)
      assert.equal(logs.errors.length, 0, logs.errors.errors)
    })
  })
})
