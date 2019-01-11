const timeouts = {
  viewChange: 15000,
  input: 2000,
  launch: 5000,
}

const vaultTestId = {
  elements: {
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

const launcherTestId = {
  elements: {
    launcher: '[data-testid="launcher-view"]',
  },
}

const onboardTestId = {
    elements: {
        onboard: '[data-testid="onboard-view"]'
    }
}

module.exports = {
  timeouts: timeouts,
  vaultTestId: vaultTestId,
  launcherTestId: launcherTestId,
  onboardTestId: onboardTestId,
}
