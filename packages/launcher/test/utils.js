const path = require('path')
const os = require('os')
const Application = require('spectron').Application
const {
  vaultTestId,
  launcherTestId,
  onboardTestId,
  timeouts,
} = require('./config')

const getApp = test => {
  const binPath =
    os.platform() === 'darwin'
      ? 'dist/mac/Mainframe.app/Contents/MacOS/Mainframe'
      : 'dist/linux-unpacked/mainframe'
  test.app = new Application({
    path: path.join(__dirname, '..', binPath),
  })
  return test.app.start()
}

const stopApp = app => {
  if (app && app.isRunning()) {
    return app.stop()
  }
}

const clearConsole = app => {
  app.client.log('browser') // When you request the log, it clears all the logs
}

const checkConsole = (app, logType = 'browser') => {
  const warnings = [],
    errors = []
  return app.client.log(logType).then(logs => {
    logs.value.forEach(log => {
      switch (log.level) {
        case 'SEVERE':
          errors.push(log.message)
          break
        case 'WARNING':
          warnings.push(log.message)
          break
        default:
          break
      }
    })
    return { errors: errors, warnings: warnings }
  })
}

/**
 * This function does the unlock process in mainframe launcher
 * @param app
 * @param password
 * @param waitForLauncher Used for skipping 15 seconds waiting to unlock the vault. Can be set to false if you know you are sending bad password.
 * @returns {Promise<*>}
 */
const unlockVault = async function(app, password, waitForLauncher = true) {
  try {
    await app.client.waitForExist(
      vaultTestId.elements.unlockVault,
      timeouts.viewChange,
    )
    await app.client
      .element(vaultTestId.elements.unlockPassword)
      .setValue(password)
    await app.client.element(vaultTestId.elements.unlockButton).click()
    // Sometimes we don't want to wait for the launcher because we already know that it will fail
    if (waitForLauncher) {
      await app.client.waitForExist(
        launcherTestId.elements.launcher,
        timeouts.viewChange,
      )
      return { unlocked: true, error: '' }
    }
  } catch (err) {
    return { unlocked: false, error: err }
  }
  return { unlocked: false, error: 'Vault was probably not unlocked' }
}

/**
 * This function goes through the vault creation process
 * @param app
 * @param password
 * @returns {Promise<*>}
 */
const createVault = async function(app, password) {
  await app.client.waitForExist(
    vaultTestId.elements.createVault,
    timeouts.viewChange,
  )
  await app.client
    .element(vaultTestId.elements.createPassword)
    .setValue(password)
  await app.client
    .element(vaultTestId.elements.createConfirmPassword)
    .setValue(password)
  await app.client.element(vaultTestId.elements.createVaultButton).click()
  try {
    await app.client.waitForExist(
      onboardTestId.elements.onboard,
      timeouts.viewChange,
    )
    return { created: true, error: '' }
  } catch (err) {
    return { created: false, error: err }
  }
}

module.exports = {
  getApp: getApp,
  stopApp: stopApp,
  checkConsole: checkConsole,
  clearConsole: clearConsole,
  unlockVault: unlockVault,
  createVault: createVault,
}
