const timeouts = {
  viewChange: 15000,
  input: 2000,
  launch: 5000,
}

const vaultTestId = {
  elements: {
    createVault: '[data-testid="create-vault-view"]',
    unlockVault: '[data-testid="unlock-vault-view"]',
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

const onboardTestId = {
  elements: {
    onboard: '[data-testid="onboard-view"]',
    vaultIdentity: '[data-testid="onboard-create-identity-input-name"]',
    vaultIdentityValidation:
      '[data-testid="onboard-create-identity-input-name-errorTestId"]',
    vaultIdentityButton: '[data-testid="onboard-create-identity-button"]',
  },
  messages: {
    noIdentity: 'Name is required.',
  },
}

module.exports = {
  timeouts: timeouts,
  vaultTestId: vaultTestId,
  launcherTestId: launcherTestId,
  onboardTestId: onboardTestId,
}
