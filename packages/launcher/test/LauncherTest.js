/*eslint-env mocha */

const assert = require('assert')
const path = require('path')
const BzzAPI = require('@erebos/api-bzz-node').default
const { timeouts } = require('./config')
const { unlockVault, getApp, stopApp } = require('./utils')

const getFixture = fixture => path.join(__dirname, '../../../fixtures', fixture)

const configs = {
  elements: {
    launcher: '[data-testid="launcher-view"]',
    navigation: {
      applicationsNavButton: '[data-testid="nav-button-Applications"]',
      identitiesNavButton: '[data-testid="nav-button-Identities"]',
      walletsNavButton: '[data-testid="nav-button-Wallets"]',
    },
    applications: {
      createAppButton: '[data-testid="launcher-create-app-button"]',
      installAppButton: '[data-testid="launcher-install-app-button"]',
      appCreateModal: '[data-testid="app-create-modal"]',
      createdAppItem: '[data-testid="own-app-test-app"]',
      installedAppItem: '[data-testid="installed-app-manifest-test"]',
      testIdentity: '[data-testid="identity-selector-select-test-identity"]',
      creation: {
        first: {
          appName: '[data-testid="create-app-name-input"]',
          appVersion: '[data-testid="create-app-version-input"]',
          appPath: '[id="app-contents-file-selector"]',
          confirm: '[data-testid="create-app-set-info-button"]',
        },
        second: {
          identityInput: '[data-testid="create-identity-input-name"]',
          confirm: '[data-testid="create-identity-submit-button"]',
          devIdentitySelect: '[data-testid="identity-selector-select-dev"]',
        },
        third: {
          confirm: '[data-testid="set-permission-requirements"]',
        },
        final: {
          confirm: '[data-testid="create-app-complete-button"]',
        },
      },
      installation: {
        appPath: '[id="installer-file-selector"]',
        identityInput: '[data-testid="create-identity-input-name"]',
        createIdentity: '[data-testid="create-identity-submit-button"]',
        testerIdentitySelect: '[data-testid="identity-selector-select-tester"]',
      },
    },
    identities: {
      testIdentity: '[data-testid="identity-name-test-identity"]',
    },
    wallets: {},
  },
}

describe('Launcher testing', function() {
  this.timeout(timeouts.viewChange)

  before(function() {
    return getApp(this)
  })

  after(function() {
    stopApp(this.app)
  })

  beforeEach(async function() {
    await this.app.restart()
    await unlockVault(this.app, 'password')
  })

  describe('Applications', function() {
    it('create an app', async function() {
      await this.app.client.waitForExist(
        configs.elements.launcher,
        timeouts.viewChange,
      )

      await this.app.client.waitForExist(
        configs.elements.applications.createAppButton,
        timeouts.input,
      )
      await this.app.client
        .element(configs.elements.applications.createAppButton)
        .click()
      await this.app.client.waitForExist(
        configs.elements.applications.appCreateModal,
        timeouts.viewChange,
      )

      await this.app.client.waitForExist(
        configs.elements.applications.creation.first.appName,
        timeouts.input,
      )
      await this.app.client
        .element(configs.elements.applications.creation.first.appName)
        .setValue('test-app')

      await this.app.client.waitForExist(
        configs.elements.applications.creation.first.appVersion,
        timeouts.input,
      )
      await this.app.client
        .element(configs.elements.applications.creation.first.appVersion)
        .setValue('1.0.0')

      const appContents = getFixture('test-app')

      await this.app.client.waitForExist(
        configs.elements.applications.creation.first.appPath,
        timeouts.input,
      )
      await this.app.client
        .element(configs.elements.applications.creation.first.appPath)
        .addValue(appContents)
      await this.app.client.waitForExist(
        configs.elements.applications.creation.first.confirm,
        timeouts.input,
      )
      await this.app.client
        .element(configs.elements.applications.creation.first.confirm)
        .click()

      await this.app.client.waitForExist(
        configs.elements.applications.creation.second.identityInput,
        timeouts.input,
      )
      await this.app.client
        .element(configs.elements.applications.creation.second.identityInput)
        .setValue('dev')

      await this.app.client.waitForExist(
        configs.elements.applications.creation.second.confirm,
        timeouts.input,
      )
      await this.app.client
        .element(configs.elements.applications.creation.second.confirm)
        .click()

      await this.app.client.waitForExist(
        configs.elements.applications.creation.second.devIdentitySelect,
        timeouts.input,
      )
      await this.app.client
        .element(
          configs.elements.applications.creation.second.devIdentitySelect,
        )
        .click()

      await this.app.client.waitForExist(
        configs.elements.applications.creation.third.confirm,
        timeouts.input,
      )
      await this.app.client
        .element(configs.elements.applications.creation.third.confirm)
        .click()

      await this.app.client.waitForExist(
        configs.elements.applications.creation.final.confirm,
        timeouts.input,
      )
      await this.app.client
        .element(configs.elements.applications.creation.final.confirm)
        .click()

      await this.app.client.waitForExist(
        configs.elements.applications.createdAppItem,
        timeouts.input,
      )
      await this.app.client
        .element(configs.elements.applications.createdAppItem)
        .click()

      await this.app.client.waitForExist(
        configs.elements.applications.testIdentity,
        timeouts.launch,
      )
      await this.app.client
        .element(configs.elements.applications.testIdentity)
        .click()

      assert.equal(await this.app.client.getWindowCount(), 2)
    })

    it('install an app', async function() {
      await this.app.client.waitForExist(
        configs.elements.launcher,
        timeouts.viewChange,
      )

      await this.app.client.waitForExist(
        configs.elements.applications.installAppButton,
        timeouts.input,
      )
      await this.app.client
        .element(configs.elements.applications.installAppButton)
        .click()

      // Ensure test app is uploaded to Swarm before trying to install it
      const bzz = new BzzAPI('http://swarm-gateways.net')
      await bzz.uploadDirectoryFrom(getFixture('test-app'))
      const manifestPath = getFixture('test-app-manifest.json')
      await this.app.client.waitForExist(
        configs.elements.applications.installation.appPath,
        timeouts.input,
      )
      await this.app.client.chooseFile(
        configs.elements.applications.installation.appPath,
        manifestPath,
      )

      await this.app.client.waitForExist(
        configs.elements.applications.installation.identityInput,
        timeouts.input,
      )
      await this.app.client
        .element(configs.elements.applications.installation.identityInput)
        .setValue('tester')

      await this.app.client.waitForExist(
        configs.elements.applications.installation.createIdentity,
        timeouts.input,
      )
      await this.app.client
        .element(configs.elements.applications.installation.createIdentity)
        .click()

      await this.app.client.waitForExist(
        configs.elements.applications.installation.testerIdentitySelect,
        timeouts.input,
      )
      await this.app.client
        .element(
          configs.elements.applications.installation.testerIdentitySelect,
        )
        .click()

      await this.app.client.waitForExist(
        configs.elements.applications.installedAppItem,
        timeouts.launch,
      )
      await this.app.client
        .element(configs.elements.applications.installedAppItem)
        .click()

      await this.app.client.waitForExist(
        configs.elements.applications.installation.testerIdentitySelect,
        timeouts.input,
      )
      await this.app.client
        .element(
          configs.elements.applications.installation.testerIdentitySelect,
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

module.exports = {
  launcherTestId: configs,
}
