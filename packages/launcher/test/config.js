const timeouts = {
  unlockVault: 10000,
  input: 2000,
  launch: 5000,
}

const vaultTestId = {
  elements: {
    unlockButton: '[data-testid="vault-manager-unlock-button"]',
    unlockPasswordValidation:
      '[data-testid="vault-manager-unlock-input-errorTestId"]',
    unlockMessage: '[data-testid="vault-manager-unlock-input-messageTestId"]',
    createVaultButton: '[data-testid="create-vault-submit-button"]',
    createPasswordValidation:
      '[data-testid="create-vault-input-password-errorTestId"]',
    createPassword: '[data-testid="create-vault-input-password"]',
  },
  messages: {
    invalidPassword:
      'Failed to unlock vault, please check you entered the correct password.',
    noPassword: 'Password is required.',
  },
}

const launcherTestId = {}

const onboardTestId = {}

module.exports = {
  timeouts: timeouts,
  vaultTestId: vaultTestId,
  launcherTestId: launcherTestId,
  onboardTestId: onboardTestId,
}
