const {
  vaultTestId,
  launcherTestId,
  onboardTestId,
  timeouts,
} = require('./config')

const clearConsole = app => {
  app.client.log('browser') //
}

const checkConsole = (app, logType = 'browser') => {
  let warnings = 0,
    errors = 0
  return app.client.log(logType).then(logs => {
    logs.value.forEach(log => {
      switch (log.level) {
        case 'SEVERE':
          errors++
          break
        case 'WARNING':
          warnings++
          break
        default:
          break
      }
    })
    return { errors: errors, warnings: warnings }
  })
}

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
  return { unlocked: false, error: 'Vault was not unlocked correctly' }
}

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
  checkConsole: checkConsole,
  clearConsole: clearConsole,
  unlockVault: unlockVault,
  createVault: createVault,
}
