/*eslint-env mocha */

const assert = require('assert')
const path = require('path')
const os = require('os')
const Application = require('spectron').Application
const BzzAPI = require('@erebos/api-bzz-node').default
const { launcherTestId, timeouts } = require('./config')
const { checkConsole, unlockVault } = require('./utils')

const getFixture = fixture => path.join(__dirname, '../../../fixtures', fixture)

describe('Launcher testing', function() {
  this.timeout(timeouts.viewChange)

  before(function() {
    const launcherPath =
      os.platform() === 'darwin'
        ? 'dist/mac/Mainframe.app/Contents/MacOS/Mainframe'
        : 'dist/linux-unpacked/mainframe'
    this.app = new Application({
      path: path.join(__dirname, '..', launcherPath),
    })
    // const daemonPath = path.join(__dirname, '..', '..', 'daemon/bin/run')
    // await Environment.create('vaultTest', 'testing', true)
    // const cfg = new DaemonConfig(Environment)
    // setupDaemon(cfg, {
    //   binPath: resolvePath(daemonPath),
    //   socketPath: undefined,
    // })
    // startDaemon(cfg, true)
    return this.app.start()
  })

  after(function() {
    // stopDaemon(new DaemonConfig(Environment))
    // await Environment.destroy('vaultTest')
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  beforeEach(async function() {
    await this.app.restart()
    await unlockVault(this.app, 'password')
  })

  describe('Applications', function() {
    it('create an app', async function() {
      await this.app.client.waitForExist(
        launcherTestId.elements.launcher,
        timeouts.viewChange,
      )

      await this.app.client.waitForExist(
        launcherTestId.elements.applications.createAppButton,
        timeouts.input,
      )
      await this.app.client
        .element(launcherTestId.elements.applications.createAppButton)
        .click()
      await this.app.client.waitForExist(
        launcherTestId.elements.applications.appCreateModal,
        timeouts.viewChange,
      )

      await this.app.client.waitForExist(
        launcherTestId.elements.applications.creation.first.appName,
        timeouts.input,
      )
      await this.app.client
        .element(launcherTestId.elements.applications.creation.first.appName)
        .setValue('test-app')

      await this.app.client.waitForExist(
        launcherTestId.elements.applications.creation.first.appVersion,
        timeouts.input,
      )
      await this.app.client
        .element(launcherTestId.elements.applications.creation.first.appVersion)
        .setValue('1.0.0')

      const appContents = getFixture('test-app/index.html')

      await this.app.client.waitForExist(
        launcherTestId.elements.applications.creation.first.appPath,
        timeouts.input,
      )
      await this.app.client.chooseFile(
        launcherTestId.elements.applications.creation.first.appPath,
        appContents,
      )
      await this.app.client.waitForExist(
        launcherTestId.elements.applications.creation.first.confirm,
        timeouts.input,
      )
      await this.app.client
        .element(launcherTestId.elements.applications.creation.first.confirm)
        .click()

      await this.app.client.waitForExist(
        launcherTestId.elements.applications.creation.second.identityInput,
        timeouts.input,
      )
      await this.app.client
        .element(
          launcherTestId.elements.applications.creation.second.identityInput,
        )
        .setValue('dev')

      await this.app.client.waitForExist(
        launcherTestId.elements.applications.creation.second.confirm,
        timeouts.input,
      )
      await this.app.client
        .element(launcherTestId.elements.applications.creation.second.confirm)
        .click()

      await this.app.client.waitForExist(
        launcherTestId.elements.applications.creation.second.devIdentitySelect,
        timeouts.input,
      )
      await this.app.client
        .element(
          launcherTestId.elements.applications.creation.second
            .devIdentitySelect,
        )
        .click()

      await this.app.client.waitForExist(
        launcherTestId.elements.applications.creation.third.confirm,
        timeouts.input,
      )
      await this.app.client
        .element(launcherTestId.elements.applications.creation.third.confirm)
        .click()

      await this.app.client.waitForExist(
        launcherTestId.elements.applications.creation.final.confirm,
        timeouts.input,
      )
      await this.app.client
        .element(launcherTestId.elements.applications.creation.final.confirm)
        .click()

      await this.app.client.waitForExist(
        launcherTestId.elements.applications.createdAppItem,
        timeouts.input,
      )
      await this.app.client
        .element(launcherTestId.elements.applications.createdAppItem)
        .click()

      await this.app.client.waitForExist(
        launcherTestId.elements.applications.testIdentity,
        timeouts.launch,
      )
      await this.app.client
        .element(launcherTestId.elements.applications.testIdentity)
        .click()

      assert.equal(await this.app.client.getWindowCount(), 2)
    })

    it('install an app', async function() {
      await this.app.client.waitForExist(
        launcherTestId.elements.launcher,
        timeouts.viewChange,
      )

      await this.app.client.waitForExist(
        launcherTestId.elements.applications.installAppButton,
        timeouts.input,
      )
      await this.app.client
        .element(launcherTestId.elements.applications.installAppButton)
        .click()

      // Ensure test app is uploaded to Swarm before trying to install it
      const bzz = new BzzAPI('http://swarm-gateways.net')
      await bzz.uploadDirectoryFrom(getFixture('test-app'))
      const manifestPath = getFixture('test-app-manifest.json')
      await this.app.client.waitForExist(
        launcherTestId.elements.applications.installation.appPath,
        timeouts.input,
      )
      await this.app.client.chooseFile(
        launcherTestId.elements.applications.installation.appPath,
        manifestPath,
      )

      await this.app.client.waitForExist(
        launcherTestId.elements.applications.installation.identityInput,
        timeouts.input,
      )
      await this.app.client
        .element(
          launcherTestId.elements.applications.installation.identityInput,
        )
        .setValue('tester')

      await this.app.client.waitForExist(
        launcherTestId.elements.applications.installation.createIdentity,
        timeouts.input,
      )
      await this.app.client
        .element(
          launcherTestId.elements.applications.installation.createIdentity,
        )
        .click()

      await this.app.client.waitForExist(
        launcherTestId.elements.applications.installation.testerIdentitySelect,
        timeouts.input,
      )
      await this.app.client
        .element(
          launcherTestId.elements.applications.installation
            .testerIdentitySelect,
        )
        .click()

      await this.app.client.waitForExist(
        launcherTestId.elements.applications.installedAppItem,
        timeouts.launch,
      )
      await this.app.client
        .element(launcherTestId.elements.applications.installedAppItem)
        .click()

      await this.app.client.waitForExist(
        launcherTestId.elements.applications.installation.testerIdentitySelect,
        timeouts.input,
      )
      await this.app.client
        .element(
          launcherTestId.elements.applications.installation
            .testerIdentitySelect,
        )
        .click()

      assert.equal(await this.app.client.getWindowCount(), 2)
    })
  })

  describe('Identities', function() {
    //TODO test identities
  })
  describe('Wallets', function() {
    //TODO test wallets
  })
})
