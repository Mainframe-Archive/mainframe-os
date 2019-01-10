/*eslint-env mocha */

const assert = require('assert')
const path = require('path')
const os = require('os')
const Application = require('spectron').Application
const { Environment } = require('../../config/src/Environment')
const {
  setupDaemon,
  startDaemon,
  stopDaemon,
} = require('../../toolbox/src/daemon')
const { createVault, resolvePath } = require('../../cli/src/Command')
const { DaemonConfig } = require('../../config/src/daemon')
const { vaultTestId, onboardTestId, timeouts } = require('./config')
const { checkConsole, unlockVault, createVaultUI } = require('./utils')

describe('Onboarding process', function() {
  this.timeout(10000)

  before(async function() {
    const launcherPath =
      os.platform() === 'darwin'
        ? 'dist/mac/Mainframe.app/Contents/MacOS/Mainframe'
        : 'dist/linux-unpacked/mainframe'
    this.app = new Application({
      path: path.join(__dirname, '..', launcherPath),
    })
    const daemonPath = path.join(__dirname, '..', '..', 'daemon/bin/run')
    await Environment.create('vaultTest', 'testing', true)
    const cfg = new DaemonConfig(Environment)
    setupDaemon(cfg, {
      binPath: resolvePath(daemonPath),
      socketPath: undefined,
    })
    startDaemon(cfg, true)
    this.app.start()
    await createVaultUI(this.app, 'password')
  })

  after(async function() {
    stopDaemon(new DaemonConfig(Environment))
    await Environment.destroy('vaultTest')
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })
})
