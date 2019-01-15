/*eslint-env mocha */

const assert = require('assert')
const { launcherTestId, onboardTestId, timeouts } = require('./config')
const { checkConsole, createVault, getApp, stopApp } = require('./utils')

describe('Onboarding process', function() {
  this.timeout(timeouts.viewChange)

  before(function() {
    return getApp(this)
    // const daemonPath = path.join(__dirname, '..', '..', 'daemon/bin/run')
    // await Environment.create('vaultTest', 'testing', true)
    // const cfg = new DaemonConfig(Environment)
    // setupDaemon(cfg, {
    //   binPath: resolvePath(daemonPath),
    //   socketPath: undefined,
    // })
    // startDaemon(cfg, true)
  })

  after(function() {
    // stopDaemon(new DaemonConfig(Environment))
    // await Environment.destroy('vaultTest')
    stopApp(this.app)
  })
  describe('Creating identity', function() {
    it('vault created correctly before onboarding process', async function() {
      const created = await createVault(this.app, 'password')
      assert.equal(created.created, true, created.error)
    })

    it('no browser warnings/errors before onboarding', async function() {
      const logs = await checkConsole(this.app, 'browser')
      assert.equal(logs.warnings.length, 0, logs.warnings.warnings)
      assert.equal(logs.errors.length, 0, logs.errors.errors)
    })

    it('"Name is required" warning', async function() {
      await this.app.client.waitForExist(
        onboardTestId.elements.onboard,
        timeouts.viewChange,
      )
      await this.app.client
        .element(onboardTestId.elements.vaultIdentityButton)
        .click()
      assert.equal(
        await this.app.client
          .element(onboardTestId.elements.vaultIdentityValidation)
          .getText(),
        onboardTestId.messages.noIdentity,
      )
    })

    it('identity is saved correctly', async function() {
      await this.app.client.waitForExist(
        onboardTestId.elements.onboard,
        timeouts.viewChange,
      )
      await this.app.client
        .element(onboardTestId.elements.vaultIdentity)
        .setValue('test-identity')
      await this.app.client
        .element(onboardTestId.elements.vaultIdentityButton)
        .click()
      await this.app.client.waitForExist(
        launcherTestId.elements.launcher,
        timeouts.viewChange,
      )
      await this.app.client
        .element(launcherTestId.elements.identitiesNavButton)
        .click()
      assert.equal(
        await this.app.client.waitForExist(
          launcherTestId.elements.testIdentity,
          timeouts.input,
        ),
        true,
      )
    })

    it('no browser warnings/errors after onboarding', async function() {
      const logs = await checkConsole(this.app, 'browser')
      assert.equal(logs.warnings.length, 0, logs.warnings.warnings)
      assert.equal(logs.errors.length, 0, logs.errors.errors)
    })
  })
})
