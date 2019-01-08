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
      .element('[data-testid="vault-manager-unlock-input"]')
      .setValue(password)
    await app.client
      .element('[data-testid="vault-manager-unlock-button"]')
      .click()
    await app.client.waitForExist(
      '[data-testid="launcher-view"]',
      timeouts.unlockVault,
    )
    return { unlocked: true, error: '' }
  } catch (err) {
    return { unlocked: false, error: err }
  }
}

module.exports = {
  checkConsole: checkConsole,
  clearConsole: clearConsole,
  unlockVault: unlockVault,
}
