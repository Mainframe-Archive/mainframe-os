const { vaultTestId, launcherTestId, timeouts } = require('./config')

const clearConsole = app => {
  app.client.log('browser') //
}

const checkConsole = (app, logType = 'browser', level = 'SEVERE') => {
  return app.client.log(logType).then(logs => {
    return logs.value.filter(log => {
      return log.level == level
    })
  })
}

const unlockVault = async function(app, password) {
  try {
    await app.client
      .element(vaultTestId.elements.unlockPassword)
      .setValue(password)
    await app.client
      .element(vaultTestId.elements.unlockButton)
      .click()
    await app.client.waitForExist(
      launcherTestId.elements.launcher,
      timeouts.viewChange,
    )
    return { unlocked: true, error: '' }
  } catch (err) {
    return { unlocked: false, error: err }
  }
}

const createVault = async function(app, password) {
  await app.client
    .element(vaultTestId.elements.createPassword)
    .setValue(password)
  await app.client
    .element(vaultTestId.elements.createConfirmPassword)
    .setValue(password)
  await app.client.element(vaultTestId.elements.createVaultButton).click()
}

module.exports = {
  checkConsole: checkConsole,
  clearConsole: clearConsole,
  unlockVault: unlockVault,
  createVaultUI: createVault,
}
